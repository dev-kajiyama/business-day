import * as core from '@actions/core';
import Holidays from 'date-holidays';

/**
 * Returns the first business day of the specified year and month
 * *Business day: Excluding Saturdays, Sundays, and holidays
 *
 * @param year Year in Western calendar
 * @param month Month from 0-11 (e.g., 0=January)
 * @returns Date object of the business day
 */
export function getFirstBusinessDay(year: number, month: number): Date {
    const country = core.getInput('country');
    const hd = new Holidays(country);
    let date = new Date(year, month, 1);
    // Loop to find a business day
    while (true) {
        const dayOfWeek = date.getDay();
        // Exclude weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            date.setDate(date.getDate() + 1);
            continue;
        }
        // Also exclude holidays
        if (hd.isHoliday(date)) {
            date.setDate(date.getDate() + 1);
            continue;
        }
        return date;
    }
}

function run(): void {
    try {
        const timezone = core.getInput('timezone') || undefined;
        const locale = core.getInput('locale') || undefined;
        const today = new Date(new Date().toLocaleString(locale, { timeZone: timezone }));
        const firstBusinessDay = getFirstBusinessDay(today.getFullYear(), today.getMonth());
        const isFirstBusinessDay =
            today.getFullYear() === firstBusinessDay.getFullYear() &&
            today.getMonth() === firstBusinessDay.getMonth() &&
            today.getDate() === firstBusinessDay.getDate();

        core.setOutput('is_first_business_day', isFirstBusinessDay.toString());
        core.setOutput('first_business_day', firstBusinessDay);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        } else {
            core.setFailed("Unknown error");
        }
    }
}

// Call run() when executed as a GitHub Action
if (require.main === module) {
    run();
}
