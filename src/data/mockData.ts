import {
  CalendarEvent,
  CalendarActivity,
  Resource,
  EventType,
  ActivityType,
  EventStatus,
  ActivityStatus,
  Priority,
  Participant,
} from '../types';

export const EVENT_TYPE_LABELS: Record<EventType, { label: string; color: string; bg: string; border: string }> = {
  boda: { label: 'Boda', color: '#db2777', bg: '#fdf2f8', border: '#fbcfe8' },
  concierto: { label: 'Concierto / Festival', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  conferencia: { label: 'Conferencia / Expo', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  instalacion: { label: 'Instalación Fija', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  produccion: { label: 'Producción Audiovisual', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  renta_equipo: { label: 'Renta de Equipo', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  proyecto: { label: 'Proyecto Especial', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
  servicio_tecnico: { label: 'Servicio Técnico / Soporte', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  reunion_importante: { label: 'Reunión Ejecutiva', color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, { label: string; icon: string; defaultColor: string }> = {
  llamada: { label: 'Llamada telefónica', icon: 'Phone', defaultColor: '#0ea5e9' },
  reunion: { label: 'Reunión presencial', icon: 'Users', defaultColor: '#3b82f6' },
  videollamada: { label: 'Videollamada (Meet)', icon: 'Video', defaultColor: '#10b981' },
  visita: { label: 'Visita de inspección / Scout', icon: 'MapPin', defaultColor: '#f59e0b' },
  entrega: { label: 'Entrega de equipo', icon: 'Truck', defaultColor: '#6366f1' },
  recoleccion: { label: 'Recolección / Retiro', icon: 'PackageCheck', defaultColor: '#8b5cf6' },
  instalacion: { label: 'Montaje / Instalación', icon: 'Wrench', defaultColor: '#14b8a6' },
  desinstalacion: { label: 'Desmontaje / Desinstalación', icon: 'Hammer', defaultColor: '#f97316' },
  carga: { label: 'Carga de equipo en almacén', icon: 'Boxes', defaultColor: '#eab308' },
  descarga: { label: 'Descarga en sede', icon: 'ArrowDownToLine', defaultColor: '#eab308' },
  prueba_audio: { label: 'Soundcheck / Prueba de audio', icon: 'Volume2', defaultColor: '#ec4899' },
  seguimiento: { label: 'Seguimiento con cliente', icon: 'MessageSquare', defaultColor: '#64748b' },
  tarea_admin: { label: 'Tarea administrativa', icon: 'ClipboardList', defaultColor: '#6b7280' },
  recordatorio: { label: 'Recordatorio', icon: 'Bell', defaultColor: '#ef4444' },
  otro: { label: 'Otro', icon: 'MoreHorizontal', defaultColor: '#94a3b8' },
};

export const EVENT_STATUS_LABELS: Record<EventStatus, { label: string; badgeClass: string; color: string }> = {
  draft: { label: 'Borrador', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200', color: '#94a3b8' },
  pending: { label: 'Pendiente', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200', color: '#f59e0b' },
  confirmed: { label: 'Confirmado', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200', color: '#10b981' },
  in_progress: { label: 'En Proceso', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200', color: '#3b82f6' },
  completed: { label: 'Completado', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200', color: '#8b5cf6' },
  cancelled: { label: 'Cancelado', badgeClass: 'bg-rose-100 text-rose-800 border-rose-200', color: '#ef4444' },
};

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, { label: string; badgeClass: string; color: string }> = {
  pending: { label: 'Pendiente', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200', color: '#94a3b8' },
  scheduled: { label: 'Programada', badgeClass: 'bg-sky-100 text-sky-800 border-sky-200', color: '#0284c7' },
  in_progress: { label: 'En Proceso', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200', color: '#d97706' },
  completed: { label: 'Completada', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200', color: '#059669' },
  cancelled: { label: 'Cancelada', badgeClass: 'bg-rose-100 text-rose-800 border-rose-200', color: '#dc2626' },
  rescheduled: { label: 'Reprogramada', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200', color: '#4f46e5' },
};

export const PRIORITY_LABELS: Record<Priority, { label: string; color: string; iconClass: string }> = {
  low: { label: 'Baja', color: '#64748b', iconClass: 'text-slate-400' },
  medium: { label: 'Media', color: '#2563eb', iconClass: 'text-blue-500' },
  high: { label: 'Alta', color: '#f59e0b', iconClass: 'text-amber-500' },
  urgent: { label: 'Urgente', color: '#ef4444', iconClass: 'text-rose-600 font-bold' },
};

export const GOOGLE_CALENDAR_COLORS = [
  { name: 'Azul Pavo Real', hex: '#039be5', bg: '#e1f5fe' },
  { name: 'Flamenco Rosa', hex: '#e67c73', bg: '#fbe9e7' },
  { name: 'Mandarina', hex: '#f4511e', bg: '#fbe9e7' },
  { name: 'Plátano Amarillo', hex: '#f6bf26', bg: '#fffde7' },
  { name: 'Salvia Verde', hex: '#33b679', bg: '#e8f5e9' },
  { name: 'Albahaca Verde Oscuro', hex: '#0b8043', bg: '#e8f5e9' },
  { name: 'Arándano Azul', hex: '#3f51b5', bg: '#e8eaf6' },
  { name: 'Uva Morada', hex: '#8e24aa', bg: '#f3e5f5' },
  { name: 'Lavanda', hex: '#7986cb', bg: '#ede7f6' },
  { name: 'Grafito', hex: '#616161', bg: '#eeeeee' },
];

export const BRANCHES = [
  { id: 'b_cdmx', name: 'Sucursal Matriz CDMX', code: 'CDMX' },
  { id: 'b_mty', name: 'Sucursal Monterrey', code: 'MTY' },
  { id: 'b_gdl', name: 'Sucursal Guadalajara', code: 'GDL' },
  { id: 'b_qro', name: 'Sucursal Querétaro', code: 'QRO' },
];

export const USERS: Participant[] = [
  {
    id: 'u_1',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@asuite.io',
    phone: '+52 55 4192 8831',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Director de Producción',
    type: 'internal_user',
    status: 'accepted',
  },
  {
    id: 'u_2',
    name: 'Valeria Sotomayor',
    email: 'valeria.s@asuite.io',
    phone: '+52 55 8392 1102',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Coordinadora de Eventos',
    type: 'internal_user',
    status: 'accepted',
  },
  {
    id: 'u_3',
    name: 'Ing. Rodrigo Garza',
    email: 'rodrigo.garza@asuite.io',
    phone: '+52 81 2291 4455',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Ingeniero de Audio Principal',
    type: 'internal_user',
    status: 'accepted',
  },
  {
    id: 'u_4',
    name: 'Mariana López',
    email: 'mariana.lopez@asuite.io',
    phone: '+52 33 1184 7723',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Líder Técnico de Iluminación & Video',
    type: 'internal_user',
    status: 'accepted',
  },
  {
    id: 'u_5',
    name: 'Jorge Benítez',
    email: 'jorge.logistica@asuite.io',
    phone: '+52 55 9931 0021',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Jefe de Logística y Flota',
    type: 'internal_user',
    status: 'accepted',
  },
];

export const CLIENTS = [
  {
    id: 'c_1',
    name: 'Corporativo Banamex / Eventos Premium',
    contactName: 'Lic. Claudia Morales',
    contactEmail: 'claudia.morales@banamex-events.com',
    contactPhone: '+52 55 5283 9000',
  },
  {
    id: 'c_2',
    name: 'Festival Sonoro Ibero / OCESA',
    contactName: 'Mateo Cárdenas',
    contactEmail: 'mcardenas@sonorofest.mx',
    contactPhone: '+52 55 4482 1099',
  },
  {
    id: 'c_3',
    name: 'Bodas & Glamour Weddings',
    contactName: 'Ana Sofía Rangel',
    contactEmail: 'anasofia@glamourweddings.mx',
    contactPhone: '+52 81 8344 7712',
  },
  {
    id: 'c_4',
    name: 'TechSummit Latam 2026',
    contactName: 'Dr. Fernando Peñaloza',
    contactEmail: 'fernando@techsummit.org',
    contactPhone: '+52 33 3612 8840',
  },
  {
    id: 'c_5',
    name: 'Auditorio Metropolitano GDL',
    contactName: 'Ing. Javier Esquivel',
    contactEmail: 'jesquivel@auditoriogdl.com',
    contactPhone: '+52 33 3810 5500',
  },
];

export const RESOURCES: Resource[] = [
  // Vehicles
  {
    id: 'r_veh_1',
    name: 'Camión Freightliner 3.5T (Caja Seca)',
    code: 'CAM-01',
    type: 'vehicle',
    category: 'Transporte Pesado',
    branchId: 'b_cdmx',
    capacity: '3.5 Toneladas',
    status: 'available',
  },
  {
    id: 'r_veh_2',
    name: 'Camioneta Ford Transit Van de Carga',
    code: 'VAN-02',
    type: 'vehicle',
    category: 'Transporte Ligero',
    branchId: 'b_cdmx',
    capacity: '1.2 Toneladas',
    status: 'available',
  },
  {
    id: 'r_veh_3',
    name: 'Camión Isuzu 5T Monterrey',
    code: 'CAM-MTY-01',
    type: 'vehicle',
    category: 'Transporte Pesado',
    branchId: 'b_mty',
    capacity: '5.0 Toneladas',
    status: 'available',
  },
  // Equipment
  {
    id: 'r_eq_1',
    name: 'Consola Digital Yamaha CL5 (64 ch)',
    code: 'MIX-YAM-01',
    type: 'equipment',
    category: 'Audio Profesional',
    branchId: 'b_cdmx',
    status: 'available',
  },
  {
    id: 'r_eq_2',
    name: 'Pantalla LED P3.91 Modular (10x4m)',
    code: 'LED-P3-01',
    type: 'equipment',
    category: 'Video & Pantallas',
    branchId: 'b_cdmx',
    status: 'available',
  },
  {
    id: 'r_eq_3',
    name: 'Sistema Line Array d&b audiotechnik V-Series (8 Tops + 4 Subs)',
    code: 'AUD-DB-01',
    type: 'equipment',
    category: 'Audio Profesional',
    branchId: 'b_cdmx',
    status: 'available',
  },
  {
    id: 'r_eq_4',
    name: 'Kit 12 Robóticas Beam 280W + Consola GrandMA3',
    code: 'LGT-GMA-01',
    type: 'equipment',
    category: 'Iluminación Escénica',
    branchId: 'b_cdmx',
    status: 'available',
  },
  {
    id: 'r_eq_5',
    name: 'Generador Eléctrico 75 kVA Silencioso',
    code: 'GEN-75K-01',
    type: 'equipment',
    category: 'Energía',
    branchId: 'b_cdmx',
    status: 'available',
  },
  // Rooms & Tech
  {
    id: 'r_room_1',
    name: 'Estudio de Streaming & Ensayos CDMX',
    code: 'EST-01',
    type: 'room',
    category: 'Instalaciones',
    branchId: 'b_cdmx',
    capacity: '30 personas',
    status: 'available',
  },
  {
    id: 'r_tech_1',
    name: 'Técnico Especialista en Rigging y Estructura',
    code: 'TEC-RIG-01',
    type: 'technician',
    category: 'Personal Calificado',
    branchId: 'b_cdmx',
    status: 'available',
  },
];

// Helper to get formatted date string for today and offsets relative to 2026-08-25
const getISODateWithTime = (dayOffset: number, hours: number, minutes: number = 0): string => {
  const base = new Date('2026-08-25T00:00:00');
  base.setDate(base.getDate() + dayOffset);
  base.setHours(hours, minutes, 0, 0);
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  const hr = String(base.getHours()).padStart(2, '0');
  const min = String(base.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hr}:${min}`;
};

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt_1',
    title: 'Boda Sofía & Mateo – Producción Integral y Audio',
    description: 'Servicio completo de audio para ceremonia, iluminación arquitectónica en jardín, pista LED iluminada y DJ set con audio Line Array.',
    eventType: 'boda',
    status: 'confirmed',
    priority: 'high',
    clientId: 'c_3',
    clientName: 'Bodas & Glamour Weddings',
    clientContactName: 'Ana Sofía Rangel',
    clientContactPhone: '+52 81 8344 7712',
    clientContactEmail: 'anasofia@glamourweddings.mx',
    relatedDocType: 'contrato',
    relatedDocCode: 'CTR-2026-0412',
    startDate: getISODateWithTime(0, 16, 0), // Today at 16:00
    endDate: getISODateWithTime(1, 2, 0),    // Tomorrow at 02:00
    allDay: false,
    locationName: 'Hacienda de los Morales – Salón Jardín Principal',
    locationAddress: 'Vázquez de Mella 525, Polanco I Secc, CDMX',
    leadResponsibleId: 'u_2',
    leadResponsibleName: 'Valeria Sotomayor',
    leadResponsibleAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    participants: [
      USERS[1],
      USERS[2],
      USERS[3],
      USERS[4],
      {
        id: 'p_ext_1',
        name: 'Ana Sofía Rangel (Wedding Planner)',
        email: 'anasofia@glamourweddings.mx',
        type: 'client_contact',
        status: 'accepted',
      },
    ],
    branchId: 'b_cdmx',
    branchName: 'Sucursal Matriz CDMX',
    tags: ['Boda', 'Audio Line Array', 'Iluminación VIP', 'Hacienda'],
    color: '#db2777',
    attachments: [
      {
        id: 'att_1',
        name: 'Rider_Tecnico_Boda_Sofia.pdf',
        size: '2.4 MB',
        type: 'application/pdf',
        url: '#',
        uploadedAt: '2026-08-20',
      },
      {
        id: 'att_2',
        name: 'Plano_Distribucion_Salon_Jardin.png',
        size: '4.1 MB',
        type: 'image/png',
        url: '#',
        uploadedAt: '2026-08-22',
      },
    ],
    internalNotes: 'Acceso de carga por puerta norte antes de las 11:00 AM. El coordinador de la hacienda requiere chalecos y gafetes de seguridad.',
    assignedResources: [
      { resourceId: 'r_veh_1', resourceName: 'Camión Freightliner 3.5T (Caja Seca)', resourceType: 'vehicle' },
      { resourceId: 'r_eq_1', resourceName: 'Consola Digital Yamaha CL5 (64 ch)', resourceType: 'equipment' },
      { resourceId: 'r_eq_3', resourceName: 'Sistema Line Array d&b audiotechnik', resourceType: 'equipment' },
      { resourceId: 'r_eq_4', resourceName: 'Kit 12 Robóticas Beam 280W + Consola', resourceType: 'equipment' },
    ],
    googleCalendarSync: {
      isSynced: true,
      googleCalendarId: 'c_asuite_operaciones@group.calendar.google.com',
      googleEventId: 'g_evt_boda_sofia_77192',
      lastSyncedAt: '2026-08-25T08:00:00',
    },
    createdAt: '2026-08-10T11:00:00',
    updatedAt: '2026-08-24T14:30:00',
    history: [
      { id: 'h_1', timestamp: '2026-08-24T14:30:00', userId: 'u_1', userName: 'Carlos Mendoza', action: 'Actualizó estado', details: 'Cambió estado a Confirmado tras firma de contrato.' },
      { id: 'h_2', timestamp: '2026-08-22T10:15:00', userId: 'u_2', userName: 'Valeria Sotomayor', action: 'Asignó recursos', details: 'Asignó Camión 3.5T y Consola Yamaha CL5.' }
    ]
  },
  {
    id: 'evt_2',
    title: 'Conferencia Magistral TechSummit Latam 2026',
    description: 'Montaje de Pantalla LED P3 gigante de 10x4m, microfonía Shure Axient Digital, streaming multicámara a YouTube y traducción simultánea.',
    eventType: 'conferencia',
    status: 'in_progress',
    priority: 'urgent',
    clientId: 'c_4',
    clientName: 'TechSummit Latam 2026',
    clientContactName: 'Dr. Fernando Peñaloza',
    clientContactEmail: 'fernando@techsummit.org',
    relatedDocType: 'pedido',
    relatedDocCode: 'PED-2026-8819',
    startDate: getISODateWithTime(1, 8, 30),
    endDate: getISODateWithTime(2, 19, 0),
    allDay: false,
    locationName: 'Centro Citibanamex – Sala Mexica A & B',
    locationAddress: 'Av. del Conscripto 311, Lomas de Sotelo, CDMX',
    leadResponsibleId: 'u_1',
    leadResponsibleName: 'Carlos Mendoza',
    leadResponsibleAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    participants: [USERS[0], USERS[2], USERS[3]],
    branchId: 'b_cdmx',
    branchName: 'Sucursal Matriz CDMX',
    tags: ['Pantalla LED', 'Streaming', 'Traducción', 'Corporativo'],
    color: '#0284c7',
    attachments: [
      {
        id: 'att_3',
        name: 'Guion_Minuto_a_Minuto_TechSummit.xlsx',
        size: '1.2 MB',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        url: '#',
        uploadedAt: '2026-08-23',
      },
    ],
    internalNotes: 'Prueba de enlace satelital para streaming 4K requerida antes de las 7:00 AM del primer día.',
    assignedResources: [
      { resourceId: 'r_eq_2', resourceName: 'Pantalla LED P3.91 Modular (10x4m)', resourceType: 'equipment' },
      { resourceId: 'r_veh_2', resourceName: 'Camioneta Ford Transit Van de Carga', resourceType: 'vehicle' },
      { resourceId: 'r_eq_5', resourceName: 'Generador Eléctrico 75 kVA Silencioso', resourceType: 'equipment' },
    ],
    googleCalendarSync: {
      isSynced: true,
      googleCalendarId: 'c_asuite_operaciones@group.calendar.google.com',
      googleEventId: 'g_evt_techsummit_9931',
      lastSyncedAt: '2026-08-25T07:15:00',
    },
    createdAt: '2026-08-12T09:00:00',
    updatedAt: '2026-08-25T07:15:00',
  },
  {
    id: 'evt_3',
    title: 'Gira Sonora: Festival Acústico Parque Fundidora MTY',
    description: 'Renta de 3 consolas de monitores, microfonía de batería profesional y set de amplificadores vintage.',
    eventType: 'concierto',
    status: 'pending',
    priority: 'high',
    clientId: 'c_2',
    clientName: 'Festival Sonoro Ibero / OCESA',
    clientContactName: 'Mateo Cárdenas',
    relatedDocType: 'cotizacion',
    relatedDocCode: 'COT-2026-0922',
    startDate: getISODateWithTime(4, 12, 0),
    endDate: getISODateWithTime(5, 23, 30),
    allDay: false,
    locationName: 'Parque Fundidora – Nave Lewis',
    locationAddress: 'Avenida Fundidora y Adolfo Prieto s/n, Monterrey, N.L.',
    leadResponsibleId: 'u_3',
    leadResponsibleName: 'Ing. Rodrigo Garza',
    leadResponsibleAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    participants: [USERS[2]],
    branchId: 'b_mty',
    branchName: 'Sucursal Monterrey',
    tags: ['Concierto', 'Monterrey', 'Backline', 'Audio'],
    color: '#7c3aed',
    attachments: [],
    internalNotes: 'Pendiente depósito en garantía antes del despacho de bodega MTY.',
    assignedResources: [
      { resourceId: 'r_veh_3', resourceName: 'Camión Isuzu 5T Monterrey', resourceType: 'vehicle' },
    ],
    googleCalendarSync: {
      isSynced: false,
    },
    createdAt: '2026-08-21T16:20:00',
    updatedAt: '2026-08-21T16:20:00',
  },
  {
    id: 'evt_4',
    title: 'Instalación de Sistema de Audio Ambiental en Corporativo',
    description: 'Instalación fija de 24 bocinas colgantes Bose FreeSpace y matriz de audio Dante en 3 pisos.',
    eventType: 'instalacion',
    status: 'confirmed',
    priority: 'medium',
    clientId: 'c_1',
    clientName: 'Corporativo Banamex / Eventos Premium',
    relatedDocType: 'contrato',
    relatedDocCode: 'CTR-2026-0399',
    startDate: getISODateWithTime(-2, 8, 0),
    endDate: getISODateWithTime(-1, 18, 0),
    allDay: false,
    locationName: 'Torre Mayor Banamex Piso 14',
    locationAddress: 'Paseo de la Reforma 505, Cuauhtémoc, CDMX',
    leadResponsibleId: 'u_4',
    leadResponsibleName: 'Mariana López',
    participants: [USERS[3], USERS[4]],
    branchId: 'b_cdmx',
    branchName: 'Sucursal Matriz CDMX',
    tags: ['Instalación Fija', 'Audio Bose', 'Dante'],
    color: '#059669',
    attachments: [],
    internalNotes: 'Trabajo nocturno y fin de semana con permisos de administración de la torre.',
    assignedResources: [],
    googleCalendarSync: {
      isSynced: true,
      lastSyncedAt: '2026-08-24T18:00:00',
    },
    createdAt: '2026-08-15T10:00:00',
    updatedAt: '2026-08-24T18:00:00',
  },
];

export const INITIAL_ACTIVITIES: CalendarActivity[] = [
  // Activities for Event 1: Boda Sofía & Mateo
  {
    id: 'act_101',
    eventId: 'evt_1',
    eventTitle: 'Boda Sofía & Mateo – Producción Integral y Audio',
    eventType: 'boda',
    title: 'Carga e inspección de equipo en Almacén CDMX',
    description: 'Revisión de cables, microfonía inalámbrica, consolas y lámparas robóticas en caja de transporte CAM-01.',
    activityType: 'carga',
    status: 'completed',
    priority: 'high',
    clientId: 'c_3',
    clientName: 'Bodas & Glamour Weddings',
    startDate: getISODateWithTime(0, 8, 0), // Today 08:00
    endDate: getISODateWithTime(0, 9, 30),   // Today 09:30
    allDay: false,
    responsibleId: 'u_5',
    responsibleName: 'Jorge Benítez',
    responsibleAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    participants: [USERS[4]],
    location: 'Almacén Central Asuite CDMX (Bahía 2)',
    reminders: [
      { id: 'rem_1', timeOffsetMinutes: 60, label: '1 hora antes', channels: ['asuite', 'push'] }
    ],
    attachments: [],
    assignedResources: [
      { resourceId: 'r_veh_1', resourceName: 'Camión Freightliner 3.5T', resourceType: 'vehicle' }
    ],
    color: '#eab308',
    createdAt: '2026-08-20T10:00:00',
    updatedAt: '2026-08-25T09:30:00',
  },
  {
    id: 'act_102',
    eventId: 'evt_1',
    eventTitle: 'Boda Sofía & Mateo – Producción Integral y Audio',
    eventType: 'boda',
    title: 'Traslado y Entrega de Equipo en Hacienda de los Morales',
    description: 'Llegada de camión a puerta de servicio norte. Descarga directa en área de jardín.',
    activityType: 'entrega',
    status: 'completed',
    priority: 'high',
    clientId: 'c_3',
    clientName: 'Bodas & Glamour Weddings',
    startDate: getISODateWithTime(0, 10, 0), // Today 10:00
    endDate: getISODateWithTime(0, 11, 15),
    allDay: false,
    responsibleId: 'u_5',
    responsibleName: 'Jorge Benítez',
    participants: [USERS[4]],
    location: 'Hacienda de los Morales – Acceso Norte',
    reminders: [
      { id: 'rem_2', timeOffsetMinutes: 30, label: '30 minutos antes', channels: ['asuite'] }
    ],
    attachments: [],
    assignedResources: [
      { resourceId: 'r_veh_1', resourceName: 'Camión Freightliner 3.5T', resourceType: 'vehicle' }
    ],
    color: '#6366f1',
    createdAt: '2026-08-20T10:00:00',
    updatedAt: '2026-08-25T11:15:00',
  },
  {
    id: 'act_103',
    eventId: 'evt_1',
    eventTitle: 'Boda Sofía & Mateo – Producción Integral y Audio',
    eventType: 'boda',
    title: 'Montaje de Estructura, Audio Line Array e Iluminación',
    description: 'Colocación de postes truss, tendido de cableado protegido y configuración de consola Yamaha CL5.',
    activityType: 'instalacion',
    status: 'in_progress',
    priority: 'urgent',
    clientId: 'c_3',
    clientName: 'Bodas & Glamour Weddings',
    startDate: getISODateWithTime(0, 11, 30), // Today 11:30
    endDate: getISODateWithTime(0, 14, 0),    // Today 14:00
    allDay: false,
    responsibleId: 'u_3',
    responsibleName: 'Ing. Rodrigo Garza',
    responsibleAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    participants: [USERS[2], USERS[3]],
    location: 'Hacienda de los Morales – Salón Jardín',
    reminders: [
      { id: 'rem_3', timeOffsetMinutes: 15, label: '15 minutos antes', channels: ['asuite', 'push'] }
    ],
    attachments: [],
    assignedResources: [
      { resourceId: 'r_eq_1', resourceName: 'Consola Digital Yamaha CL5', resourceType: 'equipment' },
      { resourceId: 'r_eq_3', resourceName: 'Line Array d&b audiotechnik', resourceType: 'equipment' },
      { resourceId: 'r_tech_1', resourceName: 'Técnico Especialista en Rigging', resourceType: 'technician' }
    ],
    color: '#14b8a6',
    createdAt: '2026-08-20T10:00:00',
    updatedAt: '2026-08-25T11:30:00',
  },
  {
    id: 'act_104',
    eventId: 'evt_1',
    eventTitle: 'Boda Sofía & Mateo – Producción Integral y Audio',
    eventType: 'boda',
    title: 'Soundcheck y Prueba de Audio con Grupo Musical',
    description: 'Ecualización de voces, monitoreo in-ear y balance general con la banda en vivo.',
    activityType: 'prueba_audio',
    status: 'scheduled',
    priority: 'high',
    clientId: 'c_3',
    clientName: 'Bodas & Glamour Weddings',
    startDate: getISODateWithTime(0, 14, 30), // Today 14:30
    endDate: getISODateWithTime(0, 15, 45),   // Today 15:45
    allDay: false,
    responsibleId: 'u_3',
    responsibleName: 'Ing. Rodrigo Garza',
    participants: [USERS[2], USERS[1]],
    location: 'Hacienda de los Morales – Escenario Jardín',
    reminders: [
      { id: 'rem_4', timeOffsetMinutes: 30, label: '30 minutos antes', channels: ['asuite', 'push', 'email'] }
    ],
    attachments: [],
    assignedResources: [
      { resourceId: 'r_eq_1', resourceName: 'Consola Digital Yamaha CL5', resourceType: 'equipment' }
    ],
    color: '#ec4899',
    createdAt: '2026-08-20T10:00:00',
    updatedAt: '2026-08-20T10:00:00',
  },
  {
    id: 'act_105',
    eventId: 'evt_1',
    eventTitle: 'Boda Sofía & Mateo – Producción Integral y Audio',
    eventType: 'boda',
    title: 'Desmontaje y Retiro de Equipo Post-Evento',
    description: 'Desconexión de microfonía, embalaje en flight cases y estiba en camión de retorno.',
    activityType: 'desinstalacion',
    status: 'scheduled',
    priority: 'medium',
    clientId: 'c_3',
    clientName: 'Bodas & Glamour Weddings',
    startDate: getISODateWithTime(1, 2, 0), // Tomorrow 02:00
    endDate: getISODateWithTime(1, 4, 30),  // Tomorrow 04:30
    allDay: false,
    responsibleId: 'u_5',
    responsibleName: 'Jorge Benítez',
    participants: [USERS[4], USERS[2]],
    location: 'Hacienda de los Morales – Salón Jardín',
    reminders: [
      { id: 'rem_5', timeOffsetMinutes: 60, label: '1 hora antes', channels: ['asuite'] }
    ],
    attachments: [],
    assignedResources: [
      { resourceId: 'r_veh_1', resourceName: 'Camión Freightliner 3.5T', resourceType: 'vehicle' }
    ],
    color: '#f97316',
    createdAt: '2026-08-20T10:00:00',
    updatedAt: '2026-08-20T10:00:00',
  },

  // Independent Activities & TechSummit Activities
  {
    id: 'act_201',
    eventId: 'evt_2',
    eventTitle: 'Conferencia Magistral TechSummit Latam 2026',
    eventType: 'conferencia',
    title: 'Reunión de alineación técnica con speakers internacionales',
    description: 'Revisión de requerimientos HDMI, presentación en Keynote y micrófonos diadema inalámbricos.',
    activityType: 'videollamada',
    status: 'scheduled',
    priority: 'high',
    clientId: 'c_4',
    clientName: 'TechSummit Latam 2026',
    startDate: getISODateWithTime(0, 16, 30), // Today 16:30
    endDate: getISODateWithTime(0, 17, 30),   // Today 17:30
    allDay: false,
    responsibleId: 'u_1',
    responsibleName: 'Carlos Mendoza',
    responsibleAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    participants: [
      USERS[0],
      {
        id: 'p_tech_1',
        name: 'Dr. Fernando Peñaloza',
        email: 'fernando@techsummit.org',
        type: 'client_contact',
        status: 'accepted'
      },
      {
        id: 'p_tech_2',
        name: 'Sarah Connor (Keynote Speaker)',
        email: 'sarah.c@mit-ai.edu',
        type: 'external_guest',
        status: 'accepted'
      }
    ],
    location: 'Google Meet Virtual Room',
    virtualMeeting: {
      hasMeeting: true,
      platform: 'google_meet',
      meetUrl: 'https://meet.google.com/asu-tech-2026',
      meetingId: 'asu-tech-2026'
    },
    reminders: [
      { id: 'rem_6', timeOffsetMinutes: 15, label: '15 minutos antes', channels: ['asuite', 'push', 'email'] }
    ],
    attachments: [],
    assignedResources: [],
    color: '#10b981',
    googleCalendarSync: {
      isSynced: true,
      googleCalendarId: 'c_asuite_operaciones@group.calendar.google.com',
      googleEventId: 'g_act_meet_99411',
      lastSyncedAt: '2026-08-25T08:00:00',
    },
    createdAt: '2026-08-23T11:00:00',
    updatedAt: '2026-08-25T08:00:00',
  },
  {
    id: 'act_301',
    title: 'Visita técnica de inspección en Foro Corona CDMX',
    description: 'Medición de tiro de proyectores y cálculo de carga eléctrica trifásica para evento corporativo de noviembre.',
    activityType: 'visita',
    status: 'scheduled',
    priority: 'medium',
    clientId: 'c_1',
    clientName: 'Corporativo Banamex / Eventos Premium',
    startDate: getISODateWithTime(1, 10, 0), // Tomorrow 10:00
    endDate: getISODateWithTime(1, 12, 0),   // Tomorrow 12:00
    allDay: false,
    responsibleId: 'u_4',
    responsibleName: 'Mariana López',
    participants: [USERS[3]],
    location: 'Foro Corona – Hipódromo de las Américas, CDMX',
    reminders: [
      { id: 'rem_7', timeOffsetMinutes: 60, label: '1 hora antes', channels: ['asuite'] }
    ],
    attachments: [],
    assignedResources: [
      { resourceId: 'r_veh_2', resourceName: 'Camioneta Ford Transit', resourceType: 'vehicle' }
    ],
    color: '#f59e0b',
    createdAt: '2026-08-24T09:00:00',
    updatedAt: '2026-08-24T09:00:00',
  },
  {
    id: 'act_302',
    title: 'Llamada de seguimiento: Cotización Gira Festival Sonoro MTY',
    description: 'Confirmar recepción de anexo técnico y resolver dudas sobre la cláusula de seguro de equipo.',
    activityType: 'llamada',
    status: 'scheduled',
    priority: 'high',
    clientId: 'c_2',
    clientName: 'Festival Sonoro Ibero / OCESA',
    startDate: getISODateWithTime(0, 12, 0), // Today 12:00
    endDate: getISODateWithTime(0, 12, 30),  // Today 12:30
    allDay: false,
    responsibleId: 'u_1',
    responsibleName: 'Carlos Mendoza',
    participants: [USERS[0]],
    location: 'Teléfono directo: +52 55 4482 1099',
    reminders: [
      { id: 'rem_8', timeOffsetMinutes: 15, label: '15 minutos antes', channels: ['asuite', 'push'] }
    ],
    attachments: [],
    assignedResources: [],
    color: '#0ea5e9',
    createdAt: '2026-08-24T17:00:00',
    updatedAt: '2026-08-24T17:00:00',
  },
  {
    id: 'act_303',
    title: 'Mantenimiento preventivo semestral de consolas digitales',
    description: 'Limpieza con aire comprimido, actualización de firmware v5.1 y calibración de faders motorizados.',
    activityType: 'tarea_admin',
    status: 'scheduled',
    priority: 'low',
    startDate: getISODateWithTime(2, 15, 0),
    endDate: getISODateWithTime(2, 18, 0),
    allDay: false,
    responsibleId: 'u_3',
    responsibleName: 'Ing. Rodrigo Garza',
    participants: [USERS[2]],
    location: 'Taller de Servicio Técnico Asuite CDMX',
    reminders: [
      { id: 'rem_9', timeOffsetMinutes: 1440, label: '1 día antes', channels: ['asuite'] }
    ],
    attachments: [],
    assignedResources: [
      { resourceId: 'r_eq_1', resourceName: 'Consola Digital Yamaha CL5', resourceType: 'equipment' }
    ],
    color: '#6b7280',
    createdAt: '2026-08-22T14:00:00',
    updatedAt: '2026-08-22T14:00:00',
  }
];
