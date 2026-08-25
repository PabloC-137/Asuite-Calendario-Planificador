import React from 'react';
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isPast,
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
import {
  Video,
  Clock,
  MapPin,
  FileText,
  User,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface AgendaViewProps {
  events: CalendarEvent[];
  activities: CalendarActivity[];
  filters: FilterState;
  onEventClick: (event: CalendarEvent) => void;
  onActivityClick: (activity: CalendarActivity) => void;
  conflicts: ResourceConflict[];
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  events,
  activities,
  filters,
  onEventClick,
  onActivityClick,
  conflicts,
}) => {
  // Combine all items into chronological list
  interface AgendaItem {
    id: string;
    itemType: 'event' | 'activity';
    dateIso: string;
    startDate: string;
    endDate: string;
    rawEvent?: CalendarEvent;
    rawActivity?: CalendarActivity;
  }

  const allItems: AgendaItem[] = [];

  if (filters.showEvents) {
    events.forEach((evt) => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!evt.title.toLowerCase().includes(q) && !evt.clientName.toLowerCase().includes(q)) return;
      }
      if (filters.selectedEventTypes.length > 0 && !filters.selectedEventTypes.includes(evt.eventType)) return;
      if (filters.selectedUserIds.length > 0 && !filters.selectedUserIds.includes(evt.leadResponsibleId)) return;

      allItems.push({
        id: evt.id,
        itemType: 'event',
        dateIso: evt.startDate.split('T')[0],
        startDate: evt.startDate,
        endDate: evt.endDate,
        rawEvent: evt,
      });
    });
  }

  if (filters.showActivities) {
    activities.forEach((act) => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!act.title.toLowerCase().includes(q) && !(act.clientName && act.clientName.toLowerCase().includes(q))) return;
      }
      if (filters.selectedActivityTypes.length > 0 && !filters.selectedActivityTypes.includes(act.activityType)) return;
      if (filters.selectedUserIds.length > 0 && !filters.selectedUserIds.includes(act.responsibleId)) return;

      allItems.push({
        id: act.id,
        itemType: 'activity',
        dateIso: act.startDate.split('T')[0],
        startDate: act.startDate,
        endDate: act.endDate,
        rawActivity: act,
      });
    });
  }

  // Sort ascending by start date
  allItems.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Group by dateIso
  const groupedByDate = allItems.reduce((acc, item) => {
    if (!acc[item.dateIso]) {
      acc[item.dateIso] = [];
    }
    acc[item.dateIso].push(item);
    return acc;
  }, {} as Record<string, AgendaItem[]>);

  const dateKeys = Object.keys(groupedByDate).sort();

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6 custom-scrollbar select-none">
      {dateKeys.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No hay eventos ni actividades</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No se encontraron elementos con los filtros seleccionados o el criterio de búsqueda.
          </p>
        </div>
      ) : (
        dateKeys.map((dateStr) => {
          const dateObj = parseISO(dateStr);
          const isCurr = isToday(dateObj);
          const isTmrw = isTomorrow(dateObj);
          const dayItems = groupedByDate[dateStr];

          return (
            <div key={dateStr} className="space-y-3">
              {/* Date Header Badge */}
              <div className="flex items-center gap-3 sticky top-0 bg-slate-100/90 backdrop-blur-xs py-1.5 px-3 rounded-xl border border-slate-200 z-10">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    isCurr
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {format(dateObj, 'd')}
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 capitalize">
                    {format(dateObj, "EEEE, d 'de' MMMM", { locale: es })}
                  </span>
                  {isCurr && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-full">
                      Hoy
                    </span>
                  )}
                  {isTmrw && (
                    <span className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-full">
                      Mañana
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-medium ml-auto">
                  {dayItems.length} elemento{dayItems.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Items list for this day */}
              <div className="space-y-2.5 pl-2 sm:pl-4">
                {dayItems.map((item) => {
                  if (item.itemType === 'event' && item.rawEvent) {
                    const evt = item.rawEvent;
                    const hasConflict = conflicts.some((c) =>
                      c.conflictingItems.some((ci) => ci.id === evt.id)
                    );

                    return (
                      <div
                        key={evt.id}
                        onClick={() => onEventClick(evt)}
                        className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Color bar */}
                          <div
                            className="w-1.5 self-stretch rounded-full shrink-0"
                            style={{ backgroundColor: evt.color || '#2563eb' }}
                          />

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className="px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-2xs"
                                style={{ backgroundColor: evt.color || '#2563eb' }}
                              >
                                {EVENT_TYPE_LABELS[evt.eventType]?.label}
                              </span>

                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                                  EVENT_STATUS_LABELS[evt.status]?.badgeClass
                                }`}
                              >
                                {EVENT_STATUS_LABELS[evt.status]?.label}
                              </span>

                              {evt.relatedDocCode && (
                                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-slate-400" />
                                  {evt.relatedDocCode}
                                </span>
                              )}

                              {hasConflict && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 animate-pulse">
                                  <AlertTriangle className="w-3 h-3" /> Conflicto de recursos
                                </span>
                              )}
                            </div>

                            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {evt.title}
                            </h4>

                            <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                              <span className="font-semibold text-slate-700">
                                {evt.clientName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {format(parseISO(evt.startDate), 'HH:mm')} –{' '}
                                {format(parseISO(evt.endDate), 'HH:mm')} hrs
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {evt.locationName}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Responsible and button */}
                        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                          {evt.leadResponsibleAvatar && (
                            <div className="flex items-center gap-2 text-right">
                              <div>
                                <div className="text-xs font-bold text-slate-800">
                                  {evt.leadResponsibleName}
                                </div>
                                <div className="text-[10px] text-slate-400">Responsable</div>
                              </div>
                              <img
                                src={evt.leadResponsibleAvatar}
                                alt={evt.leadResponsibleName}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                            </div>
                          )}
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  }

                  if (item.itemType === 'activity' && item.rawActivity) {
                    const act = item.rawActivity;
                    const hasMeet = act.virtualMeeting?.hasMeeting;
                    const hasConflict = conflicts.some((c) =>
                      c.conflictingItems.some((ci) => ci.id === act.id)
                    );

                    return (
                      <div
                        key={act.id}
                        onClick={() => onActivityClick(act)}
                        className="bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
                            style={{
                              backgroundColor: `${act.color}18`,
                              color: act.color || '#0ea5e9',
                            }}
                          >
                            {getActivityIcon(act.activityType, 'w-4 h-4')}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-700">
                                {ACTIVITY_TYPE_LABELS[act.activityType]?.label}
                              </span>

                              {act.eventTitle && (
                                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 truncate max-w-[200px]">
                                  {act.eventTitle}
                                </span>
                              )}

                              {hasMeet && (
                                <a
                                  href={act.virtualMeeting?.meetUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[11px] font-bold transition-colors shadow-2xs"
                                >
                                  <Video className="w-3 h-3" /> Unirse a Meet
                                </a>
                              )}

                              {hasConflict && (
                                <span className="text-rose-600 text-[11px] font-bold flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> Conflicto
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {act.title}
                            </h4>

                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                              <span className="flex items-center gap-1 font-semibold text-slate-600">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {format(parseISO(act.startDate), 'HH:mm')} –{' '}
                                {format(parseISO(act.endDate), 'HH:mm')} hrs
                              </span>
                              {act.location && (
                                <span className="flex items-center gap-1 truncate max-w-xs">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  {act.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right info */}
                        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                          {act.responsibleName && (
                            <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                              {act.responsibleName}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
