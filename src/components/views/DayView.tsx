import React, { useRef, useEffect } from 'react';
import {
  format,
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
  PRIORITY_LABELS,
} from '../../data/mockData';
import { getActivityIcon } from '../IconHelper';
import { HOURS_IN_DAY, getItemTimePosition } from '../../utils/dateUtils';
import { Video, AlertTriangle, Clock, MapPin, Truck, CheckCircle2, User, Building } from 'lucide-react';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  activities: CalendarActivity[];
  filters: FilterState;
  onEventClick: (event: CalendarEvent) => void;
  onActivityClick: (activity: CalendarActivity) => void;
  onSlotClick: (date: Date, hour: number) => void;
  conflicts: ResourceConflict[];
}

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  activities,
  filters,
  onEventClick,
  onActivityClick,
  onSlotClick,
  conflicts,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isCurDay = isToday(currentDate);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 7 * 60; // scroll to 07:00
    }
  }, [currentDate]);

  const dateKey = format(currentDate, 'yyyy-MM-dd');

  // Filter events and activities occurring on this day
  const dayEvents = events.filter((e) => {
    if (!filters.showEvents) return false;
    const start = parseISO(e.startDate);
    const end = parseISO(e.endDate);
    const dayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();
    const dayEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59).getTime();
    return start.getTime() <= dayEnd && end.getTime() >= dayStart;
  });

  const dayActivities = activities.filter((a) => {
    if (!filters.showActivities) return false;
    const startStr = a.startDate.split('T')[0];
    return startStr === dateKey;
  });

  const currentNow = new Date();
  const currentMinutesFromMidnight = currentNow.getHours() * 60 + currentNow.getMinutes();

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden select-none">
      {/* Day Header Banner */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold shadow-xs ${
              isCurDay ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'
            }`}
          >
            <span className="text-[11px] uppercase tracking-wider -mb-1">
              {format(currentDate, 'EEE', { locale: es })}
            </span>
            <span className="text-xl leading-none">{format(currentDate, 'd')}</span>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 capitalize">
              {format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span>{dayEvents.length} Evento{dayEvents.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{dayActivities.length} Actividad{dayActivities.length !== 1 ? 'es' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Timeline View */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex overflow-y-auto overflow-x-hidden relative custom-scrollbar"
      >
        {/* Time gutter */}
        <div className="w-20 bg-slate-50/50 border-r border-slate-200 shrink-0 select-none">
          {HOURS_IN_DAY.map((hour) => (
            <div
              key={hour}
              className="h-[60px] relative border-b border-slate-100 pr-3 text-right text-xs font-semibold text-slate-400 -top-2.5"
            >
              {hour === 0 ? '' : `${String(hour).padStart(2, '0')}:00`}
            </div>
          ))}
        </div>

        {/* Schedule grid with Event & Activity lanes */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-200 relative">
          {/* Lane 1: Eventos Principales */}
          <div className="relative min-w-0">
            <div className="sticky top-0 bg-white/95 backdrop-blur-xs py-1.5 px-3 border-b border-slate-200 text-xs font-bold text-slate-600 z-10">
              Eventos y Servicios Principales
            </div>

            {HOURS_IN_DAY.map((hour) => (
              <div
                key={hour}
                onClick={() => onSlotClick(currentDate, hour)}
                className="h-[60px] border-b border-slate-100 hover:bg-blue-50/30 transition-colors cursor-pointer relative"
              />
            ))}

            {/* Current time marker */}
            {isCurDay && (
              <div
                className="absolute inset-x-0 border-t-2 border-red-500 z-20 pointer-events-none"
                style={{ top: `${currentMinutesFromMidnight + 28}px` }}
              />
            )}

            {/* Day Events */}
            {dayEvents.map((evt) => {
              const { topPx, heightPx } = getItemTimePosition(evt.startDate, evt.endDate);
              const hasConflict = conflicts.some((c) =>
                c.conflictingItems.some((ci) => ci.id === evt.id)
              );

              return (
                <div
                  key={evt.id}
                  onClick={() => onEventClick(evt)}
                  className="absolute inset-x-2 rounded-xl p-3 text-white shadow-md border border-white/20 cursor-pointer hover:shadow-lg transition-all z-10 flex flex-col justify-between"
                  style={{
                    top: `${topPx + 32}px`,
                    height: `${heightPx}px`,
                    backgroundColor: evt.color || '#2563eb',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                        {EVENT_TYPE_LABELS[evt.eventType]?.label}
                      </span>
                      <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                        {EVENT_STATUS_LABELS[evt.status]?.label}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm mt-1.5 line-clamp-2">{evt.title}</h4>
                    <p className="text-xs opacity-90 truncate mt-0.5 font-medium">{evt.clientName}</p>

                    <div className="flex items-center gap-2 text-xs opacity-90 mt-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{evt.locationName}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {format(parseISO(evt.startDate), 'HH:mm')} - {format(parseISO(evt.endDate), 'HH:mm')}
                    </span>
                    <span>{evt.assignedResources.length} Recursos</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lane 2: Actividades Operativas */}
          <div className="relative min-w-0">
            <div className="sticky top-0 bg-white/95 backdrop-blur-xs py-1.5 px-3 border-b border-slate-200 text-xs font-bold text-slate-600 z-10">
              Actividades Operativas & Logística
            </div>

            {HOURS_IN_DAY.map((hour) => (
              <div
                key={hour}
                onClick={() => onSlotClick(currentDate, hour)}
                className="h-[60px] border-b border-slate-100 hover:bg-teal-50/30 transition-colors cursor-pointer relative"
              />
            ))}

            {/* Current time marker */}
            {isCurDay && (
              <div
                className="absolute inset-x-0 border-t-2 border-red-500 z-20 pointer-events-none"
                style={{ top: `${currentMinutesFromMidnight + 28}px` }}
              />
            )}

            {/* Day Activities */}
            {dayActivities.map((act) => {
              const { topPx, heightPx } = getItemTimePosition(act.startDate, act.endDate);
              const hasMeet = act.virtualMeeting?.hasMeeting;

              return (
                <div
                  key={act.id}
                  onClick={() => onActivityClick(act)}
                  className="absolute inset-x-2 rounded-xl p-3 bg-white border-l-4 shadow-sm border border-slate-200/90 cursor-pointer hover:shadow-md hover:bg-slate-50 transition-all z-10 flex flex-col justify-between"
                  style={{
                    top: `${topPx + 32}px`,
                    height: `${heightPx}px`,
                    borderLeftColor: act.color || '#0ea5e9',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-bold text-slate-800">
                        {getActivityIcon(act.activityType, 'w-4 h-4')}
                        {ACTIVITY_TYPE_LABELS[act.activityType]?.label}
                      </span>
                      {hasMeet && (
                        <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                          <Video className="w-3.5 h-3.5" /> Google Meet
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 mt-1">{act.title}</h4>

                    {act.eventTitle && (
                      <div className="text-xs text-blue-600 font-semibold truncate mt-0.5">
                        Evento: {act.eventTitle}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {format(parseISO(act.startDate), 'HH:mm')} - {format(parseISO(act.endDate), 'HH:mm')}
                    </span>
                    {act.responsibleName && (
                      <span className="font-bold text-slate-700">{act.responsibleName}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
