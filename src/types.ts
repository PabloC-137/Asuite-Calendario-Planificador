export type EventType =
  | 'boda'
  | 'concierto'
  | 'conferencia'
  | 'instalacion'
  | 'produccion'
  | 'renta_equipo'
  | 'proyecto'
  | 'servicio_tecnico'
  | 'reunion_importante';

export type EventStatus =
  | 'draft'       // Borrador
  | 'pending'     // Pendiente
  | 'confirmed'   // Confirmado
  | 'in_progress' // En proceso
  | 'completed'   // Completado
  | 'cancelled';  // Cancelado

export type ActivityType =
  | 'llamada'
  | 'reunion'
  | 'videollamada'
  | 'visita'
  | 'entrega'
  | 'recoleccion'
  | 'instalacion'
  | 'desinstalacion'
  | 'carga'
  | 'descarga'
  | 'prueba_audio'
  | 'seguimiento'
  | 'tarea_admin'
  | 'recordatorio'
  | 'otro';

export type ActivityStatus =
  | 'pending'      // Pendiente
  | 'scheduled'    // Programada
  | 'in_progress'  // En proceso
  | 'completed'    // Completada
  | 'cancelled'    // Cancelada
  | 'rescheduled'; // Reprogramada

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type RelatedDocType = 'cotizacion' | 'pedido' | 'contrato' | 'servicio';

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  type: 'internal_user' | 'client_contact' | 'external_guest';
  status: 'accepted' | 'pending' | 'declined';
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export type ResourceType = 'vehicle' | 'equipment' | 'room' | 'technician' | 'personnel' | 'tool';

export interface Resource {
  id: string;
  name: string;
  code: string;
  type: ResourceType;
  category: string;
  branchId: string;
  capacity?: string;
  status: 'available' | 'maintenance' | 'busy';
}

export interface ResourceAssignment {
  resourceId: string;
  resourceName: string;
  resourceType: ResourceType;
  quantity?: number;
  notes?: string;
}

export interface ReminderConfig {
  id: string;
  timeOffsetMinutes: number; // e.g. 15, 30, 60, 120, 1440
  label: string;
  channels: ('asuite' | 'push' | 'email')[];
}

export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval?: number; // e.g. every 2 weeks
  daysOfWeek?: number[]; // 0=Sun, 1=Mon, etc.
  endDate?: string;
  occurrencesCount?: number;
  seriesId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
}

export interface VirtualMeetingInfo {
  hasMeeting: boolean;
  platform: 'google_meet' | 'teams' | 'zoom';
  meetUrl?: string;
  meetingId?: string;
  passcode?: string;
}

export interface GoogleSyncInfo {
  isSynced: boolean;
  googleCalendarId?: string;
  googleEventId?: string;
  lastSyncedAt?: string;
  htmlLink?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  status: EventStatus;
  priority: Priority;
  
  // Client relationship
  clientId: string;
  clientName: string;
  clientContactName?: string;
  clientContactPhone?: string;
  clientContactEmail?: string;
  
  // Document relationship
  relatedDocType?: RelatedDocType;
  relatedDocCode?: string; // e.g. "COT-2026-104", "CON-8832"
  
  // Date & Time
  startDate: string; // ISO string YYYY-MM-DDTHH:mm
  endDate: string;   // ISO string YYYY-MM-DDTHH:mm
  allDay: boolean;
  
  // Location
  locationName: string;
  locationAddress?: string;
  
  // Responsible & Participants
  leadResponsibleId: string;
  leadResponsibleName: string;
  leadResponsibleAvatar?: string;
  participants: Participant[];
  
  // Branch & Categorization
  branchId: string;
  branchName: string;
  tags: string[];
  color: string; // Hex or CSS color
  
  // Operational details
  attachments: Attachment[];
  internalNotes: string;
  recurrence?: RecurrenceRule;
  assignedResources: ResourceAssignment[];
  
  // Integration
  googleCalendarSync?: GoogleSyncInfo;
  virtualMeeting?: VirtualMeetingInfo;
  
  // Audit
  history?: AuditLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CalendarActivity {
  id: string;
  title: string;
  description: string;
  activityType: ActivityType;
  status: ActivityStatus;
  priority: Priority;
  
  // Parent Event relationship (Optional)
  eventId?: string;
  eventTitle?: string;
  eventType?: EventType;
  
  // Client relationship (Optional or inherited from Event)
  clientId?: string;
  clientName?: string;
  
  // Date & Time
  startDate: string; // ISO string
  endDate: string;   // ISO string
  allDay: boolean;
  
  // Responsible & Participants
  responsibleId: string;
  responsibleName: string;
  responsibleAvatar?: string;
  participants: Participant[];
  
  // Location
  location?: string;
  
  // Virtual meeting (Google Meet)
  virtualMeeting?: VirtualMeetingInfo;
  
  // Reminders & Attachments
  reminders: ReminderConfig[];
  attachments: Attachment[];
  assignedResources: ResourceAssignment[];
  color: string;
  
  // Recurrence
  recurrence?: RecurrenceRule;
  
  // Integration & Audit
  googleCalendarSync?: GoogleSyncInfo;
  history?: AuditLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'day' | 'week' | 'month' | 'agenda' | 'resources';

export interface ResourceConflict {
  resourceId: string;
  resourceName: string;
  resourceType: ResourceType;
  conflictingItems: {
    id: string;
    title: string;
    type: 'event' | 'activity';
    startDate: string;
    endDate: string;
  }[];
}

export interface FilterState {
  searchQuery: string;
  selectedUserIds: string[];
  selectedActivityTypes: ActivityType[];
  selectedEventTypes: EventType[];
  selectedStatuses: string[];
  selectedClientIds: string[];
  selectedBranches: string[];
  showEvents: boolean;
  showActivities: boolean;
  showGoogleCalendar: boolean;
  permissionScope: 'my_events' | 'my_team' | 'my_branch' | 'all';
  resourceTypeFilter?: ResourceType | 'all';
}
