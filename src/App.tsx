/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  CalendarEvent,
  CalendarActivity,
  ViewMode,
  FilterState,
  EventStatus,
  ActivityStatus,
} from './types';
import {
  INITIAL_EVENTS,
  INITIAL_ACTIVITIES,
  RESOURCES,
  BRANCHES,
  USERS,
} from './data/mockData';
import { findResourceConflicts } from './utils/conflictDetector';
import {
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  format,
  parseISO,
} from './utils/dateUtils';
import { formatHeaderDate } from './utils/dateUtils';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MonthView } from './components/views/MonthView';
import { WeekView } from './components/views/WeekView';
import { DayView } from './components/views/DayView';
import { AgendaView } from './components/views/AgendaView';
import { ResourcePlannerView } from './components/views/ResourcePlannerView';
import { EventModal } from './components/modals/EventModal';
import { ActivityModal } from './components/modals/ActivityModal';
import { EventDetailDrawer } from './components/modals/EventDetailDrawer';
import { ActivityDetailDrawer } from './components/modals/ActivityDetailDrawer';
import { GoogleCalendarSettingsModal } from './components/modals/GoogleCalendarSettingsModal';
import { ResourceConflictsModal } from './components/modals/ResourceConflictsModal';
import { CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  // Base date anchor: 2026-08-25
  const [currentDate, setCurrentDate] = useState<Date>(new Date('2026-08-25T08:00:00'));
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Core data states
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [activities, setActivities] = useState<CalendarActivity[]>(INITIAL_ACTIVITIES);

  // Toast notification banner state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedUserIds: [],
    selectedActivityTypes: [],
    selectedEventTypes: [],
    selectedStatuses: [],
    selectedClientIds: [],
    selectedBranches: [],
    showEvents: true,
    showActivities: true,
    showGoogleCalendar: true,
    permissionScope: 'all',
  });

  // Modals state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<CalendarActivity | null>(null);
  const [defaultEventIdForActivity, setDefaultEventIdForActivity] = useState<string | undefined>();

  const [selectedEventDrawer, setSelectedEventDrawer] = useState<CalendarEvent | null>(null);
  const [selectedActivityDrawer, setSelectedActivityDrawer] = useState<CalendarActivity | null>(null);

  const [isGoogleSyncModalOpen, setIsGoogleSyncModalOpen] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);

  const [isConflictsModalOpen, setIsConflictsModalOpen] = useState(false);
  const [defaultSlotDate, setDefaultSlotDate] = useState<Date | undefined>();

  // Dynamic Resource Conflicts Detection
  const conflicts = useMemo(() => {
    return findResourceConflicts(events, activities, RESOURCES);
  }, [events, activities]);

  // Navigation handlers
  const handleNavigatePrev = () => {
    if (viewMode === 'day') setCurrentDate(subDays(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNavigateNext = () => {
    if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const handleNavigateToday = () => {
    setCurrentDate(new Date('2026-08-25T08:00:00'));
  };

  // Event handlers
  const handleOpenCreateEvent = (presetDate?: Date) => {
    setEditingEvent(null);
    setDefaultSlotDate(presetDate || currentDate);
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: CalendarEvent) => {
    setEditingEvent(evt);
    setSelectedEventDrawer(null);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (data: Partial<CalendarEvent>) => {
    if (editingEvent) {
      // Update existing
      setEvents((prev) =>
        prev.map((e) => (e.id === editingEvent.id ? ({ ...e, ...data, updatedAt: new Date().toISOString() } as CalendarEvent) : e))
      );
      showToast(`Evento "${data.title}" actualizado con éxito en Asuite y Google Calendar.`);
    } else {
      // Create new
      const newEvt: CalendarEvent = {
        id: 'evt_' + Date.now(),
        title: data.title || 'Nuevo Evento',
        description: data.description || '',
        eventType: data.eventType || 'boda',
        status: data.status || 'pending',
        priority: data.priority || 'medium',
        clientId: data.clientId || 'c_1',
        clientName: data.clientName || 'Cliente Asuite',
        clientContactName: data.clientContactName,
        clientContactPhone: data.clientContactPhone,
        clientContactEmail: data.clientContactEmail,
        relatedDocType: data.relatedDocType,
        relatedDocCode: data.relatedDocCode,
        startDate: data.startDate || '2026-08-25T16:00',
        endDate: data.endDate || '2026-08-25T23:00',
        allDay: data.allDay || false,
        locationName: data.locationName || 'Sede Principal',
        locationAddress: data.locationAddress,
        leadResponsibleId: data.leadResponsibleId || USERS[0].id,
        leadResponsibleName: data.leadResponsibleName || USERS[0].name,
        leadResponsibleAvatar: data.leadResponsibleAvatar || USERS[0].avatar,
        participants: data.participants || [USERS[0]],
        branchId: data.branchId || 'b_cdmx',
        branchName: data.branchName || 'Sucursal Matriz CDMX',
        tags: data.tags || ['Producción'],
        color: data.color || '#db2777',
        attachments: data.attachments || [],
        internalNotes: data.internalNotes || '',
        assignedResources: data.assignedResources || [],
        googleCalendarSync: data.googleCalendarSync,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setEvents((prev) => [newEvt, ...prev]);
      showToast(`Nuevo evento "${newEvt.title}" registrado correctamente.`);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    setSelectedEventDrawer(null);
    showToast('Evento eliminado del calendario.', 'info');
  };

  const handleEventStatusChange = (eventId: string, newStatus: EventStatus) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e))
    );
    if (selectedEventDrawer && selectedEventDrawer.id === eventId) {
      setSelectedEventDrawer((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Estado del evento actualizado a "${newStatus}".`);
  };

  // Activity handlers
  const handleOpenCreateActivity = (presetDate?: Date, presetEventId?: string) => {
    setEditingActivity(null);
    setDefaultSlotDate(presetDate || currentDate);
    setDefaultEventIdForActivity(presetEventId);
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (act: CalendarActivity) => {
    setEditingActivity(act);
    setSelectedActivityDrawer(null);
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = (data: Partial<CalendarActivity>) => {
    if (editingActivity) {
      setActivities((prev) =>
        prev.map((a) => (a.id === editingActivity.id ? ({ ...a, ...data, updatedAt: new Date().toISOString() } as CalendarActivity) : a))
      );
      showToast(`Actividad "${data.title}" actualizada.`);
    } else {
      const newAct: CalendarActivity = {
        id: 'act_' + Date.now(),
        title: data.title || 'Nueva Actividad',
        description: data.description || '',
        activityType: data.activityType || 'reunion',
        status: data.status || 'scheduled',
        priority: data.priority || 'medium',
        eventId: data.eventId,
        eventTitle: data.eventTitle,
        eventType: data.eventType,
        clientId: data.clientId,
        clientName: data.clientName,
        startDate: data.startDate || '2026-08-25T11:00',
        endDate: data.endDate || '2026-08-25T12:00',
        allDay: data.allDay || false,
        responsibleId: data.responsibleId || USERS[0].id,
        responsibleName: data.responsibleName || USERS[0].name,
        responsibleAvatar: data.responsibleAvatar || USERS[0].avatar,
        participants: data.participants || [USERS[0]],
        location: data.location,
        virtualMeeting: data.virtualMeeting,
        reminders: data.reminders || [],
        attachments: [],
        assignedResources: data.assignedResources || [],
        color: data.color || '#10b981',
        googleCalendarSync: data.googleCalendarSync,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setActivities((prev) => [newAct, ...prev]);
      showToast(`Actividad "${newAct.title}" programada con éxito.`);
    }
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== activityId));
    setSelectedActivityDrawer(null);
    showToast('Actividad eliminada.', 'info');
  };

  const handleActivityStatusChange = (activityId: string, newStatus: ActivityStatus) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === activityId ? { ...a, status: newStatus } : a))
    );
    if (selectedActivityDrawer && selectedActivityDrawer.id === activityId) {
      setSelectedActivityDrawer((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Actividad marcada como "${newStatus}".`);
  };

  const handleToggleActivityStatus = (activityId: string, currentStatus: ActivityStatus) => {
    const nextStatus: ActivityStatus = currentStatus === 'completed' ? 'scheduled' : 'completed';
    handleActivityStatusChange(activityId, nextStatus);
  };

  // Drag & drop rescheduling
  const handleRescheduleDay = (id: string, type: 'event' | 'activity', newDateFormatted: string) => {
    if (type === 'event') {
      setEvents((prev) =>
        prev.map((evt) => {
          if (evt.id !== id) return evt;
          const oldStartTime = evt.startDate.split('T')[1] || '16:00';
          const oldEndTime = evt.endDate.split('T')[1] || '22:00';
          return {
            ...evt,
            startDate: `${newDateFormatted}T${oldStartTime}`,
            endDate: `${newDateFormatted}T${oldEndTime}`,
            updatedAt: new Date().toISOString(),
          };
        })
      );
      showToast('Evento reprogramado a la nueva fecha.', 'info');
    } else {
      setActivities((prev) =>
        prev.map((act) => {
          if (act.id !== id) return act;
          const oldStartTime = act.startDate.split('T')[1] || '10:00';
          const oldEndTime = act.endDate.split('T')[1] || '11:00';
          return {
            ...act,
            startDate: `${newDateFormatted}T${oldStartTime}`,
            endDate: `${newDateFormatted}T${oldEndTime}`,
            status: 'rescheduled',
            updatedAt: new Date().toISOString(),
          };
        })
      );
      showToast('Actividad reprogramada correctamente.', 'info');
    }
  };

  const handleRescheduleTimeSlot = (
    id: string,
    type: 'event' | 'activity',
    targetDateFormatted: string,
    targetHour: number
  ) => {
    const startHourStr = String(targetHour).padStart(2, '0') + ':00';
    const endHourStr = String(targetHour + 2).padStart(2, '0') + ':00';

    if (type === 'event') {
      setEvents((prev) =>
        prev.map((evt) => {
          if (evt.id !== id) return evt;
          return {
            ...evt,
            startDate: `${targetDateFormatted}T${startHourStr}`,
            endDate: `${targetDateFormatted}T${endHourStr}`,
            updatedAt: new Date().toISOString(),
          };
        })
      );
      showToast('Evento reprogramado al nuevo horario.');
    } else {
      setActivities((prev) =>
        prev.map((act) => {
          if (act.id !== id) return act;
          return {
            ...act,
            startDate: `${targetDateFormatted}T${startHourStr}`,
            endDate: `${targetDateFormatted}T${String(targetHour + 1).padStart(2, '0')}:00`,
            status: 'rescheduled',
            updatedAt: new Date().toISOString(),
          };
        })
      );
      showToast('Actividad reprogramada al nuevo horario.');
    }
  };

  const handleOpenItemFromConflict = (id: string, type: 'event' | 'activity') => {
    if (type === 'event') {
      const evt = events.find((e) => e.id === id);
      if (evt) setSelectedEventDrawer(evt);
    } else {
      const act = activities.find((a) => a.id === id);
      if (act) setSelectedActivityDrawer(act);
    }
  };

  const titleFormatted = formatHeaderDate(currentDate, viewMode);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold ${
              toastMessage.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : toastMessage.type === 'info'
                ? 'bg-blue-50 text-blue-900 border-blue-300'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
            }`}
          >
            {toastMessage.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Google Calendar Style Header */}
      <Header
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNavigatePrev={handleNavigatePrev}
        onNavigateNext={handleNavigateNext}
        onNavigateToday={handleNavigateToday}
        titleFormatted={titleFormatted}
        filters={filters}
        onUpdateFilters={setFilters}
        onCreateEventClick={() => handleOpenCreateEvent()}
        onCreateActivityClick={() => handleOpenCreateActivity()}
        onOpenGoogleSyncModal={() => setIsGoogleSyncModalOpen(true)}
        onOpenConflictsModal={() => setIsConflictsModalOpen(true)}
        conflicts={conflicts}
        isGoogleConnected={isGoogleConnected}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Body Area: Sidebar + Calendar View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        {isSidebarOpen && (
          <Sidebar
            currentDate={currentDate}
            onSelectDate={(d) => setCurrentDate(d)}
            filters={filters}
            onUpdateFilters={setFilters}
            onCreateEventClick={() => handleOpenCreateEvent()}
            onCreateActivityClick={() => handleOpenCreateActivity()}
            totalEventsCount={events.length}
            totalActivitiesCount={activities.length}
            conflictsCount={conflicts.length}
          />
        )}

        {/* Calendar Views Viewport */}
        <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden relative">
          {viewMode === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={events}
              activities={activities}
              filters={filters}
              onEventClick={(evt) => setSelectedEventDrawer(evt)}
              onActivityClick={(act) => setSelectedActivityDrawer(act)}
              onCellClick={(date) => handleOpenCreateEvent(date)}
              onRescheduleItem={handleRescheduleDay}
              conflicts={conflicts}
            />
          )}

          {viewMode === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={events}
              activities={activities}
              filters={filters}
              onEventClick={(evt) => setSelectedEventDrawer(evt)}
              onActivityClick={(act) => setSelectedActivityDrawer(act)}
              onSlotClick={(date, hour) => {
                const dateObj = new Date(date);
                dateObj.setHours(hour, 0, 0, 0);
                handleOpenCreateEvent(dateObj);
              }}
              onRescheduleItemTime={handleRescheduleTimeSlot}
              conflicts={conflicts}
            />
          )}

          {viewMode === 'day' && (
            <DayView
              currentDate={currentDate}
              events={events}
              activities={activities}
              filters={filters}
              onEventClick={(evt) => setSelectedEventDrawer(evt)}
              onActivityClick={(act) => setSelectedActivityDrawer(act)}
              onSlotClick={(date, hour) => {
                const dateObj = new Date(date);
                dateObj.setHours(hour, 0, 0, 0);
                handleOpenCreateEvent(dateObj);
              }}
              conflicts={conflicts}
            />
          )}

          {viewMode === 'agenda' && (
            <AgendaView
              events={events}
              activities={activities}
              filters={filters}
              onEventClick={(evt) => setSelectedEventDrawer(evt)}
              onActivityClick={(act) => setSelectedActivityDrawer(act)}
              conflicts={conflicts}
            />
          )}

          {viewMode === 'resources' && (
            <ResourcePlannerView
              currentDate={currentDate}
              events={events}
              activities={activities}
              onEventClick={(evt) => setSelectedEventDrawer(evt)}
              onActivityClick={(act) => setSelectedActivityDrawer(act)}
              conflicts={conflicts}
              onOpenConflictsModal={() => setIsConflictsModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* MODALS & DRAWERS */}
      {/* 1. Create/Edit Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        initialEvent={editingEvent}
        defaultDate={defaultSlotDate}
      />

      {/* 2. Create/Edit Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        initialActivity={editingActivity}
        eventsList={events}
        defaultDate={defaultSlotDate}
        defaultEventId={defaultEventIdForActivity}
      />

      {/* 3. Event Detail Drawer */}
      <EventDetailDrawer
        event={selectedEventDrawer}
        isOpen={!!selectedEventDrawer}
        onClose={() => setSelectedEventDrawer(null)}
        activities={activities}
        onEditEvent={(evt) => handleOpenEditEvent(evt)}
        onDeleteEvent={handleDeleteEvent}
        onStatusChange={handleEventStatusChange}
        onAddActivityToEvent={(evtId) => handleOpenCreateActivity(currentDate, evtId)}
        onActivityClick={(act) => {
          setSelectedEventDrawer(null);
          setSelectedActivityDrawer(act);
        }}
        onToggleActivityStatus={handleToggleActivityStatus}
        conflicts={conflicts}
      />

      {/* 4. Activity Detail Drawer */}
      <ActivityDetailDrawer
        activity={selectedActivityDrawer}
        isOpen={!!selectedActivityDrawer}
        onClose={() => setSelectedActivityDrawer(null)}
        onEditActivity={(act) => handleOpenEditActivity(act)}
        onDeleteActivity={handleDeleteActivity}
        onStatusChange={handleActivityStatusChange}
        onOpenParentEvent={(evtId) => {
          const parent = events.find((e) => e.id === evtId);
          if (parent) {
            setSelectedActivityDrawer(null);
            setSelectedEventDrawer(parent);
          }
        }}
      />

      {/* 5. Google Calendar & Meet Settings Modal */}
      <GoogleCalendarSettingsModal
        isOpen={isGoogleSyncModalOpen}
        onClose={() => setIsGoogleSyncModalOpen(false)}
        isConnected={isGoogleConnected}
        onToggleConnection={() => {
          setIsGoogleConnected(!isGoogleConnected);
          showToast(
            isGoogleConnected
              ? 'Cuenta de Google Calendar desconectada.'
              : 'Cuenta de Google Workspace sincronizada con éxito.'
          );
        }}
      />

      {/* 6. Resource Conflicts Resolution Modal */}
      <ResourceConflictsModal
        isOpen={isConflictsModalOpen}
        onClose={() => setIsConflictsModalOpen(false)}
        conflicts={conflicts}
        onOpenItem={handleOpenItemFromConflict}
      />
    </div>
  );
}
