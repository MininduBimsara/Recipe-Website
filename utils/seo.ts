/**
 * Converts human-readable time strings into ISO 8601 duration format.
 * Examples:
 * - "15 mins" -> "PT15M"
 * - "24 hrs" -> "PT24H"
 * - "1 hr 30 mins" -> "PT1H30M"
 * - "8 hrs" -> "PT8H"
 * - "45 mins" -> "PT45M"
 */
export function parseToISODuration(timeStr: string | undefined): string {
  if (!timeStr) return 'PT20M'; // fallback placeholder

  // If it is already in ISO 8601 format (starts with P, e.g. PT42M, PT24H42M)
  if (/^P[T]?\d+/.test(timeStr)) {
    return timeStr;
  }

  const normalized = timeStr.toLowerCase().trim();
  
  let hours = 0;
  let minutes = 0;

  // Extract hours (matches: "1 hr", "2 hrs", "24 hours", "1.5 hrs")
  const hourMatch = normalized.match(/([\d\.]+)\s*(hr|hrs|hour|hours|h)\b/);
  if (hourMatch) {
    const rawHours = parseFloat(hourMatch[1]);
    if (!isNaN(rawHours)) {
      hours = Math.floor(rawHours);
      // Handle decimals (e.g. 1.5 hrs -> 1 hr 30 mins)
      const fractionalHour = rawHours - hours;
      if (fractionalHour > 0) {
        minutes += Math.round(fractionalHour * 60);
      }
    }
  }

  // Extract minutes (matches: "15 min", "45 mins", "30 minutes", "40m")
  const minMatch = normalized.match(/(\d+)\s*(min|mins|minute|minutes|m)\b/);
  if (minMatch) {
    const rawMins = parseInt(minMatch[1], 10);
    if (!isNaN(rawMins)) {
      minutes += rawMins;
    }
  }

  // Handle case where it just has a number without explicitly matched hour/min unit (fallback to minutes)
  if (!hourMatch && !minMatch) {
    const numericMatch = normalized.match(/^(\d+)$/);
    if (numericMatch) {
      minutes = parseInt(numericMatch[1], 10);
    }
  }

  // Format into ISO 8601 duration string
  let duration = 'PT';
  
  if (hours > 0) {
    duration += `${hours}H`;
  }
  
  // Distribute minutes overflow to hours if any
  if (minutes >= 60) {
    const overflowHours = Math.floor(minutes / 60);
    const prevHours = hours;
    hours += overflowHours;
    minutes = minutes % 60;
    
    // rebuild duration string with adjusted hours
    duration = 'PT';
    if (hours > 0) {
      duration += `${hours}H`;
    }
  }

  if (minutes > 0 || hours === 0) {
    duration += `${minutes}M`;
  }

  return duration;
}
