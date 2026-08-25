import React, { useState, useEffect } from 'react';
import {
  CalendarEvent,
  EventType,
  EventStatus,
  Priority,
  RelatedDocType,
  ResourceAssignment,
  Participant,
  Attachment,
} from '../../types';
import {
  EVENT_TYPE_LABELS,
  EVENT_STATUS_LABELS,
  PRIORITY_LABELS,
  GOOGLE_CALENDAR_COLORS,
  CLIENTS,
  USERS,
  BRANCHES,
  RESOURCES,
} from '../../data/mockData';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Building,
  FileText,
  Paperclip,
  Check,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Lock,
  Tag,
} from 'lucide-react';
import { extractDateAndTimeString, createISOFromDateAndTimeString } from '../../utils/dateUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Partial<CalendarEvent>) => void;
  initialEvent?: CalendarEvent | null;
  defaultDate?: Date;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEvent,
  defaultDate,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'client' | 'schedule' | 'resources' | 'notes'>('general');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('boda');
  const [status, setStatus] = useState<EventStatus>('pending');
  const [priority, setPriority] = useState<Priority>('medium');
  const [color, setColor] = useState('#db2777');

  // Client & Document
  const [clientId, setClientId] = useState(CLIENTS[0].id);
  const [clientContactName, setClientContactName] = useState('');
  const [clientContactPhone, setClientContactPhone] = useState('');
  const [clientContactEmail, setClientContactEmail] = useState('');
  const [relatedDocType, setRelatedDocType] = useState<RelatedDocType>('contrato');
  const [relatedDocCode, setRelatedDocCode] = useState('');

  // Date & Time
  const [startDateStr, setStartDateStr] = useState('2026-08-25');
  const [startTimeStr, setStartTimeStr] = useState('16:00');
  const [endDateStr, setEndDateStr] = useState('2026-08-26');
  const [endTimeStr, setEndTimeStr] = useState('02:00');
  const [allDay, setAllDay] = useState(false);

  // Location & Branch
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [branchId, setBranchId] = useState('b_cdmx');

  // Lead & Resources
  const [leadResponsibleId, setLeadResponsibleId] = useState(USERS[0].id);
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [syncWithGoogle, setSyncWithGoogle] = useState(true);

  // Load initial event or defaults
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDescription(initialEvent.description || '');
      setEventType(initialEvent.eventType);
      setStatus(initialEvent.status);
      setPriority(initialEvent.priority);
      setColor(initialEvent.color || '#db2777');
      setClientId(initialEvent.clientId);
      setClientContactName(initialEvent.clientContactName || '');
      setClientContactPhone(initialEvent.clientContactPhone || '');
      setClientContactEmail(initialEvent.clientContactEmail || '');
      setRelatedDocType(initialEvent.relatedDocType || 'contrato');
      setRelatedDocCode(initialEvent.relatedDocCode || '');

      const startParsed = extractDateAndTimeString(initialEvent.startDate);
      const endParsed = extractDateAndTimeString(initialEvent.endDate);
      setStartDateStr(startParsed.dateStr);
      setStartTimeStr(startParsed.timeStr);
      setEndDateStr(endParsed.dateStr);
      setEndTimeStr(endParsed.timeStr);
      setAllDay(initialEvent.allDay || false);

      setLocationName(initialEvent.locationName || '');
      setLocationAddress(initialEvent.locationAddress || '');
      setBranchId(initialEvent.branchId || 'b_cdmx');
      setLeadResponsibleId(initialEvent.leadResponsibleId || USERS[0].id);
      setSelectedResourceIds(initialEvent.assignedResources.map((r) => r.resourceId));
      setTags(initialEvent.tags || []);
      setInternalNotes(initialEvent.internalNotes || '');
      setSyncWithGoogle(initialEvent.googleCalendarSync?.isSynced ?? true);
    } else {
      // Default new event
      setTitle('');
      setDescription('');
      setEventType('boda');
      setStatus('pending');
      setPriority('medium');
      setColor('#db2777');

      const dateBase = defaultDate ? defaultDate.toISOString().split('T')[0] : '2026-08-25';
      setStartDateStr(dateBase);
      setStartTimeStr('15:00');
      setEndDateStr(dateBase);
      setEndTimeStr('23:00');
      setAllDay(false);

      setLocationName('Hacienda / Foro Principal');
      setLocationAddress('');
      setClientId(CLIENTS[0].id);
      setClientContactName(CLIENTS[0].contactName);
      setClientContactPhone(CLIENTS[0].contactPhone);
      setClientContactEmail(CLIENTS[0].contactEmail);
      setRelatedDocType('contrato');
      setRelatedDocCode('CTR-2026-' + Math.floor(1000 + Math.random() * 9000));
      setBranchId('b_cdmx');
      setLeadResponsibleId(USERS[0].id);
      setSelectedResourceIds(['r_veh_1', 'r_eq_1']);
      setTags(['Producción', 'Servicio']);
      setInternalNotes('');
      setSyncWithGoogle(true);
    }
  }, [initialEvent, defaultDate, isOpen]);

  // Update client contact when client changes
  const handleClientChange = (cId: string) => {
    setClientId(cId);
    const cl = CLIENTS.find((c) => c.id === cId);
    if (cl) {
      setClientContactName(cl.contactName);
      setClientContactPhone(cl.contactPhone);
      setClientContactEmail(cl.contactEmail);
    }
  };

  const handleToggleResource = (resId: string) => {
    setSelectedResourceIds((prev) =>
      prev.includes(resId) ? prev.filter((id) => id !== resId) : [...prev, resId]
    );
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const startIso = createISOFromDateAndTimeString(startDateStr, startTimeStr);
    const endIso = createISOFromDateAndTimeString(endDateStr, endTimeStr);

    const clientObj = CLIENTS.find((c) => c.id === clientId);
    const leadObj = USERS.find((u) => u.id === leadResponsibleId);
    const branchObj = BRANCHES.find((b) => b.id === branchId);

    const assignedResources: ResourceAssignment[] = selectedResourceIds.map((resId) => {
      const res = RESOURCES.find((r) => r.id === resId);
      return {
        resourceId: resId,
        resourceName: res ? res.name : 'Recurso',
        resourceType: res ? res.type : 'equipment',
      };
    });

    const eventPayload: Partial<CalendarEvent> = {
      title,
      description,
      eventType,
      status,
      priority,
      color,
      clientId,
      clientName: clientObj ? clientObj.name : 'Cliente General',
      clientContactName,
      clientContactPhone,
      clientContactEmail,
      relatedDocType,
      relatedDocCode,
      startDate: startIso,
      endDate: endIso,
      allDay,
      locationName,
      locationAddress,
      branchId,
      branchName: branchObj ? branchObj.name : 'Sucursal Matriz CDMX',
      leadResponsibleId,
      leadResponsibleName: leadObj ? leadObj.name : 'Responsable',
      leadResponsibleAvatar: leadObj?.avatar,
      assignedResources,
      tags,
      internalNotes,
      googleCalendarSync: {
        isSynced: syncWithGoogle,
        googleCalendarId: 'c_asuite_operaciones@group.calendar.google.com',
        lastSyncedAt: new Date().toISOString(),
      },
    };

    onSave(eventPayload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-2xs overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h2 className="text-base font-bold text-slate-900">
              {initialEvent ? 'Editar Evento Principal' : 'Nuevo Evento Principal'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-white gap-2 shrink-0 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'general', label: '1. General' },
            { id: 'client', label: '2. Cliente & Cotización' },
            { id: 'schedule', label: '3. Horario & Sede' },
            { id: 'resources', label: '4. Recursos & Equipo' },
            { id: 'notes', label: '5. Notas & Sync' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {/* TAB 1: General */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título del Evento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Boda Sofía & Mateo – Producción Integral y Audio"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipo de Evento
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => {
                      const val = e.target.value as EventType;
                      setEventType(val);
                      setColor(EVENT_TYPE_LABELS[val]?.color || '#db2777');
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none text-slate-800 font-semibold"
                  >
                    {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((type) => (
                      <option key={type} value={type}>
                        {EVENT_TYPE_LABELS[type].label}
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
                    onChange={(e) => setStatus(e.target.value as EventStatus)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none text-slate-800 font-semibold"
                  >
                    {(Object.keys(EVENT_STATUS_LABELS) as EventStatus[]).map((st) => (
                      <option key={st} value={st}>
                        {EVENT_STATUS_LABELS[st].label}
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none text-slate-800 font-semibold"
                  >
                    {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
                      <option key={p} value={p}>
                        {PRIORITY_LABELS[p].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Google Calendar Color Palette */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Color distintivo de calendario (Estilo Google Calendar)
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {GOOGLE_CALENDAR_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c.hex}
                      onClick={() => setColor(c.hex)}
                      className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ${
                        color === c.hex ? 'scale-125 ring-2 ring-blue-600 ring-offset-2' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {color === c.hex && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción y Alcance del Servicio
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles de los requerimientos técnicos, montaje, audio, iluminación..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none transition-all text-slate-800"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Etiquetas
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Agregar etiqueta (ej. VIP, Line Array)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg"
                  >
                    + Agregar
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200 flex items-center gap-1.5"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Client & Documents */}
          {activeTab === 'client' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cliente Relacionado *
                </label>
                <select
                  value={clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none text-slate-900 font-semibold"
                >
                  {CLIENTS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contacto Principal
                  </label>
                  <input
                    type="text"
                    value={clientContactName}
                    onChange={(e) => setClientContactName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    value={clientContactPhone}
                    onChange={(e) => setClientContactPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={clientContactEmail}
                    onChange={(e) => setClientContactEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Documento Comercial Relacionado</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tipo de Documento
                    </label>
                    <select
                      value={relatedDocType}
                      onChange={(e) => setRelatedDocType(e.target.value as RelatedDocType)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none font-medium"
                    >
                      <option value="contrato">Contrato Firmado</option>
                      <option value="cotizacion">Cotización / Propuesta</option>
                      <option value="pedido">Pedido de Venta / Renta</option>
                      <option value="servicio">Orden de Servicio Técnico</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Folio / Código de Documento
                    </label>
                    <input
                      type="text"
                      placeholder="ej. CTR-2026-0412"
                      value={relatedDocCode}
                      onChange={(e) => setRelatedDocCode(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none font-mono font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Schedule & Location */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Evento de día completo</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inicio del Evento</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
                    />
                    {!allDay && (
                      <input
                        type="time"
                        value={startTimeStr}
                        onChange={(e) => setStartTimeStr(e.target.value)}
                        className="w-24 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
                      />
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Finalización del Evento</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={endDateStr}
                      onChange={(e) => setEndDateStr(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
                    />
                    {!allDay && (
                      <input
                        type="time"
                        value={endTimeStr}
                        onChange={(e) => setEndTimeStr(e.target.value)}
                        className="w-24 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none font-semibold text-slate-800"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sucursal Responsable
                </label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800"
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre de la Sede / Salón / Ubicación
                </label>
                <input
                  type="text"
                  placeholder="ej. Hacienda de los Morales – Salón Jardín Principal"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dirección Completa
                </label>
                <input
                  type="text"
                  placeholder="Calle, número, colonia, código postal y referencias de acceso de carga"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none text-slate-800"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Resources & Personnel */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Responsable Principal del Evento
                </label>
                <select
                  value={leadResponsibleId}
                  onChange={(e) => setLeadResponsibleId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-bold text-slate-800"
                >
                  {USERS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Asignación de Recursos Operativos (Vehículos, Equipos y Técnicos)
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {RESOURCES.map((res) => {
                    const isSelected = selectedResourceIds.includes(res.id);

                    return (
                      <div
                        key={res.id}
                        onClick={() => handleToggleResource(res.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-blue-600"
                          />
                          <div>
                            <div className="text-xs font-bold">{res.name}</div>
                            <div className="text-[11px] text-slate-500">
                              {res.code} • {res.category} {res.capacity ? `• Capacidad: ${res.capacity}` : ''}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200">
                          {res.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Notes & Google Sync */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <RefreshCw className="w-4 h-4 text-emerald-600" />
                    <span>Sincronización con Google Calendar</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncWithGoogle}
                      onChange={(e) => setSyncWithGoogle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Crea y actualiza automáticamente este evento en Google Calendar de operaciones Asuite, enviando invitaciones a los participantes.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas Internas de Operación y Logística
                </label>
                <textarea
                  rows={4}
                  placeholder="Instrucciones para choferes, gafetes de seguridad, horarios de carga y advertencias..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-blue-600 outline-none text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              {initialEvent ? 'Guardar Cambios' : 'Crear Evento Principal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
