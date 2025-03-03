import { getFirstBusinessDay } from '../src/index';
import * as core from '@actions/core';

describe('getFirstBusinessDay', () => {
    beforeEach(() => {
        jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
            if (name === 'country') return 'JP';
            return '';
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return the 1st if it is a weekday and not a holiday', () => {
        // 2023年3月1日は水曜日で、祝日ではない
        const date = getFirstBusinessDay(2023, 2); // 2は3月
        expect(date.getDate()).toBe(1);
    });

    it('should skip weekend days', () => {
        // 2022年5月1日は日曜日なので、翌営業日（5月2日月曜）を返す
        const date = getFirstBusinessDay(2022, 4); // 4は5月
        expect(date.getDay()).toBe(1); // 月曜日は 1
        expect(date.getDate()).toBe(2);
    });

    it('should skip Japanese holidays', () => {
        // 2023年1月1日は日曜日（元日）
        // 1月2日は振替休日
        // よって最初の営業日は1月4日（水曜日）
        const date = getFirstBusinessDay(2023, 0); // 0は1月
        expect(date.getDate()).toBe(4);
        expect(date.getDay()).toBe(3); // 水曜日は 3
    });
});
