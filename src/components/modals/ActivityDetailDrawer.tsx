import React, { useState } from 'react';
import {
  CalendarActivity,
  CalendarEvent,
  ActivityStatus,
} from '../../types';
import {
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
  Video,
  Bell,
  Check,
  Copy,
  ExternalLink,
  Edit3,
  Trash2,
  Share2,
  CalendarDays,
  FileText,
  Truck,
} from 'lucide-react';
import { formatFullDateTime, formatTimeRange } from '../../utils/dateUtils';

interface ActivityDetailDrawerProps {
  activity: CalendarActivity | null;
  isOpen: boolean;
  onClose: () => void;
  onEditActivity: (activity: CalendarActivity) => void;
  onDeleteActivity: (activityId: string) => void;
  onStatusChange: (activityId: string, newStatus: ActivityStatus) => void;
  onOpenParentEvent?: (eventId: string) => void;
}

export const ActivityDetailDrawer: React.FC<ActivityDetailDrawerProps> = ({
  activity,
  isOpen,
  onClose,
  onEditActivity,
  onDeleteActivity,
  onStatusChange,
  onOpenParentEvent,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !activity) return null;

  const hasMeet = activity.virtualMeeting?.hasMeeting;
  const meetUrl = activity.virtualMeeting?.meetUrl || 'https://meet.google.com/asu-mtg-sample';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end backdrop-blur-2xs">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div
          className="p-5 text-white flex items-start justify-between"
          style={{ backgroundColor: activity.color || '#0ea5e9' }}
        >
          <div className="space-y-1 max-w-[80%]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
                {getActivityIcon(activity.activityType, 'w-3.5 h-3.5')}
                <span>{ACTIVITY_TYPE_LABELS[activity.activityType]?.label}</span>
              </span>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                Prioridad {PRIORITY_LABELS[activity.priority]?.label}
              </span>
            </div>

            <h2 className="text-lg font-extrabold leading-snug">{activity.title}</h2>
          </div>

          <div className="flex items-center gap-1 bg-black/20 rounded-xl p-1 backdrop-blur-xs">
            <button
              onClick={() => onEditActivity(activity)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteActivity(activity.id)}
              className="p-2 text-white hover:bg-rose-500/80 rounded-lg transition-colors"
              title="Eliminar"
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Status Quick Switcher */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Estado de la Actividad
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'pending', label: 'Pendiente' },
                  { id: 'scheduled', label: 'Programada' },
                  { id: 'in_progress', label: 'En Proceso' },
                  { id: 'completed', label: 'Completada' },
                  { id: 'cancelled', label: 'Cancelada' },
                  { id: 'rescheduled', label: 'Reprogramada' },
                ] as { id: ActivityStatus; label: string }[]
              ).map((st) => (
                <button
                  key={st.id}
                  onClick={() => onStatusChange(activity.id, st.id)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all ${
                    activity.status === st.id
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Google Meet Virtual Room Card */}
          {hasMeet && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Video className="w-4 h-4 text-emerald-600" />
                  <span>Reunión de Google Meet</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Meet Integrado
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span>Unirse a Google Meet</span>
                </a>
                <button
                  onClick={handleCopyLink}
                  className="p-2.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1.5"
                  title="Copiar enlace de Google Meet"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-emerald-800 break-all">
                {meetUrl}
              </div>
            </div>
          )}

          {/* Parent Event Relationship Card */}
          {activity.eventId && (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
                  <span>Evento Principal Vinculado</span>
                </span>
                {onOpenParentEvent && (
                  <button
                    onClick={() => onOpenParentEvent(activity.eventId!)}
                    className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <span>Ver Evento</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="font-bold text-sm text-slate-900">{activity.eventTitle}</div>
              {activity.clientName && (
                <div className="text-xs text-slate-600">Cliente: {activity.clientName}</div>
              )}
            </div>
          )}

          {/* Schedule & Location */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {formatFullDateTime(activity.startDate)}
                </div>
                <div className="text-xs text-slate-500">
                  Hasta: {formatFullDateTime(activity.endDate)}
                </div>
              </div>
            </div>

            {activity.location && (
              <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div className="text-xs font-bold text-slate-900">{activity.location}</div>
              </div>
            )}
          </div>

          {/* Responsible & Participants */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Responsable & Participantes</span>
            </div>
            <div className="flex items-center gap-3">
              {activity.responsibleAvatar && (
                <img
                  src={activity.responsibleAvatar}
                  alt={activity.responsibleName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
              )}
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {activity.responsibleName}
                </div>
                <div className="text-xs text-slate-500">Responsable de Ejecución</div>
              </div>
            </div>
          </div>

          {/* Assigned Resources */}
          {activity.assignedResources.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Recursos Asignados</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {activity.assignedResources.map((r) => (
                  <span
                    key={r.resourceId}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    {r.resourceName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reminders list */}
          {activity.reminders.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Recordatorios Configurados</span>
              </div>
              <div className="space-y-1">
                {activity.reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="text-xs text-slate-700 flex items-center justify-between"
                  >
                    <span className="font-semibold">{rem.label}</span>
                    <span className="text-[11px] text-slate-500">
                      Vía: {rem.channels.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {activity.description && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Descripción & Instrucciones
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activity.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
