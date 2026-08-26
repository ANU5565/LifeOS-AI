/**
 * LifeOS AI — Utility functions.
 */

/**
 * Format a date string to a human-readable relative format.
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 0) return "Today";
    if (absDays === 1) return "Yesterday";
    if (absDays < 7) return `${absDays} days ago`;
    return date.toLocaleDateString();
  }

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays} days`;
  return date.toLocaleDateString();
}

/**
 * Format a date to a short display string.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date to include time.
 */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Get severity color class based on severity level.
 */
export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    case "high":
      return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    case "medium":
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    case "low":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    default:
      return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
  }
}

/**
 * Get status color class.
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "text-emerald-400 bg-emerald-500/10";
    case "in_progress":
      return "text-blue-400 bg-blue-500/10";
    case "not_started":
      return "text-zinc-400 bg-zinc-500/10";
    case "at_risk":
      return "text-orange-400 bg-orange-500/10";
    case "blocked":
      return "text-red-400 bg-red-500/10";
    default:
      return "text-zinc-400 bg-zinc-500/10";
  }
}

/**
 * Capitalize first letter.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
