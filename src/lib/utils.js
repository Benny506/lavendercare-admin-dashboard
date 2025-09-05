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

export function getAppointmentStatus({ status, date_ISO, startHour, duration_secs }) {
  const now = DateTime.now();

  // Build the start time at the given hour on the given date
  const bookingStartTime = DateTime.fromISO(date_ISO).set({
    hour: startHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  // Calculate end time by adding duration
  const bookingEndTime = bookingStartTime.plus({ seconds: duration_secs });

  // Helper flags
  const hasStarted = now >= bookingStartTime;
  const hasEnded   = now > bookingEndTime;

  // 1) If the appointment is new and is currently in progress
  if ((status === 'new' || status == 'awaiting_completion') && hasStarted && !hasEnded) {
    return 'ongoing';
  }

  // 2) new → either still new or missed
  if (status === 'new') {
    return hasStarted ? 'missed' : 'new';
  }

  // 3) New but not ongoing → still new
  if (status === 'new') {
    return 'new';
  }

  // 4) Cancelled → as is
  if (status === 'cancelled') {
    return 'cancelled';
  }

  // 5) Completed → as is
  if (status === 'completed') {
    return 'completed';
  }

  // 6) Awating completion → as is
  if (status === 'awaiting_completion') {
    return 'awaiting_completion';
  }  

  // Fallback to the raw status
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