import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  Calendar as CalendarIcon,
  Video,
  Shield,
  ExternalLink,
  Sliders,
  Sparkles,
  Layers,
} from 'lucide-react';

interface GoogleCalendarSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  onToggleConnection: () => void;
}

export const GoogleCalendarSettingsModal: React.FC<GoogleCalendarSettingsModalProps> = ({
  isOpen,
  onClose,
  isConnected,
  onToggleConnection,
}) => {
  const [selectedCalendar, setSelectedCalendar] = useState('c_asuite_ops');
  const [syncDirection, setSyncDirection] = useState<'two_way' | 'push_only' | 'pull_only'>('two_way');
  const [autoCreateMeet, setAutoCreateMeet] = useState(true);
  const [avoidDuplicates, setAvoidDuplicates] = useState(true);
  const [syncCancellations, setSyncCancellations] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleTestSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-2xs overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
              G
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Integración con Google Calendar & Meet
              </h2>
              <p className="text-xs text-slate-500">
                Sincronización bidireccional y reuniones virtuales
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh] custom-scrollbar">
          {/* Account Status Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-lg font-bold text-blue-600 shadow-2xs">
                G
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  pablocastillejos13@gmail.com
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Google Workspace Conectado</span>
                </div>
              </div>
            </div>

            <button
              onClick={onToggleConnection}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isConnected
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isConnected ? 'Desconectar' : 'Conectar Cuenta'}
            </button>
          </div>

          {/* Calendar Mapping Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Calendario de Google de Destino
            </label>
            <select
              value={selectedCalendar}
              onChange={(e) => setSelectedCalendar(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-semibold text-slate-800"
            >
              <option value="c_asuite_ops">Asuite – Operaciones & Producción Principal</option>
              <option value="c_asuite_logistics">Asuite – Logística, Carga y Fletes</option>
              <option value="c_asuite_personal">Calendario Principal del Usuario</option>
            </select>
          </div>

          {/* Sync Rules and Switches */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Opciones de Sincronización
            </div>

            {/* Switch: Google Meet auto create */}
            <label className="flex items-start justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Crear enlaces de Google Meet automáticamente</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Genera una sala de Meet al crear reuniones y videollamadas con clientes
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoCreateMeet}
                onChange={(e) => setAutoCreateMeet(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 mt-1"
              />
            </label>

            {/* Switch: Avoid duplicate events */}
            <label className="flex items-start justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Prevención de eventos duplicados</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Detecta IDs coincidentes y actualiza en lugar de duplicar
                </div>
              </div>
              <input
                type="checkbox"
                checked={avoidDuplicates}
                onChange={(e) => setAvoidDuplicates(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 mt-1"
              />
            </label>

            {/* Switch: Sync cancellations */}
            <label className="flex items-start justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>Sincronizar cancelaciones y reprogramaciones</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Refleja cambios de fecha y horario en Google Calendar al instante
                </div>
              </div>
              <input
                type="checkbox"
                checked={syncCancellations}
                onChange={(e) => setSyncCancellations(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 mt-1"
              />
            </label>
          </div>

          {/* Outlook / Microsoft 365 Architecture Notice */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Soporte para Microsoft Outlook / Office 365</span>
            </div>
            <p className="text-[11px] text-indigo-700">
              La arquitectura modular de Asuite está lista para sincronizar con Microsoft Graph API y Outlook Calendar en próximas versiones.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestSync}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};
