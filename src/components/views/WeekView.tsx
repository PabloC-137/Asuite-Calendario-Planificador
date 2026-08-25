import React, { useRef, useEffect, useState } from 'react';
import {
  format,
  isSameDay,
  isToday,
  parseISO,
  setHours,
  setMinutes,
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
import { getWeekDays, HOURS_IN_DAY, getItemTimePosition } from '../../utils/dateUtils';
import { Video, AlertTriangle, Clock, MapPin, Plus } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  activities: CalendarActivity[];
  filters: FilterState;
  onEventClick: (event: CalendarEvent) => void;
  onActivityClick: (activity: CalendarActivity) => void;
  onSlotClick: (date: Date, hour: number) => void;
  onRescheduleItemTime: (id: string, type: 'event' | 'activity', targetDate: string, targetHour: number) => void;
  conflicts: ResourceConflict[];
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  activities,
  filters,
  onEventClick,
  onActivityClick,
  onSlotClick,
  onRescheduleItemTime,
  conflicts,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const weekDays = getWeekDays(currentDate);

  const [draggedItem, setDraggedItem] = useState<{
    id: string;
    type: 'event' | 'activity';
  } | null>(null);

  // Auto-scroll to 07:00 AM on initial load
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 7 * 60; // 07:00 AM in px
    }
  }, [currentDate]);

  // Filter items
  const filteredEvents = events.filter((evt) => {
    if (!filters.showEvents) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      if (!evt.title.toLowerCase().includes(q) && !evt.clientName.toLowerCase().includes(q)) return false;
    }
    if (filters.selectedEventTypes.length > 0 && !filters.selectedEventTypes.includes(evt.eventType)) return false;
    if (filters.selectedUserIds.length > 0 && !filters.selectedUserIds.includes(evt.leadResponsibleId)) return false;
    if (filters.selectedBranches.length > 0 && !filters.selectedBranches.includes(evt.branchId)) return false;
    return true;
  });

  const filteredActivities = activities.filter((act) => {
    if (!filters.showActivities) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      if (!act.title.toLowerCase().includes(q) && !(act.clientName && act.clientName.toLowerCase().includes(q))) return false;
    }
    if (filters.selectedActivityTypes.length > 0 && !filters.selectedActivityTypes.includes(act.activityType)) return false;
    if (filters.selectedUserIds.length > 0 && !filters.selectedUserIds.includes(act.responsibleId)) return false;
    return true;
  });

  const handleDragStart = (id: string, type: 'event' | 'activity') => {
    setDraggedItem({ id, type });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropSlot = (day: Date, hour: number) => {
    if (!draggedItem) return;
    const dateFormatted = format(day, 'yyyy-MM-dd');
    onRescheduleItemTime(draggedItem.id, draggedItem.type, dateFormatted, hour);
    setDraggedItem(null);
  };

  // Current time position (for Aug 25 2026, or current time)
  const currentNow = new Date();
  const currentMinutesFromMidnight = currentNow.getHours() * 60 + currentNow.getMinutes();

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden select-none">
      {/* Week Header: Day names + All-day events */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 shrink-0">
        {/* Timezone label header */}
        <div className="w-16 sm:w-20 p-2 text-right text-[11px] font-bold text-slate-400 border-r border-slate-200 flex flex-col justify-end">
          <span>GMT-6</span>
        </div>

        {/* 7 Day columns header */}
        <div className="flex-1 grid grid-cols-7 divide-x divide-slate-200">
          {weekDays.map((day, idx) => {
            const isCurDay = isToday(day);
            return (
              <div
                key={idx}
                className={`py-2 text-center transition-colors ${
                  isCurDay ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {format(day, 'EEE', { locale: es })}
                </div>
                <div
                  className={`inline-flex items-center justify-center h-8 w-8 text-sm font-bold rounded-full mt-0.5 ${
                    isCurDay
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-800'
                  }`}
                >
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-y-auto overflow-x-hidden relative custom-scrollbar"
      >
        {/* Time column (Left Gutter) */}
        <div className="w-16 sm:w-20 bg-slate-50/50 border-r border-slate-200 shrink-0 select-none">
          {HOURS_IN_DAY.map((hour) => (
            <div
              key={hour}
              className="h-[60px] relative border-b border-slate-100 pr-2 text-right text-[11px] font-semibold text-slate-400 -top-2.5"
            >
              {hour === 0 ? '' : `${String(hour).padStart(2, '0')}:00`}
            </div>
          ))}
        </div>

        {/* 7 Days Columns Grid */}
        <div className="flex-1 grid grid-cols-7 divide-x divide-slate-200 relative">
          {weekDays.map((day, dayIdx) => {
            const isCurDay = isToday(day);

            // Filter items that occur on this day
            const dayEvents = filteredEvents.filter((e) => {
              const start = parseISO(e.startDate);
              return isSameDay(start, day);
            });

            const dayActivities = filteredActivities.filter((a) => {
              const start = parseISO(a.startDate);
              return isSameDay(start, day);
            });

            return (
              <div
                key={dayIdx}
                className={`relative min-w-0 ${isCurDay ? 'bg-blue-50/20' : ''}`}
                onDragOver={handleDragOver}
              >
                {/* 24 Hour slot lines */}
                {HOURS_IN_DAY.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => onSlotClick(day, hour)}
                    onDrop={() => handleDropSlot(day, hour)}
                    className="h-[60px] border-b border-slate-100 hover:bg-blue-50/40 transition-colors cursor-pointer relative group"
                  >
                    {/* Subtle half-hour dashed line */}
                    <div className="absolute top-[30px] inset-x-0 border-b border-slate-100/60 border-dashed pointer-events-none" />
                  </div>
                ))}

                {/* Red Current Time Line if this is today */}
                {isCurDay && (
                  <div
                    className="absolute inset-x-0 border-t-2 border-red-500 z-20 pointer-events-none flex items-center"
                    style={{ top: `${currentMinutesFromMidnight}px` }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.5 shadow-xs" />
                  </div>
                )}

                {/* Event Blocks */}
                {dayEvents.map((evt) => {
                  const { topPx, heightPx } = getItemTimePosition(
                    evt.startDate,
                    evt.endDate
                  );
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
                      className="absolute inset-x-1 rounded-lg p-2 text-white shadow-md border border-white/20 overflow-hidden cursor-grab active:cursor-grabbing hover:brightness-105 transition-all z-10 flex flex-col justify-between"
                      style={{
                        top: `${topPx}px`,
                        height: `${heightPx}px`,
                        backgroundColor: evt.color || '#2563eb',
                      }}
                      title={`${evt.title} (${evt.clientName})`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/25 px-1.5 py-0.5 rounded">
                            {EVENT_TYPE_LABELS[evt.eventType]?.label}
                          </span>
                          {hasConflict && (
                            <span className="flex items-center gap-0.5 text-[10px] bg-rose-900/80 text-rose-200 px-1 rounded font-bold animate-pulse">
                              <AlertTriangle className="w-3 h-3" /> Conflicto
                            </span>
                          )}
                        </div>

                        <div className="font-bold text-xs mt-1 leading-tight line-clamp-2">
                          {evt.title}
                        </div>

                        <div className="text-[11px] opacity-90 truncate mt-0.5">
                          {evt.clientName}
                        </div>
                      </div>

                      <div className="text-[10px] opacity-85 font-medium flex items-center justify-between pt-1 border-t border-white/20">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(parseISO(evt.startDate), 'HH:mm')} -{' '}
                          {format(parseISO(evt.endDate), 'HH:mm')}
                        </span>
                        {evt.assignedResources.length > 0 && (
                          <span className="bg-white/20 px-1 rounded">
                            {evt.assignedResources.length} rec
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Activity Blocks */}
                {dayActivities.map((act) => {
                  const { topPx, heightPx } = getItemTimePosition(
                    act.startDate,
                    act.endDate
                  );
                  const hasMeet = act.virtualMeeting?.hasMeeting;
                  const hasConflict = conflicts.some((c) =>
                    c.conflictingItems.some((ci) => ci.id === act.id)
                  );

                  return (
                    <div
                      key={act.id}
                      draggable
                      onDragStart={() => handleDragStart(act.id, 'activity')}
                      onClick={(e) => {
                        e.stopPropagation();
                        onActivityClick(act);
                      }}
                      className="absolute inset-x-1.5 rounded-lg p-1.5 bg-white border-l-4 shadow-sm border border-slate-200/90 overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-md hover:bg-slate-50 transition-all z-10 flex flex-col justify-between"
                      style={{
                        top: `${topPx}px`,
                        height: `${heightPx}px`,
                        borderLeftColor: act.color || '#0ea5e9',
                      }}
                      title={`${act.title} · ${ACTIVITY_TYPE_LABELS[act.activityType]?.label}`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 text-[10px] text-slate-500 font-semibold">
                          <span className="flex items-center gap-1">
                            {getActivityIcon(act.activityType, 'w-3 h-3')}
                            {ACTIVITY_TYPE_LABELS[act.activityType]?.label}
                          </span>
                          {hasMeet && (
                            <span className="flex items-center gap-0.5 text-emerald-700 bg-emerald-50 px-1 rounded font-bold">
                              <Video className="w-3 h-3" /> Meet
                            </span>
                          )}
                          {hasConflict && (
                            <AlertTriangle className="w-3 h-3 text-rose-500 animate-pulse" />
                          )}
                        </div>

                        <div className="font-semibold text-xs text-slate-800 line-clamp-1 mt-0.5">
                          {act.title}
                        </div>

                        {act.eventTitle && (
                          <div className="text-[10px] text-blue-600 truncate">
                            {act.eventTitle}
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between">
                        <span>
                          {format(parseISO(act.startDate), 'HH:mm')} -{' '}
                          {format(parseISO(act.endDate), 'HH:mm')}
                        </span>
                        {act.responsibleName && (
                          <span className="truncate max-w-[70px] text-slate-600 font-semibold">
                            {act.responsibleName.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
