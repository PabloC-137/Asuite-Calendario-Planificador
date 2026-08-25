import React, { useState } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar as CalendarIcon,
  CheckSquare,
  Square,
  Users,
  Building,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Video,
  Sparkles,
  Layers,
  Wrench,
  Truck,
  Check,
} from 'lucide-react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { FilterState, ActivityType, EventType } from '../types';
import {
  ACTIVITY_TYPE_LABELS,
  EVENT_TYPE_LABELS,
  USERS,
  BRANCHES,
} from '../data/mockData';
import { getActivityIcon } from './IconHelper';

interface SidebarProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  filters: FilterState;
  onUpdateFilters: (updater: (prev: FilterState) => FilterState) => void;
  onCreateEventClick: () => void;
  onCreateActivityClick: () => void;
  totalEventsCount: number;
  totalActivitiesCount: number;
  conflictsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentDate,
  onSelectDate,
  filters,
  onUpdateFilters,
  onCreateEventClick,
  onCreateActivityClick,
  totalEventsCount,
  totalActivitiesCount,
  conflictsCount,
}) => {
  const [miniCalendarMonth, setMiniCalendarMonth] = useState<Date>(currentDate);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isActivityTypesCollapsed, setIsActivityTypesCollapsed] = useState(false);
  const [isUsersCollapsed, setIsUsersCollapsed] = useState(false);
  const [isBranchesCollapsed, setIsBranchesCollapsed] = useState(false);

  // Generate mini calendar days
  const miniMonthStart = startOfMonth(miniCalendarMonth);
  const miniMonthEnd = endOfMonth(miniMonthStart);
  const miniCalStart = startOfWeek(miniMonthStart, { weekStartsOn: 1 });
  const miniCalEnd = endOfWeek(miniMonthEnd, { weekStartsOn: 1 });
  const miniDays = eachDayOfInterval({ start: miniCalStart, end: miniCalEnd });

  const toggleActivityType = (type: ActivityType) => {
    onUpdateFilters((prev) => {
      const exists = prev.selectedActivityTypes.includes(type);
      return {
        ...prev,
        selectedActivityTypes: exists
          ? prev.selectedActivityTypes.filter((t) => t !== type)
          : [...prev.selectedActivityTypes, type],
      };
    });
  };

  const toggleUser = (userId: string) => {
    onUpdateFilters((prev) => {
      const exists = prev.selectedUserIds.includes(userId);
      return {
        ...prev,
        selectedUserIds: exists
          ? prev.selectedUserIds.filter((id) => id !== userId)
          : [...prev.selectedUserIds, userId],
      };
    });
  };

  const toggleBranch = (branchId: string) => {
    onUpdateFilters((prev) => {
      const exists = prev.selectedBranches.includes(branchId);
      return {
        ...prev,
        selectedBranches: exists
          ? prev.selectedBranches.filter((id) => id !== branchId)
          : [...prev.selectedBranches, branchId],
      };
    });
  };

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-[calc(100vh-4rem)] select-none shrink-0 overflow-y-auto custom-scrollbar p-3 space-y-4">
      {/* Google Calendar Style + Crear Big Pill Button */}
      <div className="relative">
        <button
          id="btn-sidebar-create"
          onClick={() => setIsCreateOpen(!isCreateOpen)}
          className="flex items-center gap-3 px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl shadow-md hover:shadow-lg border border-slate-200 transition-all duration-150 active:scale-95 group w-full"
        >
          <div className="w-7 h-7 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-slate-900 font-semibold">Crear nuevo</span>
          <ChevronDown className="w-4 h-4 ml-auto text-slate-400" />
        </button>

        {isCreateOpen && (
          <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
            <button
              id="btn-sidebar-create-event"
              onClick={() => {
                setIsCreateOpen(false);
                onCreateEventClick();
              }}
              className="w-full text-left px-3.5 py-2 hover:bg-blue-50 flex items-center gap-2.5 text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <span>Evento Principal</span>
            </button>
            <button
              id="btn-sidebar-create-activity"
              onClick={() => {
                setIsCreateOpen(false);
                onCreateActivityClick();
              }}
              className="w-full text-left px-3.5 py-2 hover:bg-blue-50 flex items-center gap-2.5 text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <span>Actividad Operativa</span>
            </button>
          </div>
        )}
      </div>

      {/* Mini Interactive Month Calendar */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-800 capitalize">
            {format(miniCalendarMonth, 'MMMM yyyy', { locale: es })}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMiniCalendarMonth(subMonths(miniCalendarMonth, 1))}
              className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMiniCalendarMonth(addMonths(miniCalendarMonth, 1))}
              className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
              title="Mes siguiente"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Week day headers */}
        <div className="grid grid-cols-7 text-center mb-1">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
            <span key={idx} className="text-[10px] font-bold text-slate-400 py-0.5">
              {day}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-0.5 text-center">
          {miniDays.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, miniCalendarMonth);
            const isSelected = isSameDay(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={idx}
                onClick={() => onSelectDate(day)}
                className={`h-6 w-6 mx-auto text-[11px] font-medium rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : isCurrentDay
                    ? 'bg-blue-100 text-blue-700 font-bold'
                    : isCurrentMonth
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-slate-300 hover:bg-slate-50'
                }`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layers / Calendars toggles */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-2">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Capas de visualización
        </div>

        {/* Eventos Principales */}
        <label className="flex items-center gap-2.5 px-1 py-1 rounded-md hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-800 transition-colors">
          <input
            type="checkbox"
            checked={filters.showEvents}
            onChange={(e) =>
              onUpdateFilters((prev) => ({ ...prev, showEvents: e.target.checked }))
            }
            className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-slate-300 cursor-pointer"
          />
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
          <span className="flex-1 truncate">Eventos Principales</span>
          <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 rounded">
            {totalEventsCount}
          </span>
        </label>

        {/* Actividades Operativas */}
        <label className="flex items-center gap-2.5 px-1 py-1 rounded-md hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-800 transition-colors">
          <input
            type="checkbox"
            checked={filters.showActivities}
            onChange={(e) =>
              onUpdateFilters((prev) => ({ ...prev, showActivities: e.target.checked }))
            }
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
          />
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          <span className="flex-1 truncate">Actividades Operativas</span>
          <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 rounded">
            {totalActivitiesCount}
          </span>
        </label>

        {/* Google Calendar Sync layer */}
        <label className="flex items-center gap-2.5 px-1 py-1 rounded-md hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-800 transition-colors">
          <input
            type="checkbox"
            checked={filters.showGoogleCalendar}
            onChange={(e) =>
              onUpdateFilters((prev) => ({ ...prev, showGoogleCalendar: e.target.checked }))
            }
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
          />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span className="flex-1 truncate">Google Calendar Sync</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Sincronizado" />
        </label>
      </div>

      {/* Activity Types Filter */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-2">
        <div
          onClick={() => setIsActivityTypesCollapsed(!isActivityTypesCollapsed)}
          className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 cursor-pointer hover:text-slate-600"
        >
          <span>Tipo de Actividad</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              isActivityTypesCollapsed ? '-rotate-90' : ''
            }`}
          />
        </div>

        {!isActivityTypesCollapsed && (
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {(Object.keys(ACTIVITY_TYPE_LABELS) as ActivityType[]).map((type) => {
              const meta = ACTIVITY_TYPE_LABELS[type];
              const isChecked =
                filters.selectedActivityTypes.length === 0 ||
                filters.selectedActivityTypes.includes(type);

              return (
                <label
                  key={type}
                  className="flex items-center gap-2 px-1 py-1 rounded hover:bg-slate-50 cursor-pointer text-xs text-slate-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleActivityType(type)}
                    className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                    style={{ color: meta.defaultColor }}
                  >
                    {getActivityIcon(type, 'w-3.5 h-3.5')}
                  </div>
                  <span className="truncate flex-1">{meta.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Responsible / Users Filter */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-2">
        <div
          onClick={() => setIsUsersCollapsed(!isUsersCollapsed)}
          className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 cursor-pointer hover:text-slate-600"
        >
          <span>Responsable</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              isUsersCollapsed ? '-rotate-90' : ''
            }`}
          />
        </div>

        {!isUsersCollapsed && (
          <div className="space-y-1.5">
            {USERS.map((user) => {
              const isChecked =
                filters.selectedUserIds.length === 0 ||
                filters.selectedUserIds.includes(user.id);

              return (
                <label
                  key={user.id}
                  className="flex items-center gap-2 px-1 py-1 rounded hover:bg-slate-50 cursor-pointer text-xs text-slate-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleUser(user.id)}
                    className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex-1 truncate">
                    <div className="truncate font-medium text-slate-800">{user.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.role}</div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Branches Filter */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-2">
        <div
          onClick={() => setIsBranchesCollapsed(!isBranchesCollapsed)}
          className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 cursor-pointer hover:text-slate-600"
        >
          <span>Sucursal</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              isBranchesCollapsed ? '-rotate-90' : ''
            }`}
          />
        </div>

        {!isBranchesCollapsed && (
          <div className="space-y-1">
            {BRANCHES.map((b) => {
              const isChecked =
                filters.selectedBranches.length === 0 ||
                filters.selectedBranches.includes(b.id);

              return (
                <label
                  key={b.id}
                  className="flex items-center gap-2 px-1 py-1 rounded hover:bg-slate-50 cursor-pointer text-xs text-slate-700 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBranch(b.id)}
                    className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate flex-1 font-medium">{b.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
