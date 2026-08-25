import React, { useState, useEffect } from 'react';
import {
  CalendarActivity,
  CalendarEvent,
  ActivityType,
  ActivityStatus,
  Priority,
  ReminderConfig,
  ResourceAssignment,
} from '../../types';
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_STATUS_LABELS,
  PRIORITY_LABELS,
  GOOGLE_CALENDAR_COLORS,
  CLIENTS,
  USERS,
  RESOURCES,
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
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { extractDateAndTimeString, createISOFromDateAndTimeString } from '../../utils/dateUtils';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityData: Partial<CalendarActivity>) => void;
  initialActivity?: CalendarActivity | null;
  eventsList: CalendarEvent[];
  defaultDate?: Date;
  defaultEventId?: string;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialActivity,
  eventsList,
  defaultDate,
  defaultEventId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('videollamada');
  const [status, setStatus] = useState<ActivityStatus>('scheduled');
  const [priority, setPriority] = useState<Priority>('medium');
  const [color, setColor] = useState('#10b981');

  // Event relationship
  const [selectedEventId, setSelectedEventId] = useState<string>(defaultEventId || '');
  const [clientId, setClientId] = useState<string>(CLIENTS[0].id);

  // Date & Time
  const [startDateStr, setStartDateStr] = useState('2026-08-25');
  const [startTimeStr, setStartTimeStr] = useState('11:00');
  const [endDateStr, setEndDateStr] = useState('2026-08-25');
  const [endTimeStr, setEndTimeStr] = useState('12:00');
  const [allDay, setAllDay] = useState(false);

  // Location & Virtual Meeting (Google Meet)
  const [location, setLocation] = useState('');
  const [hasGoogleMeet, setHasGoogleMeet] = useState(true);
  const [meetUrl, setMeetUrl] = useState('https://meet.google.com/asu-' + Math.random().toString(36).substring(2, 6) + '-mtg');
  const [copiedMeet, setCopiedMeet] = useState(false);

  // Responsible & Resources
  const [responsibleId, setResponsibleId] = useState(USERS[0].id);
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);

  // Reminders
  const [reminders, setReminders] = useState<ReminderConfig[]>([
    { id: 'rem_1', timeOffsetMinutes: 15, label: '15 minutos antes', channels: ['asuite', 'push'] },
    { id: 'rem_2', timeOffsetMinutes: 60, label: '1 hora antes', channels: ['email'] },
  ]);

  // Load initial activity or defaults
  useEffect(() => {
    if (initialActivity) {
      setTitle(initialActivity.title);
      setDescription(initialActivity.description || '');
      setActivityType(initialActivity.activityType);
      setStatus(initialActivity.status);
      setPriority(initialActivity.priority);
      setColor(initialActivity.color || ACTIVITY_TYPE_LABELS[initialActivity.activityType]?.defaultColor || '#10b981');
      setSelectedEventId(initialActivity.eventId || '');
      setClientId(initialActivity.clientId || CLIENTS[0].id);

      const startParsed = extractDateAndTimeString(initialActivity.startDate);
      const endParsed = extractDateAndTimeString(initialActivity.endDate);
      setStartDateStr(startParsed.dateStr);
      setStartTimeStr(startParsed.timeStr);
      setEndDateStr(endParsed.dateStr);
      setEndTimeStr(endParsed.timeStr);
      setAllDay(initialActivity.allDay || false);

      setLocation(initialActivity.location || '');
      setHasGoogleMeet(initialActivity.virtualMeeting?.hasMeeting ?? false);
      setMeetUrl(initialActivity.virtualMeeting?.meetUrl || 'https://meet.google.com/asu-mtg-room');
      setResponsibleId(initialActivity.responsibleId || USERS[0].id);
      setSelectedResourceIds(initialActivity.assignedResources.map((r) => r.resourceId));
      setReminders(initialActivity.reminders || []);
    } else {
      // New activity defaults
      setTitle('');
      setDescription('');
      setActivityType('reunion');
      setStatus('scheduled');
      setPriority('medium');
      setColor('#3b82f6');
      setSelectedEventId(defaultEventId || '');
      setClientId(CLIENTS[0].id);

      const dateBase = defaultDate ? defaultDate.toISOString().split('T')[0] : '2026-08-25';
      setStartDateStr(dateBase);
      setStartTimeStr('11:00');
      setEndDateStr(dateBase);
      setEndTimeStr('12:00');
      setAllDay(false);

      setLocation('Oficinas Asuite / Sala de Juntas');
      setHasGoogleMeet(false);
      setMeetUrl('https://meet.google.com/asu-' + Math.random().toString(36).substring(2, 6) + '-mtg');
      setResponsibleId(USERS[0].id);
      setSelectedResourceIds([]);
      setReminders([
        { id: 'rem_1', timeOffsetMinutes: 15, label: '15 minutos antes', channels: ['asuite', 'push'] },
      ]);
    }
  }, [initialActivity, defaultDate, defaultEventId, isOpen]);

  // When activity type changes to video call or meeting, suggest Google Meet
  const handleTypeChange = (type: ActivityType) => {
    setActivityType(type);
    setColor(ACTIVITY_TYPE_LABELS[type]?.defaultColor || '#3b82f6');
    if (type === 'videollamada' || type === 'reunion') {
      setHasGoogleMeet(true);
      if (!location) setLocation('Google Meet Virtual Room');
    }
  };

  const handleCopyMeet = () => {
    navigator.clipboard.writeText(meetUrl);
    setCopiedMeet(true);
    setTimeout(() => setCopiedMeet(false), 2000);
  };

  const handleToggleResource = (resId: string) => {
    setSelectedResourceIds((prev) =>
      prev.includes(resId) ? prev.filter((id) => id !== resId) : [...prev, resId]
    );
  };

  const handleAddReminder = (offset: number, label: string) => {
    const newRem: ReminderConfig = {
      id: 'rem_' + Date.now(),
      timeOffsetMinutes: offset,
      label,
      channels: ['asuite', 'push'],
    };
    setReminders([...reminders, newRem]);
  };

  const handleRemoveReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const startIso = createISOFromDateAndTimeString(startDateStr, startTimeStr);
    const endIso = createISOFromDateAndTimeString(endDateStr, endTimeStr);

    const parentEvent = eventsList.find((ev) => ev.id === selectedEventId);
    const respUser = USERS.find((u) => u.id === responsibleId);
    const clientObj = CLIENTS.find((c) => c.id === clientId);

    const assignedResources: ResourceAssignment[] = selectedResourceIds.map((resId) => {
      const res = RESOURCES.find((r) => r.id === resId);
      return {
        resourceId: resId,
        resourceName: res ? res.name : 'Recurso',
        resourceType: res ? res.type : 'equipment',
      };
    });

    const activityPayload: Partial<CalendarActivity> = {
      title,
      description,
      activityType,
      status,
      priority,
      color,
      eventId: selectedEventId || undefined,
      eventTitle: parentEvent ? parentEvent.title : undefined,
      eventType: parentEvent ? parentEvent.eventType : undefined,
      clientId,
      clientName: clientObj ? clientObj.name : undefined,
      startDate: startIso,
      endDate: endIso,
      allDay,
      location,
      responsibleId,
      responsibleName: respUser ? respUser.name : 'Responsable',
      responsibleAvatar: respUser?.avatar,
      virtualMeeting: hasGoogleMeet
        ? {
            hasMeeting: true,
            platform: 'google_meet',
            meetUrl,
          }
        : { hasMeeting: false, platform: 'google_meet' },
      reminders,
      assignedResources,
      googleCalendarSync: {
        isSynced: true,
        lastSyncedAt: new Date().toISOString(),
      },
    };

    onSave(activityPayload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-2xs overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-8 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
              {getActivityIcon(activityType, 'w-4 h-4')}
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {initialActivity ? 'Editar Actividad Operativa' : 'Nueva Actividad Operativa'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Título de la Actividad *
            </label>
            <input
              type="text"
              required
              placeholder="ej. Soundcheck con grupo musical / Carga de equipo en bodega"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none font-medium text-slate-900"
            />
          </div>

          {/* Activity Type & Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tipo de Actividad
              </label>
              <select
                value={activityType}
                onChange={(e) => handleTypeChange(e.target.value as ActivityType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none font-semibold text-slate-800"
              >
                {(Object.keys(ACTIVITY_TYPE_LABELS) as ActivityType[]).map((type) => (
                  <option key={type} value={type}>
                    {ACTIVITY_TYPE_LABELS[type].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ActivityStatus)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none font-semibold text-slate-800"
              >
                {(Object.keys(ACTIVITY_STATUS_LABELS) as ActivityStatus[]).map((st) => (
                  <option key={st} value={st}>
                    {ACTIVITY_STATUS_LABELS[st].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none font-semibold text-slate-800"
              >
                {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Related Event Selector */}
          <div className="p-3 bg-blue-50/50 border border-blue-200/80 rounded-xl space-y-1">
            <label className="block text-xs font-bold text-blue-900">
              Evento Principal Relacionado (Opcional)
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-blue-200 rounded-lg outline-none font-semibold text-slate-800"
            >
              <option value="">-- Sin evento padre (Actividad Independiente) --</option>
              {eventsList.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.clientName})
                </option>
              ))}
            </select>
          </div>

          {/* Google Meet virtual meeting toggle & generator */}
          <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <Video className="w-4 h-4 text-emerald-600" />
                <span>Videollamada / Google Meet</span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasGoogleMeet}
                  onChange={(e) => setHasGoogleMeet(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {hasGoogleMeet && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={meetUrl}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg font-mono text-emerald-900 font-semibold"
                />
                <button
                  type="button"
                  onClick={handleCopyMeet}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                >
                  {copiedMeet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMeet ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Inicio</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
                />
                <input
                  type="time"
                  value={startTimeStr}
                  onChange={(e) => setStartTimeStr(e.target.value)}
                  className="w-24 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Finalización</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={endDateStr}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
                />
                <input
                  type="time"
                  value={endTimeStr}
                  onChange={(e) => setEndTimeStr(e.target.value)}
                  className="w-24 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Responsible */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Responsable de la Actividad
              </label>
              <select
                value={responsibleId}
                onChange={(e) => setResponsibleId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-bold text-slate-800"
              >
                {USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ubicación / Lugar
              </label>
              <input
                type="text"
                placeholder="ej. Almacén Central CDMX / Hacienda"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Resources assignment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Asignar Recursos (Vehículos, Consolas, Pantallas)
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {RESOURCES.map((res) => {
                const isSelected = selectedResourceIds.includes(res.id);

                return (
                  <div
                    key={res.id}
                    onClick={() => handleToggleResource(res.id)}
                    className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{res.name} ({res.code})</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 rounded text-blue-600"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reminders list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Recordatorios y Notificaciones</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAddReminder(15, '15 min antes')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded"
                >
                  + 15m
                </button>
                <button
                  type="button"
                  onClick={() => handleAddReminder(60, '1 hora antes')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded"
                >
                  + 1h
                </button>
                <button
                  type="button"
                  onClick={() => handleAddReminder(1440, '1 día antes')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 rounded"
                >
                  + 1d
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-700">{rem.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      Vía: {rem.channels.join(', ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveReminder(rem.id)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notas y Detalles Operativos
            </label>
            <textarea
              rows={2}
              placeholder="Instrucciones específicas, preparación de cables o acuerdos..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-800"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              {initialActivity ? 'Guardar Cambios' : 'Crear Actividad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
