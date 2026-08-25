import React, { useState } from 'react';
import {
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CalendarEvent,
  CalendarActivity,
  FilterState,
  ResourceConflict,
} from '../../types';
import {
  EVENT_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  EVENT_TYPE_LABELS,
} from '../../data/mockData';
import { getActivityIcon } from '../IconHelper';
import { getMonthGrid } from '../../utils/dateUtils';
import { Video, AlertTriangle, Clock, MapPin, Truck, Plus } from 'lucide-react';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  activities: CalendarActivity[];
  filters: FilterState;
  onEventClick: (event: CalendarEvent) => void;
  onActivityClick: (activity: CalendarActivity) => void;
  onCellClick: (date: Date) => void;
  onRescheduleItem: (id: string, type: 'event' | 'activity', newDate: string) => void;
  conflicts: ResourceConflict[];
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  activities,
  filters,
  onEventClick,
  onActivityClick,
  onCellClick,
  onRescheduleItem,
  conflicts,
}) => {
  const [draggedItem, setDraggedItem] = useState<{
    id: string;
    type: 'event' | 'activity';
  } | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<Date | null>(null);

  const weeks = getMonthGrid(currentDate);

  // Filter items
  const filteredEvents = events.filter((evt) => {
    if (!filters.showEvents) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        evt.title.toLowerCase().includes(q) ||
        evt.clientName.toLowerCase().includes(q) ||
        (evt.relatedDocCode && evt.relatedDocCode.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (
      filters.selectedEventTypes.length > 0 &&
      !filters.selectedEventTypes.includes(evt.eventType)
    ) {
      return false;
    }
    if (
      filters.selectedUserIds.length > 0 &&
      !filters.selectedUserIds.includes(evt.leadResponsibleId)
    ) {
      return false;
    }
    if (
      filters.selectedBranches.length > 0 &&
      !filters.selectedBranches.includes(evt.branchId)
    ) {
      return false;
    }
    return true;
  });

  const filteredActivities = activities.filter((act) => {
    if (!filters.showActivities) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        act.title.toLowerCase().includes(q) ||
        (act.clientName && act.clientName.toLowerCase().includes(q)) ||
        (act.eventTitle && act.eventTitle.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (
      filters.selectedActivityTypes.length > 0 &&
      !filters.selectedActivityTypes.includes(act.activityType)
    ) {
      return false;
    }
    if (
      filters.selectedUserIds.length > 0 &&
      !filters.selectedUserIds.includes(act.responsibleId)
    ) {
      return false;
    }
    return true;
  });

  const getItemsForDay = (day: Date) => {
    const dayEvents = filteredEvents.filter((e) => {
      const start = parseISO(e.startDate);
      const end = parseISO(e.endDate);
      const dayTime = day.getTime();
      const startDayTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
      const endDayTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
      return dayTime >= startDayTime && dayTime <= endDayTime;
    });

    const dayActivities = filteredActivities.filter((a) => {
      const start = parseISO(a.startDate);
      return isSameDay(start, day);
    });

    return { dayEvents, dayActivities };
  };

  const handleDragStart = (id: string, type: 'event' | 'activity') => {
    setDraggedItem({ id, type });
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    setDragOverDate(dateStr);
  };

  const handleDrop = (e: React.DragEvent, targetDay: Date) => {
    e.preventDefault();
    setDragOverDate(null);
    if (!draggedItem) return;

    const dateFormatted = format(targetDay, 'yyyy-MM-dd');
    onRescheduleItem(draggedItem.id, draggedItem.type, dateFormatted);
    setDraggedItem(null);
  };

  const weekDayHeaders = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden select-none">
      {/* Day of week headers */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70 text-center py-2 shrink-0">
        {weekDayHeaders.map((dayName, idx) => (
          <div key={idx} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span className="hidden sm:inline">{dayName}</span>
            <span className="sm:hidden">{dayName.substring(0, 3)}</span>
          </div>
        ))}
      </div>

      {/* 5-6 Week rows grid */}
      <div className="flex-1 grid grid-rows-5 md:grid-rows-6 grid-cols-7 overflow-y-auto divide-x divide-y divide-slate-200">
        {weeks.flat().map((day, idx) => {
          const isCurrMonth = isSameMonth(day, currentDate);
          const isCurDay = isToday(day);
          const { dayEvents, dayActivities } = getItemsForDay(day);
          const totalItems = dayEvents.length + dayActivities.length;
          const dateIso = format(day, 'yyyy-MM-dd');
          const isDragTarget = dragOverDate === dateIso;

          // Limit displayed items to 3 per cell in regular view
          const maxVisible = 3;
          const visibleEvents = dayEvents.slice(0, maxVisible);
          const remainingSlots = Math.max(0, maxVisible - visibleEvents.length);
          const visibleActivities = dayActivities.slice(0, remainingSlots);
          const hiddenCount = totalItems - (visibleEvents.length + visibleActivities.length);

          return (
            <div
              key={idx}
              onDragOver={(e) => handleDragOver(e, dateIso)}
              onDragLeave={() => setDragOverDate(null)}
              onDrop={(e) => handleDrop(e, day)}
              onClick={() => onCellClick(day)}
              className={`min-h-[100px] p-1.5 flex flex-col transition-colors group relative cursor-pointer ${
                !isCurrMonth
                  ? 'bg-slate-50/50 text-slate-400'
                  : 'bg-white text-slate-800 hover:bg-slate-50/80'
              } ${isDragTarget ? 'bg-blue-50/80 ring-2 ring-blue-500 inset-0 z-10' : ''}`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between mb-1 px-1">
                <span
                  className={`text-xs font-semibold h-6 w-6 flex items-center justify-center rounded-full transition-all ${
                    isCurDay
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : isCurrMonth
                      ? 'text-slate-700 group-hover:bg-slate-200/70'
                      : 'text-slate-400'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {/* Quick Add Button on Hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCellClick(day);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                  title="Agregar evento o actividad"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Items container */}
              <div className="flex-1 space-y-1 overflow-hidden">
                {/* Event Bars */}
                {visibleEvents.map((evt) => {
                  const hasConflict = conflicts.some((c) =>
                    c.conflictingItems.some((ci) => ci.id === evt.id)
                  );

                  return (
                    <div
                      key={evt.id}
                      draggable
                      onDragStart={() => handleDragStart(evt.id, 'event')}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(evt);
                      }}
                      className="px-2 py-0.5 rounded text-[11px] font-semibold text-white truncate shadow-2xs hover:brightness-95 transition-all flex items-center gap-1 cursor-grab active:cursor-grabbing"
                      style={{ backgroundColor: evt.color || '#3b82f6' }}
                      title={`${evt.title} (${evt.clientName})`}
                    >
                      {hasConflict && (
                        <AlertTriangle className="w-3 h-3 text-amber-200 shrink-0 animate-pulse" />
                      )}
                      <span className="font-bold text-[10px] uppercase opacity-90 shrink-0">
                        {EVENT_TYPE_LABELS[evt.eventType]?.label.substring(0, 4)}:
                      </span>
                      <span className="truncate">{evt.title}</span>
                    </div>
                  );
                })}

                {/* Activity Chips */}
                {visibleActivities.map((act) => {
                  const hasMeet = act.virtualMeeting?.hasMeeting;
                  const timeFormatted = format(parseISO(act.startDate), 'HH:mm');

                  return (
                    <div
                      key={act.id}
                      draggable
                      onDragStart={() => handleDragStart(act.id, 'activity')}
                      onClick={(e) => {
                        e.stopPropagation();
                        onActivityClick(act);
                      }}
                      className="px-1.5 py-0.5 rounded-md text-[11px] bg-slate-100/90 hover:bg-slate-200 border border-slate-200/80 text-slate-800 truncate flex items-center gap-1.5 transition-all cursor-grab active:cursor-grabbing"
                      title={`${act.title} · ${timeFormatted} hrs`}
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: act.color || '#0ea5e9' }}
                      />
                      <div className="shrink-0 text-slate-500">
                        {getActivityIcon(act.activityType, 'w-3 h-3')}
                      </div>
                      <span className="font-semibold text-[10px] text-slate-500 shrink-0">
                        {timeFormatted}
                      </span>
                      <span className="truncate text-slate-700">{act.title}</span>
                      {hasMeet && (
                        <Video className="w-3 h-3 text-emerald-600 shrink-0 ml-auto" />
                      )}
                    </div>
                  );
                })}

                {/* More items indicator popover */}
                {hiddenCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedDay(day);
                    }}
                    className="text-[10px] font-bold text-slate-500 hover:text-blue-600 hover:bg-slate-100 px-1 py-0.5 rounded w-full text-left transition-colors"
                  >
                    +{hiddenCount} más...
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Day Popover Modal */}
      {expandedDay && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs"
          onClick={() => setExpandedDay(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 capitalize">
                  {format(expandedDay, "EEEE, d 'de' MMMM", { locale: es })}
                </h3>
                <p className="text-xs text-slate-500">
                  Eventos y actividades programadas
                </p>
              </div>
              <button
                onClick={() => setExpandedDay(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {getItemsForDay(expandedDay).dayEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => {
                    setExpandedDay(null);
                    onEventClick(evt);
                  }}
                  className="p-2.5 rounded-xl border text-white cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: evt.color || '#2563eb' }}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>{EVENT_TYPE_LABELS[evt.eventType]?.label}</span>
                    <span>{EVENT_STATUS_LABELS[evt.status]?.label}</span>
                  </div>
                  <div className="font-bold text-sm">{evt.title}</div>
                  <div className="text-xs opacity-90 mt-1 flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{evt.locationName}</span>
                  </div>
                </div>
              ))}

              {getItemsForDay(expandedDay).dayActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => {
                    setExpandedDay(null);
                    onActivityClick(act);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      {getActivityIcon(act.activityType, 'w-3.5 h-3.5')}
                      {ACTIVITY_TYPE_LABELS[act.activityType]?.label}
                    </span>
                    <span className="font-bold text-blue-600">
                      {format(parseISO(act.startDate), 'HH:mm')} -{' '}
                      {format(parseISO(act.endDate), 'HH:mm')}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-slate-800">
                    {act.title}
                  </div>
                  {act.eventTitle && (
                    <div className="text-xs text-slate-500 mt-1">
                      Evento: {act.eventTitle}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const dayToCreate = expandedDay;
                setExpandedDay(null);
                onCellClick(dayToCreate);
              }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              + Agregar elemento a este día
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
