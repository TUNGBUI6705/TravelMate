/**
 * Date formatting utilities for admin panel
 */

/**
 * Formats a date value to a readable string
 * @param {Date|string|number|null} dateValue - Date value to format
 * @returns {string} Formatted date string
 */
export function formatDateValue(dateValue) {
  if (!dateValue) return "N/A";

  let date;
  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === "string") {
    date = new Date(dateValue);
  } else if (typeof dateValue === "number") {
    date = new Date(dateValue);
  } else {
    return "N/A";
  }

  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}