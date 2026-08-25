import React, { useState } from 'react';
import {
  CalendarEvent,
  CalendarActivity,
  EventStatus,
  ActivityStatus,
  ResourceConflict,
} from '../../types';
import {
  EVENT_TYPE_LABELS,
  EVENT_STATUS_LABELS,
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_STATUS_LABELS,
  PRIORITY_LABELS,
} from '../../data/mockData';
import { getActivityIcon } from '../IconHelper';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  FileText,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Phone,
  Mail,
  Building,
  Tag,
  Share2,
  Video,
  Truck,
  Volume2,
  Check,
} from 'lucide-react';
import { formatFullDateTime, formatTimeRange } from '../../utils/dateUtils';

interface EventDetailDrawerProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  activities: CalendarActivity[];
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onStatusChange: (eventId: string, newStatus: EventStatus) => void;
  onAddActivityToEvent: (eventId: string) => void;
  onActivityClick: (activity: CalendarActivity) => void;
  onToggleActivityStatus: (activityId: string, currentStatus: ActivityStatus) => void;
  conflicts: ResourceConflict[];
}

export const EventDetailDrawer: React.FC<EventDetailDrawerProps> = ({
  event,
  isOpen,
  onClose,
  activities,
  onEditEvent,
  onDeleteEvent,
  onStatusChange,
  onAddActivityToEvent,
  onActivityClick,
  onToggleActivityStatus,
  conflicts,
}) => {
  if (!isOpen || !event) return null;

  // Filter activities related to this event
  const relatedActivities = activities.filter((a) => a.eventId === event.id);

  // Calculate operational progress
  const completedActivitiesCount = relatedActivities.filter(
    (a) => a.status === 'completed'
  ).length;
  const progressPercent =
    relatedActivities.length > 0
      ? Math.round((completedActivitiesCount / relatedActivities.length) * 100)
      : 0;

  // Check if event has resource conflict
  const hasConflict = conflicts.some((c) =>
    c.conflictingItems.some((ci) => ci.id === event.id)
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end backdrop-blur-2xs">
      <div
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Colored Banner & Actions */}
        <div
          className="p-5 text-white flex items-start justify-between relative"
          style={{ backgroundColor: event.color || '#2563eb' }}
        >
          <div className="space-y-1 max-w-[80%]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                {EVENT_TYPE_LABELS[event.eventType]?.label}
              </span>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                Prioridad {PRIORITY_LABELS[event.priority]?.label}
              </span>
              {event.relatedDocCode && (
                <span className="text-xs font-mono font-bold bg-white/25 px-2 py-0.5 rounded-full">
                  {event.relatedDocCode}
                </span>
              )}
            </div>

            <h2 className="text-xl font-extrabold leading-snug">{event.title}</h2>
            <p className="text-xs opacity-90 font-medium">{event.clientName}</p>
          </div>

          <div className="flex items-center gap-1 bg-black/20 rounded-xl p-1 backdrop-blur-xs">
            <button
              onClick={() => onEditEvent(event)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Editar Evento"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteEvent(event.id)}
              className="p-2 text-white hover:bg-rose-500/80 rounded-lg transition-colors"
              title="Eliminar Evento"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Status Quick Switcher */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Estado del Evento
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {(
                [
                  { id: 'draft', label: 'Borrador' },
                  { id: 'pending', label: 'Pendiente' },
                  { id: 'confirmed', label: 'Confirmado' },
                  { id: 'in_progress', label: 'En Proceso' },
                  { id: 'completed', label: 'Completado' },
                  { id: 'cancelled', label: 'Cancelado' },
                ] as { id: EventStatus; label: string }[]
              ).map((st) => (
                <button
                  key={st.id}
                  onClick={() => onStatusChange(event.id, st.id)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                    event.status === st.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Operational Progress & Related Activities Checklist */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Flujo Operativo de Actividades</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                    {completedActivitiesCount} de {relatedActivities.length} listas
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Acciones previas, durante y posteriores al servicio
                </p>
              </div>

              <button
                onClick={() => onAddActivityToEvent(event.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Actividad</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Progreso de Montaje y Logística</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Related Activities Checklist List */}
            <div className="space-y-2">
              {relatedActivities.length === 0 ? (
                <div className="text-center py-6 bg-white rounded-xl border border-dashed border-slate-300 p-4 text-xs text-slate-500">
                  No hay actividades asignadas aún a este evento.{' '}
                  <button
                    onClick={() => onAddActivityToEvent(event.id)}
                    className="text-blue-600 font-bold underline ml-1"
                  >
                    Crear la primera actividad (Carga, Entrega, etc.)
                  </button>
                </div>
              ) : (
                relatedActivities.map((act) => {
                  const isCompleted = act.status === 'completed';

                  return (
                    <div
                      key={act.id}
                      onClick={() => onActivityClick(act)}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                          : 'bg-white border-slate-200 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleActivityStatus(act.id, act.status);
                          }}
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-slate-400 bg-white'
                          }`}
                        >
                          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${act.color}15`,
                            color: act.color || '#0ea5e9',
                          }}
                        >
                          {getActivityIcon(act.activityType, 'w-3.5 h-3.5')}
                        </div>

                        <div className="min-w-0">
                          <div
                            className={`text-xs font-bold truncate ${
                              isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {act.title}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>
                              {formatTimeRange(act.startDate, act.endDate, act.allDay)}
                            </span>
                            {act.responsibleName && (
                              <>
                                <span>•</span>
                                <span className="font-semibold text-slate-700">
                                  {act.responsibleName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                          ACTIVITY_STATUS_LABELS[act.status]?.badgeClass
                        }`}
                      >
                        {ACTIVITY_STATUS_LABELS[act.status]?.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Schedule & Location Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Horario y Fechas</span>
              </div>
              <div className="text-xs text-slate-900 font-bold">
                {formatFullDateTime(event.startDate)}
              </div>
              <div className="text-xs text-slate-600">
                Hasta: {formatFullDateTime(event.endDate)}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Sede y Ubicación</span>
              </div>
              <div className="text-xs text-slate-900 font-bold truncate">
                {event.locationName}
              </div>
              {event.locationAddress && (
                <div className="text-xs text-slate-600 line-clamp-2">
                  {event.locationAddress}
                </div>
              )}
              <div className="text-[11px] text-blue-700 font-semibold">
                {event.branchName}
              </div>
            </div>
          </div>

          {/* Client & Commercial Details */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span>Cliente y Contacto</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{event.clientName}</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
              {event.clientContactName && (
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{event.clientContactName}</span>
                </div>
              )}
              {event.clientContactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${event.clientContactPhone}`} className="text-blue-600 hover:underline">
                    {event.clientContactPhone}
                  </a>
                </div>
              )}
              {event.clientContactEmail && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${event.clientContactEmail}`} className="text-blue-600 hover:underline">
                    {event.clientContactEmail}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Resources & Crew */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Recursos y Equipo Asignados ({event.assignedResources.length})</span>
              </div>
              {hasConflict && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Conflicto detectado
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {event.assignedResources.map((res) => (
                <span
                  key={res.resourceId}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>{res.resourceName}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Google Calendar Sync Status */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-emerald-900">
                  Sincronizado con Google Calendar
                </div>
                <div className="text-[11px] text-emerald-700">
                  ID: {event.googleCalendarSync?.googleEventId || 'g_evt_auto_99182'}
                </div>
              </div>
            </div>
            <button
              onClick={() => window.open('https://calendar.google.com', '_blank')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Abrir en Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Internal Notes */}
          {event.internalNotes && (
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Notas Internas de Operación
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {event.internalNotes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
