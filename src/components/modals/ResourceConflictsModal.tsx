import React from 'react';
import {
  X,
  AlertTriangle,
  Clock,
  Truck,
  Volume2,
  Tv,
  Wrench,
  User,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
} from 'lucide-react';
import { ResourceConflict, CalendarEvent, CalendarActivity } from '../../types';
import { formatTimeRange, formatFullDateTime } from '../../utils/dateUtils';

interface ResourceConflictsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflicts: ResourceConflict[];
  onOpenItem: (id: string, type: 'event' | 'activity') => void;
}

export const ResourceConflictsModal: React.FC<ResourceConflictsModalProps> = ({
  isOpen,
  onClose,
  conflicts,
  onOpenItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-2xs overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-200 bg-rose-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-rose-950">
                Conflictos de Recursos Detectados ({conflicts.length})
              </h2>
              <p className="text-xs text-rose-700">
                Solapamiento de horarios en vehículos, consolas o personal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {conflicts.length === 0 ? (
            <div className="text-center py-10 text-emerald-700 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold">¡Excelente! No hay conflictos activos</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Todos los vehículos, equipos y técnicos cuentan con asignaciones en horarios compatibles.
              </p>
            </div>
          ) : (
            conflicts.map((conflict) => (
              <div
                key={conflict.resourceId}
                className="p-4 bg-slate-50 border border-rose-200 rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {conflict.resourceName}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full border border-rose-200">
                      {conflict.resourceType}
                    </span>
                  </div>
                  <span className="text-xs text-rose-600 font-bold">
                    {conflict.conflictingItems.length} asignaciones simultáneas
                  </span>
                </div>

                <div className="space-y-2">
                  {conflict.conflictingItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onClose();
                        onOpenItem(item.id, item.type);
                      }}
                      className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              item.type === 'event'
                                ? 'bg-pink-100 text-pink-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}
                          >
                            {item.type === 'event' ? 'Evento' : 'Actividad'}
                          </span>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                            {item.title}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatFullDateTime(item.startDate)}</span>
                          <span>–</span>
                          <span>{formatTimeRange(item.startDate, item.endDate)}</span>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <span>Reprogramar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
