import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  parseISO,
  isToday,
  differenceInMinutes,
  setHours,
  setMinutes,
} from 'date-fns';
import { es } from 'date-fns/locale';

export {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  parseISO,
  isToday,
};

export const ES_LOCALE = es;

export function formatHeaderDate(date: Date, view: string): string {
  if (view === 'day') {
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  }
  if (view === 'week') {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    if (isSameMonth(start, end)) {
      return `${format(start, 'd', { locale: es })} – ${format(end, "d 'de' MMMM 'de' yyyy", { locale: es })}`;
    }
    return `${format(start, "d 'de' MMM", { locale: es })} – ${format(end, "d 'de' MMM 'de' yyyy", { locale: es })}`;
  }
  if (view === 'month') {
    return format(date, "MMMM 'de' yyyy", { locale: es });
  }
  if (view === 'agenda' || view === 'resources') {
    return format(date, "MMMM 'de' yyyy", { locale: es });
  }
  return format(date, "MMMM yyyy", { locale: es });
}

export function formatTimeRange(startIso: string, endIso: string, allDay?: boolean): string {
  if (allDay) return 'Todo el día';
  try {
    const start = parseISO(startIso);
    const end = parseISO(endIso);
    return `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`;
  } catch {
    return `${startIso} – ${endIso}`;
  }
}

export function formatFullDateTime(isoString: string): string {
  try {
    const date = parseISO(isoString);
    return format(date, "EEE d 'de' MMM, yyyy · HH:mm 'hrs'", { locale: es });
  } catch {
    return isoString;
  }
}

export function getMonthGrid(currentDate: Date): Date[][] {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  allDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return weeks;
}

export function getWeekDays(currentDate: Date): Date[] {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const end = endOfWeek(currentDate, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export const HOURS_IN_DAY = Array.from({ length: 24 }, (_, i) => i); // 00:00 to 23:00

export function getItemTimePosition(startIso: string, endIso: string) {
  try {
    const start = parseISO(startIso);
    const end = parseISO(endIso);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    let durationMinutes = differenceInMinutes(end, start);
    if (durationMinutes <= 0) durationMinutes = 30; // minimum block height

    // Top position in pixels (assuming 60px per hour => 1px per min)
    const topPx = startMinutes; // 1px = 1min
    const heightPx = Math.max(durationMinutes, 24); // min 24px

    return { topPx, heightPx };
  } catch {
    return { topPx: 480, heightPx: 60 };
  }
}

export function createISOFromDateAndTimeString(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}`;
}

export function extractDateAndTimeString(isoString: string): { dateStr: string; timeStr: string } {
  try {
    const [d, t] = isoString.split('T');
    return {
      dateStr: d || format(new Date(), 'yyyy-MM-dd'),
      timeStr: t ? t.substring(0, 5) : '10:00',
    };
  } catch {
    return { dateStr: '2026-08-25', timeStr: '10:00' };
  }
}
