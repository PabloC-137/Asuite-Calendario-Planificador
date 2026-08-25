import { CalendarEvent, CalendarActivity, ResourceConflict, Resource } from '../types';

export function findResourceConflicts(
  events: CalendarEvent[],
  activities: CalendarActivity[],
  resources: Resource[]
): ResourceConflict[] {
  const conflictsMap = new Map<string, ResourceConflict>();

  // Collect all scheduled items with resource assignments
  interface SchedItem {
    id: string;
    title: string;
    type: 'event' | 'activity';
    startDate: Date;
    endDate: Date;
    resourceIds: string[];
  }

  const items: SchedItem[] = [];

  events.forEach((evt) => {
    if (evt.status === 'cancelled') return;
    const start = new Date(evt.startDate);
    const end = new Date(evt.endDate);
    const resourceIds = evt.assignedResources.map((r) => r.resourceId);
    if (resourceIds.length > 0) {
      items.push({
        id: evt.id,
        title: evt.title,
        type: 'event',
        startDate: start,
        endDate: end,
        resourceIds,
      });
    }
  });

  activities.forEach((act) => {
    if (act.status === 'cancelled') return;
    const start = new Date(act.startDate);
    const end = new Date(act.endDate);
    const resourceIds = act.assignedResources.map((r) => r.resourceId);
    if (resourceIds.length > 0) {
      items.push({
        id: act.id,
        title: act.title,
        type: 'activity',
        startDate: start,
        endDate: end,
        resourceIds,
      });
    }
  });

  // Check each resource for overlaps
  resources.forEach((res) => {
    const itemsWithRes = items.filter((item) => item.resourceIds.includes(res.id));
    if (itemsWithRes.length < 2) return;

    for (let i = 0; i < itemsWithRes.length; i++) {
      for (let j = i + 1; j < itemsWithRes.length; j++) {
        const a = itemsWithRes[i];
        const b = itemsWithRes[j];

        // Check if intervals overlap: startA < endB && startB < endA
        if (a.startDate < b.endDate && b.startDate < a.endDate) {
          if (!conflictsMap.has(res.id)) {
            conflictsMap.set(res.id, {
              resourceId: res.id,
              resourceName: res.name,
              resourceType: res.type,
              conflictingItems: [],
            });
          }

          const conflict = conflictsMap.get(res.id)!;
          
          if (!conflict.conflictingItems.some((ci) => ci.id === a.id)) {
            conflict.conflictingItems.push({
              id: a.id,
              title: a.title,
              type: a.type,
              startDate: a.startDate.toISOString(),
              endDate: a.endDate.toISOString(),
            });
          }
          if (!conflict.conflictingItems.some((ci) => ci.id === b.id)) {
            conflict.conflictingItems.push({
              id: b.id,
              title: b.title,
              type: b.type,
              startDate: b.startDate.toISOString(),
              endDate: b.endDate.toISOString(),
            });
          }
        }
      }
    }
  });

  return Array.from(conflictsMap.values());
}
