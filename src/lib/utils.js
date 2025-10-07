import { DateTime } from 'luxon'

export function generateNumericCode(length = 6) {
  const charset = '0123456789';
  let code = '';

  // Use crypto for stronger randomness if available
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      code += charset[values[i] % charset.length];
    }
  } else {
    // Fallback to Math.random
    for (let i = 0; i < length; i++) {
      code += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }

  return code;
}

export const isoToDateTime = ({ isoString }) => {
  return DateTime.fromISO(isoString)
    .toFormat("ccc LLL dd. hh:mma"); 
};

export function getMaxByKey({ arr, key }) {
  if (!arr.length) return null;

  return arr.reduce((maxObj, current) => {
    return current[key] > maxObj[key] ? current : maxObj;
  });
}

export function formatTo12Hour({ time }) {
  const date = typeof time === "string" ? new Date(time) : time;

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // hour '0' should be '12'

  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
}

export function formatSlot(slot, userZone = "local") {
  // slot is in UTC from Supabase
  const dt = DateTime.fromISO(slot, { zone: "utc" });

  // convert to user zone
  const local = userZone === "local" ? dt.toLocal() : dt.setZone(userZone);

  // format in 12hr style e.g. 8:15 AM
  return local.toFormat("h:mm a");
}

export function secondsToLabel({ seconds }) {
  const mins = Math.floor(seconds / 60);
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (hours > 0 && remainingMins > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMins} min${remainingMins > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${remainingMins} min${remainingMins > 1 ? 's' : ''}`;
  }
}

export function getAppointmentStatus({ status, start_time, duration_secs }) {
  const now = DateTime.now();
  const bookingStartTime = DateTime.fromISO(start_time);
  const bookingEndTime = bookingStartTime.plus({ seconds: duration_secs });

  const hasStarted = now >= bookingStartTime;
  const hasEnded = now > bookingEndTime;

  // 1) If the appointment is new/awaiting_completion and ongoing
  if ((status === "new" || status === "awaiting_completion") && hasStarted && !hasEnded) {
    return "ongoing";
  }

  // 2) new → either still new or missed
  if (status === "new") {
    return hasStarted ? "missed" : "new";
  }

  // 3) cancelled → as is
  if (status === "cancelled") {
    return "cancelled";
  }

  // 4) completed → as is
  if (status === "completed") {
    return "completed";
  }

  // 5) awaiting_completion → as is
  if (status === "awaiting_completion") {
    return "awaiting_completion";
  }

  // fallback
  return status;
}

export const sortByStatusPriority = (arr) => {
  const priorityOrder = [
    'ongoing',
    'new',
    'awaiting_completion',
    'completed',
    'missed',
    'cancelled'
  ];

  return [...arr].sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.status);
    const bIndex = priorityOrder.indexOf(b.status);
    return aIndex - bIndex;
  });
};

export function isoToAMPM({ isoString }) {
  const dt = DateTime.fromISO(isoString);
  if (!dt.isValid) return '';
  return dt.toFormat('hh:mm a'); // hh = 2-digit hour, a = AM/PM
}

export function removeDuplicatesByKey({ arr, key }) {
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) {
      return false;
    }
    seen.add(val);
    return true;
  });
}

export const sortByDate = ({ arr, key, ascending = false }) => {
  if (!Array.isArray(arr) || !key) return [];

  return [...arr].sort((a, b) => {
    const dateA = DateTime.fromISO(a[key]);
    const dateB = DateTime.fromISO(b[key]);

    if (!dateA.isValid && !dateB.isValid) return 0;
    if (!dateA.isValid) return 1; // invalid date goes last
    if (!dateB.isValid) return -1;

    return ascending
      ? dateA.toMillis() - dateB.toMillis()
      : dateB.toMillis() - dateA.toMillis();
  });
};

export function formatNumberWithCommas(value) {
  if (value === null || value === undefined || isNaN(value)) return "";

  return Number(value).toLocaleString();
}

export function formatDate1({ dateISO }) {
  try {
    if (!dateISO || typeof dateISO !== "string") {
      return ""; // or "Invalid date"
    }

    const date = DateTime.fromISO(dateISO);

    if (!date.isValid) {
      return ""; // or "Invalid date"
    }

    return date.toFormat("ccc dd LLLL");
  } catch (error) {
    console.error("formatDate1 error:", error);
    return ""; // fallback if something unexpected happens
  }
}

export function timeToAMPM_FromHour({ hour }) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0); // hour:00:00
  const hours = date.getHours();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  return `${hours.toString().padStart(2, '0')}:00 ${suffix}`;
}

export const formatTimeToHHMMSS = ({ secs }) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export function formatTimeToDuration({ secs }) {
  const totalMinutes = secs / 60
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let parts = [];

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  }

  return parts.join(" ");
}

export function getHourFromHHMM({ timeStr }) {
  if (!/^\d{2}:\d{2}$/.test(timeStr)) {
    throw new Error("Invalid time format. Expected HH:mm");
  }
  const [hourStr] = timeStr.split(":");
  return parseInt(hourStr, 10); // removes leading zeros
}