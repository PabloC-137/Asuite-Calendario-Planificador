import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  Filter,
  Plus,
  RefreshCw,
  AlertTriangle,
  Bell,
  ChevronDown,
  Layers,
  Building,
  CheckCircle2,
  CalendarCheck,
  Video,
  ListFilter,
  Grid3X3,
  Columns,
  CalendarRange,
  Cpu,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ViewMode, FilterState, ResourceConflict } from '../types';
import { BRANCHES } from '../data/mockData';

interface HeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onViewModeChange: (view: ViewMode) => void;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  onNavigateToday: () => void;
  titleFormatted: string;
  filters: FilterState;
  onUpdateFilters: (updater: (prev: FilterState) => FilterState) => void;
  onCreateEventClick: () => void;
  onCreateActivityClick: () => void;
  onOpenGoogleSyncModal: () => void;
  onOpenConflictsModal: () => void;
  conflicts: ResourceConflict[];
  isGoogleConnected: boolean;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  viewMode,
  onViewModeChange,
  onNavigatePrev,
  onNavigateNext,
  onNavigateToday,
  titleFormatted,
  filters,
  onUpdateFilters,
  onCreateEventClick,
  onCreateActivityClick,
  onOpenGoogleSyncModal,
  onOpenConflictsModal,
  conflicts,
  isGoogleConnected,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 900);
  };

  const getScopeLabel = () => {
    switch (filters.permissionScope) {
      case 'my_events':
        return 'Mis eventos y tareas';
      case 'my_team':
        return 'Mi equipo operativo';
      case 'my_branch':
        return 'Sucursal Matriz CDMX';
      case 'all':
      default:
        return 'Todos los eventos (Global)';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 select-none z-20 shrink-0 sticky top-0 shadow-xs">
      {/* Left section: Logo, Sidebar toggle, Date navigation */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          title={isSidebarOpen ? 'Ocultar panel lateral' : 'Mostrar panel lateral'}
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2.5 mr-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
            A
          </div>
          <div className="hidden sm:block leading-none">
            <span className="font-bold text-slate-900 text-base tracking-tight">Asuite</span>
            <span className="text-xs font-semibold text-blue-600 ml-1.5 px-1.5 py-0.5 bg-blue-50 rounded border border-blue-200">
              Planificador
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden md:block mx-1" />

        {/* Today button */}
        <button
          id="btn-nav-today"
          onClick={onNavigateToday}
          className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs active:scale-95"
        >
          Hoy
        </button>

        {/* Chevron Arrows */}
        <div className="flex items-center">
          <button
            id="btn-nav-prev"
            onClick={onNavigatePrev}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            id="btn-nav-next"
            onClick={onNavigateNext}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Formatted Date Title */}
        <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight capitalize min-w-44 truncate">
          {titleFormatted}
        </h1>
      </div>

      {/* Center section: Search & Permission Scope */}
      <div className="hidden lg:flex items-center gap-2 max-w-md flex-1 px-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="input-global-search"
            type="text"
            placeholder="Buscar eventos, clientes, cotización, actividades..."
            value={filters.searchQuery}
            onChange={(e) =>
              onUpdateFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-lg transition-all outline-none placeholder:text-slate-400 text-slate-800"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onUpdateFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Permission Scope dropdown */}
        <div className="relative">
          <button
            id="btn-scope-selector"
            onClick={() => setIsScopeDropdownOpen(!isScopeDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg whitespace-nowrap transition-colors"
          >
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <span className="max-w-[130px] truncate">{getScopeLabel()}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isScopeDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Ámbito de permisos
              </div>
              {[
                { id: 'my_events', label: 'Mis eventos y tareas', desc: 'Solo asignaciones a mi usuario' },
                { id: 'my_team', label: 'Mi equipo operativo', desc: 'Equipo técnico y audio/video' },
                { id: 'my_branch', label: 'Sucursal Matriz CDMX', desc: 'Todo en CDMX' },
                { id: 'all', label: 'Todos los eventos (Global)', desc: 'Todas las sucursales' },
              ].map((scope) => (
                <button
                  key={scope.id}
                  onClick={() => {
                    onUpdateFilters((prev) => ({
                      ...prev,
                      permissionScope: scope.id as any,
                    }));
                    setIsScopeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex flex-col transition-colors ${
                    filters.permissionScope === scope.id ? 'bg-blue-50/70 text-blue-700 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <span>{scope.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{scope.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right section: Sync status, Conflicts, View Switcher, + Create Button */}
      <div className="flex items-center gap-2">
        {/* Google Calendar Sync Chip */}
        <button
          id="btn-google-sync"
          onClick={onOpenGoogleSyncModal}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isGoogleConnected
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          title="Configuración de Sincronización con Google Calendar & Google Meet"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden xl:inline">Google Calendar</span>
          <RefreshCw
            className={`w-3.5 h-3.5 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleManualSync();
            }}
          />
        </button>

        {/* Conflict Warning Chip if conflicts exist */}
        {conflicts.length > 0 && (
          <button
            id="btn-conflicts-alert"
            onClick={onOpenConflictsModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors animate-bounce"
            title={`${conflicts.length} conflicto(s) de recursos detectados`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>{conflicts.length} Conflicto{conflicts.length > 1 ? 's' : ''}</span>
          </button>
        )}

        {/* View Mode Segmented Control */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
          {(
            [
              { id: 'day', label: 'Día' },
              { id: 'week', label: 'Semana' },
              { id: 'month', label: 'Mes' },
              { id: 'agenda', label: 'Agenda' },
              { id: 'resources', label: 'Recursos' },
            ] as { id: ViewMode; label: string }[]
          ).map((view) => (
            <button
              key={view.id}
              id={`btn-view-${view.id}`}
              onClick={() => onViewModeChange(view.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === view.id
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Fast Create Split Button */}
        <div className="relative">
          <button
            id="btn-header-create"
            onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Crear</span>
            <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </button>

          {isCreateDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                id="btn-create-event-option"
                onClick={() => {
                  setIsCreateDropdownOpen(false);
                  onCreateEventClick();
                }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 flex items-start gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-pink-100 text-pink-700 group-hover:bg-pink-200 transition-colors">
                  <CalendarRange className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    Nuevo Evento Principal
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Boda, Concierto, Conferencia, Renta de Equipo o Proyecto
                  </div>
                </div>
              </button>

              <div className="h-px bg-slate-100 my-1" />

              <button
                id="btn-create-activity-option"
                onClick={() => {
                  setIsCreateDropdownOpen(false);
                  onCreateActivityClick();
                }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-blue-50 flex items-start gap-3 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-teal-100 text-teal-700 group-hover:bg-teal-200 transition-colors">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    Nueva Actividad Operativa
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Carga, Montaje, Soundcheck, Google Meet o Visita
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
