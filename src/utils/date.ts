import { WeekType } from "../../generated/prisma/enums"

export function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

export function isSameWeek(a: Date, b: Date): boolean {
  return startOfWeek(a).getTime() === startOfWeek(b).getTime()
}

export function isSameDay(a: Date, b: Date): boolean {
  const dateA = new Date(a);
  const dateB = new Date(b);

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function getWeekDayIndex(date: Date): number {
  return (date.getDay() + 6) % 7
}

export function getWeekParity(date: Date): WeekType {
  const baseDate = new Date(2024, 0, 1)
  const MS_IN_WEEK = 1000 * 60 * 60 * 24 * 7

  const diffMs = date.getTime() - baseDate.getTime()
  const diffWeeks = Math.floor(diffMs / MS_IN_WEEK)

  return diffWeeks % 2 === 0 ? WeekType.EVEN : WeekType.ODD
}

export function isWeekDayInRange(
  weekStart: Date,
  weekDayIndex: number,
  rangeStart: Date,
  rangeEnd: Date,
): boolean {
  const dayDate = new Date(weekStart)
  dayDate.setDate(dayDate.getDate() + weekDayIndex)
  dayDate.setHours(0, 0, 0, 0)

  const from = new Date(rangeStart)
  from.setHours(0, 0, 0, 0)

  const to = new Date(rangeEnd)
  to.setHours(23, 59, 59, 999)

  return dayDate >= from && dayDate <= to
}

export function isDateInRange(
  date: Date,
  rangeStart: Date,
  rangeEnd: Date,
): boolean {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)

  const from = new Date(rangeStart)
  from.setHours(0, 0, 0, 0)

  const to = new Date(rangeEnd)
  to.setHours(23, 59, 59, 999)

  return d >= from && d <= to
}

export function doesWeekIntersectRange(
  weekStart: Date,
  rangeStart: Date,
  rangeEnd: Date,
): boolean {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  return weekStart <= rangeEnd && weekEnd >= rangeStart
}

export function getEndOfWeek(startDate: Date): Date {
  const endDate = new Date(startDate)
  //const start = startOfWeek(startDate)
  endDate.setDate(startDate.getDate() + 6)
  return endDate
}
