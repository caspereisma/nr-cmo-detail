export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const REPEAT_OPTIONS = ["Annually", "Semi-annually", "Quarterly", "Monthly"] as const;
export type RepeatOption = (typeof REPEAT_OPTIONS)[number];

export interface DeadlineConfig {
  type: string;
  repeats: RepeatOption;
  month: string;
  day: string;
}

export function nextDueDate(d: DeadlineConfig): Date | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthIdx = MONTHS.indexOf(d.month);
  const dayNum = (m: number, y: number) =>
    d.day === "Last day"
      ? new Date(y, m + 1, 0).getDate()
      : Math.min(parseInt(d.day), new Date(y, m + 1, 0).getDate());

  if (d.repeats === "Annually") {
    const y = today.getFullYear();
    let next = new Date(y, monthIdx, dayNum(monthIdx, y));
    if (next <= today) next = new Date(y + 1, monthIdx, dayNum(monthIdx, y + 1));
    return next;
  }

  if (d.repeats === "Semi-annually") {
    const y = today.getFullYear();
    const candidates = [
      new Date(y, monthIdx, dayNum(monthIdx, y)),
      new Date(y, monthIdx + 6, dayNum(monthIdx + 6, y)),
      new Date(y + 1, monthIdx, dayNum(monthIdx, y + 1)),
    ];
    return candidates.find((c) => c > today) ?? candidates[2];
  }

  if (d.repeats === "Quarterly") {
    const quarterEnds = [2, 5, 8, 11]; // Mar, Jun, Sep, Dec
    const y = today.getFullYear();
    for (const m of quarterEnds) {
      const c = new Date(y, m, dayNum(m, y));
      if (c > today) return c;
    }
    return new Date(y + 1, 2, dayNum(2, y + 1));
  }

  if (d.repeats === "Monthly") {
    const y = today.getFullYear();
    const m = today.getMonth();
    let c = new Date(y, m, dayNum(m, y));
    if (c <= today) c = new Date(y, m + 1, dayNum(m + 1, y));
    return c;
  }

  return null;
}

const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function formatNextDue(d: DeadlineConfig): {
  date: string;
  countdown: string;
  daysUntil: number;
} {
  const next = nextDueDate(d);
  if (!next) return { date: "—", countdown: "", daysUntil: Infinity };

  const dateStr = `${next.getDate()} ${MONTH_ABBR[next.getMonth()]} ${next.getFullYear()}`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((next.getTime() - today.getTime()) / 86_400_000);

  const countdown =
    diffDays === 0 ? "today"
    : diffDays === 1 ? "tomorrow"
    : diffDays < 0 ? `${Math.abs(diffDays)}d overdue`
    : `in ${diffDays}d`;

  return { date: dateStr, countdown, daysUntil: diffDays };
}

/** Returns the soonest upcoming deadline from an array, or null. */
export function nearestDeadline(
  deadlines: DeadlineConfig[]
): (DeadlineConfig & { date: string; countdown: string; daysUntil: number }) | null {
  let best: (DeadlineConfig & { date: string; countdown: string; daysUntil: number }) | null = null;
  for (const d of deadlines) {
    const f = formatNextDue(d);
    if (!best || f.daysUntil < best.daysUntil) {
      best = { ...d, ...f };
    }
  }
  return best;
}
