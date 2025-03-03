import * as core from '@actions/core';
import Holidays from 'date-holidays';

/**
 * 指定された年月の最初の営業日を返す
 * ＊営業日：土曜・日曜、日本の祝日を除く
 *
 * @param year 西暦年
 * @param month 0〜11の月（例: 0=1月）
 * @returns 営業日の Date オブジェクト
 */
export function getFirstBusinessDay(year: number, month: number): Date {
    const country = core.getInput('country');
    const hd = new Holidays(country);
    let date = new Date(year, month, 1);
    // ループで営業日を探す
    while (true) {
        const dayOfWeek = date.getDay();
        // 週末は除外
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            date.setDate(date.getDate() + 1);
            continue;
        }
        // 日本の祝日も除外（祝日の場合、hd.isHoliday(date) は holiday 情報を返す）
        if (hd.isHoliday(date)) {
            date.setDate(date.getDate() + 1);
            continue;
        }
        return date;
    }
}

function run(): void {
    try {
        const timezone = core.getInput('timezone');
        const locale = core.getInput('locale');
        const today = new Date(new Date().toLocaleString(locale, { timeZone: timezone }));
        const firstBusinessDay = getFirstBusinessDay(today.getFullYear(), today.getMonth());
        const isFirstBusinessDay =
            today.getFullYear() === firstBusinessDay.getFullYear() &&
            today.getMonth() === firstBusinessDay.getMonth() &&
            today.getDate() === firstBusinessDay.getDate();

        core.setOutput('is_first_business_day', isFirstBusinessDay.toString());
        core.setOutput('first_business_day', firstBusinessDay.toISOString());

        console.log(`Today: ${today.toDateString()}`);
        console.log(`First Business Day: ${firstBusinessDay.toDateString()}`);
        console.log(`Is today the first business day? ${isFirstBusinessDay}`);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        } else {
            core.setFailed("Unknown error");
        }
    }
}

// GitHub Action として実行された場合に run() を呼び出す
if (require.main === module) {
    run();
}
