import React, { useState } from 'react';
import {
  format,
  parseISO,
  isSameDay,
  isToday,
  addDays,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CalendarEvent,
  CalendarActivity,
  Resource,
  ResourceType,
  ResourceConflict,
} from '../../types';
import { RESOURCES, EVENT_TYPE_LABELS, ACTIVITY_TYPE_LABELS } from '../../data/mockData';
import {
  Truck,
  Volume2,
  Tv,
  Wrench,
  User,
  AlertTriangle,
  Clock,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface ResourcePlannerViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  activities: CalendarActivity[];
  onEventClick: (event: CalendarEvent) => void;
  onActivityClick: (activity: CalendarActivity) => void;
  conflicts: ResourceConflict[];
  onOpenConflictsModal: () => void;
}

export const ResourcePlannerView: React.FC<ResourcePlannerViewProps> = ({
  currentDate,
  events,
  activities,
  onEventClick,
  onActivityClick,
  conflicts,
  onOpenConflictsModal,
}) => {
  const [selectedResourceType, setSelectedResourceType] = useState<ResourceType | 'all'>('all');
  const [timelineMode, setTimelineMode] = useState<'day' | '3days'>('day');

  const filteredResources = RESOURCES.filter((r) => {
    if (selectedResourceType === 'all') return true;
    return r.type === selectedResourceType;
  });

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'vehicle':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'equipment':
        return <Volume2 className="w-4 h-4 text-purple-600" />;
      case 'room':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'technician':
      case 'personnel':
        return <User className="w-4 h-4 text-amber-600" />;
      default:
        return <Wrench className="w-4 h-4 text-slate-600" />;
    }
  };

  // Build hours column for current date: 06:00 to 23:00 (18 hours)
  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 23 PM

  // Helper to calculate position in percentage for the day timeline (from 06:00 to 24:00 = 18 hours = 1080 min)
  const calculateTimelinePosition = (startIso: string, endIso: string) => {
    const start = parseISO(startIso);
    const end = parseISO(endIso);

    const startMinutes = (start.getHours() - 6) * 60 + start.getMinutes();
    const endMinutes = (end.getHours() - 6) * 60 + end.getMinutes();

    const totalMinutes = 18 * 60; // 1080 min

    const leftPercent = Math.max(0, (startMinutes / totalMinutes) * 100);
    const widthPercent = Math.max(3, ((endMinutes - startMinutes) / totalMinutes) * 100);

    return { leftPercent, widthPercent };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden select-none">
      {/* Top Planner Controls */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-700">Filtrar por recurso:</span>
            <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-2xs gap-1">
              {(
                [
                  { id: 'all', label: 'Todos' },
                  { id: 'vehicle', label: 'Vehículos & Flota' },
                  { id: 'equipment', label: 'Audio, Video & Luz' },
                  { id: 'technician', label: 'Técnicos & Crew' },
                  { id: 'room', label: 'Salas & Estudios' },
                ] as { id: ResourceType | 'all'; label: string }[]
              ).map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedResourceType(type.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    selectedResourceType === type.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conflict summary banner */}
        <div className="flex items-center gap-3">
          {conflicts.length > 0 ? (
            <button
              onClick={onOpenConflictsModal}
              className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-bold hover:bg-rose-100 transition-colors shadow-2xs"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>{conflicts.length} conflicto(s) de horario detectado(s)</span>
              <span className="underline ml-1">Resolver</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Shield className="w-3.5 h-3.5" />
              <span>Recursos disponibles sin conflictos</span>
            </div>
          )}
        </div>
      </div>

      {/* Resource Matrix Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="min-w-[900px] border-b border-slate-200">
          {/* Header Row: Resources column on left + Hour Slots on right */}
          <div className="flex sticky top-0 bg-slate-100/95 backdrop-blur-xs border-b border-slate-200 z-20">
            <div className="w-64 p-3 border-r border-slate-200 text-xs font-bold text-slate-600 shrink-0 uppercase tracking-wider">
              Recurso Asignable
            </div>

            <div className="flex-1 grid grid-cols-18 divide-x divide-slate-200 text-center">
              {hours.map((h) => (
                <div key={h} className="py-2 text-[11px] font-bold text-slate-500">
                  {String(h).padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>

          {/* Resource Rows */}
          <div className="divide-y divide-slate-200">
            {filteredResources.map((res) => {
              const resConflict = conflicts.find((c) => c.resourceId === res.id);
              const isConflicted = !!resConflict;

              // Find events using this resource today
              const resEvents = events.filter((e) =>
                e.assignedResources.some((r) => r.resourceId === res.id) &&
                isSameDay(parseISO(e.startDate), currentDate)
              );

              // Find activities using this resource today
              const resActivities = activities.filter((a) =>
                a.assignedResources.some((r) => r.resourceId === res.id) &&
                isSameDay(parseISO(a.startDate), currentDate)
              );

              return (
                <div
                  key={res.id}
                  className={`flex items-stretch min-h-[64px] transition-colors ${
                    isConflicted ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Resource Info Card on Left */}
                  <div className="w-64 p-3 border-r border-slate-200 shrink-0 flex items-center justify-between gap-2 bg-white">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                        {getResourceIcon(res.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">
                          {res.name}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <span className="font-mono">{res.code}</span>
                          <span>•</span>
                          <span>{res.category}</span>
                        </div>
                      </div>
                    </div>

                    {isConflicted && (
                      <span title="Conflicto de horario asignado">
                        <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse shrink-0" />
                      </span>
                    )}
                  </div>

                  {/* Resource Timeline Bar on Right */}
                  <div className="flex-1 relative bg-slate-50/30">
                    {/* Hour grid lines */}
                    <div className="absolute inset-0 grid grid-cols-18 divide-x divide-slate-100 pointer-events-none">
                      {hours.map((h) => (
                        <div key={h} className="h-full" />
                      ))}
                    </div>

                    {/* Render Event bookings on this resource */}
                    {resEvents.map((evt) => {
                      const { leftPercent, widthPercent } = calculateTimelinePosition(
                        evt.startDate,
                        evt.endDate
                      );

                      return (
                        <div
                          key={evt.id}
                          onClick={() => onEventClick(evt)}
                          className={`absolute top-2 bottom-2 rounded-lg px-2.5 py-1 text-white shadow-xs cursor-pointer hover:shadow-md hover:brightness-105 transition-all flex flex-col justify-center truncate z-10 ${
                            isConflicted
                              ? 'ring-2 ring-rose-500 ring-offset-1 border border-rose-300'
                              : ''
                          }`}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            backgroundColor: evt.color || '#2563eb',
                          }}
                          title={`Evento: ${evt.title} (${evt.startDate} - ${evt.endDate})`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 truncate">
                            {EVENT_TYPE_LABELS[evt.eventType]?.label}
                          </span>
                          <span className="text-xs font-bold truncate">{evt.title}</span>
                        </div>
                      );
                    })}

                    {/* Render Activity bookings on this resource */}
                    {resActivities.map((act) => {
                      const { leftPercent, widthPercent } = calculateTimelinePosition(
                        act.startDate,
                        act.endDate
                      );

                      return (
                        <div
                          key={act.id}
                          onClick={() => onActivityClick(act)}
                          className={`absolute top-2 bottom-2 rounded-lg px-2.5 py-1 bg-white border-l-4 shadow-xs border border-slate-200 cursor-pointer hover:shadow-md hover:bg-slate-50 transition-all flex flex-col justify-center truncate z-10 ${
                            isConflicted
                              ? 'ring-2 ring-rose-500 ring-offset-1'
                              : ''
                          }`}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            borderLeftColor: act.color || '#0ea5e9',
                          }}
                          title={`Actividad: ${act.title} (${act.startDate} - ${act.endDate})`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 truncate">
                            {ACTIVITY_TYPE_LABELS[act.activityType]?.label}
                          </span>
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {act.title}
                          </span>
                        </div>
                      );
                    })}
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
