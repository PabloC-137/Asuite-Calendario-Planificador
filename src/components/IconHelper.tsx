import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Settings,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Video,
  Phone,
  Truck,
  PackageCheck,
  Wrench,
  Hammer,
  Boxes,
  ArrowDownToLine,
  Volume2,
  MessageSquare,
  ClipboardList,
  Bell,
  MoreHorizontal,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  X,
  FileText,
  Paperclip,
  Tag,
  Shield,
  Layers,
  ChevronDown,
  Sparkles,
  Edit3,
  Trash2,
  CalendarDays,
  ListFilter,
  Grid,
  Radio,
  SlidersHorizontal,
  Building,
  UserCheck,
  Lock,
  Share2,
} from 'lucide-react';
import { ActivityType } from '../types';

export function getActivityIcon(type: ActivityType, className: string = 'w-4 h-4') {
  switch (type) {
    case 'llamada':
      return <Phone className={className} />;
    case 'reunion':
      return <Users className={className} />;
    case 'videollamada':
      return <Video className={className} />;
    case 'visita':
      return <MapPin className={className} />;
    case 'entrega':
      return <Truck className={className} />;
    case 'recoleccion':
      return <PackageCheck className={className} />;
    case 'instalacion':
      return <Wrench className={className} />;
    case 'desinstalacion':
      return <Hammer className={className} />;
    case 'carga':
      return <Boxes className={className} />;
    case 'descarga':
      return <ArrowDownToLine className={className} />;
    case 'prueba_audio':
      return <Volume2 className={className} />;
    case 'seguimiento':
      return <MessageSquare className={className} />;
    case 'tarea_admin':
      return <ClipboardList className={className} />;
    case 'recordatorio':
      return <Bell className={className} />;
    case 'otro':
    default:
      return <MoreHorizontal className={className} />;
  }
}
