"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstBusinessDay = getFirstBusinessDay;
const core = __importStar(require("@actions/core"));
const date_holidays_1 = __importDefault(require("date-holidays"));
/**
 * Returns the first business day of the specified year and month
 * *Business day: Excluding Saturdays, Sundays, and holidays
 *
 * @param year Year in Western calendar
 * @param month Month from 0-11 (e.g., 0=January)
 * @returns Date object of the business day
 */
function getFirstBusinessDay(year, month) {
    const country = core.getInput('country');
    const hd = new date_holidays_1.default(country);
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
function run() {
    try {
        const timezone = core.getInput('timezone') || undefined;
        const locale = core.getInput('locale') || undefined;
        const today = new Date(new Date().toLocaleString(locale, { timeZone: timezone }));
        const firstBusinessDay = getFirstBusinessDay(today.getFullYear(), today.getMonth());
        const isFirstBusinessDay = today.getFullYear() === firstBusinessDay.getFullYear() &&
            today.getMonth() === firstBusinessDay.getMonth() &&
            today.getDate() === firstBusinessDay.getDate();
        core.setOutput('is_first_business_day', isFirstBusinessDay.toString());
        core.setOutput('first_business_day', firstBusinessDay);
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        else {
            core.setFailed("Unknown error");
        }
    }
}
// Call run() when executed as a GitHub Action
if (require.main === module) {
    run();
}
