import { redirect } from "next/navigation";
import { format } from "date-fns";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * Get the user's preferred locale from browser or fallback to default
 * @returns {string} The locale string (e.g., 'en-US', 'es-ES')
 */
export function getLocale(): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Get the user's preferred locale from browser
    return navigator.language || 'en-US';
  }
  
  // Fallback for server-side rendering
  return 'en-US';
}

/**
 * Format a date for display with localization
 * @param {Date | string} date - The date to format
 * @param {string} formatType - The type of format ('short', 'long', 'numeric', 'monthYear')
 * @returns {string} The formatted date string
 */
export function formatLocalizedDate(date: Date | string, formatType: 'short' | 'long' | 'numeric' | 'monthYear' = 'short'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return '';
  
  const locale = getLocale();
  
  try {
    switch (formatType) {
      case 'short':
        // Example: 2/14/2026
        return dateObj.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        });
        
      case 'long':
        // Example: February 14, 2026
        return dateObj.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
      case 'numeric':
        // Example: 02/14/2026
        return dateObj.toLocaleDateString(locale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        
      case 'monthYear':
        // Example: Feb 2026
        return dateObj.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'short'
        });
        
      default:
        return dateObj.toLocaleDateString(locale);
    }
  } catch (error) {
    // Fallback to ISO format if localization fails
    console.warn('Date localization failed, falling back to ISO format', error);
    return format(dateObj, 'MM/dd/yyyy');
  }
}

/**
 * Format a date and time for display with localization
 * @param {Date | string} date - The date to format
 * @param {boolean} includeSeconds - Whether to include seconds in the time
 * @returns {string} The formatted date and time string
 */
export function formatLocalizedDateTime(date: Date | string, includeSeconds: boolean = false): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return '';
  
  const locale = getLocale();
  
  try {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    
    if (includeSeconds) {
      timeOptions.second = '2-digit';
    }
    
    return dateObj.toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...timeOptions
    });
  } catch (error) {
    // Fallback to default format if localization fails
    console.warn('DateTime localization failed, falling back to default format', error);
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  }
}

/**
 * Format a date for HTML date input (always yyyy-mm-dd format regardless of locale)
 * @param {Date | string} date - The date to format
 * @returns {string} The formatted date string in yyyy-mm-dd format
 */
export function formatDateForInput(date: Date | string): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return '';
  
  // Always use ISO format for date inputs regardless of locale
  return format(dateObj, 'yyyy-MM-dd');
}

/**
 * Convert a date string from HTML date input to UTC Date for database storage
 * @param {string} dateString - The date string from HTML input (yyyy-mm-dd format)
 * @returns {Date} A Date object that preserves the selected date regardless of timezone
 */
export function convertInputDateToUTC(dateString: string): Date {
  if (!dateString) return new Date();
  
  // Create a Date object from the input string
  // The Date constructor will parse "yyyy-mm-dd" as a local date
  // This ensures the selected date is preserved in the user's timezone
  const date = new Date(dateString + 'T00:00:00');
  
  // Return the date - JavaScript Date objects are stored internally as UTC
  // but this preserves the user-selected date in their local timezone
  return date;
}

/**
 * Get current UTC timestamp for database operations
 * @returns {Date} Current date and time in UTC
 */
export function getCurrentUTC(): Date {
  return new Date(); // JavaScript Date constructor always creates UTC timestamps
}
