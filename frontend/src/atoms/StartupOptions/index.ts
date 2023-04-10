import dayjs from 'app/util/dayjs.config';
import { atom, useSetRecoilState } from 'recoil';

import IStartupOptions from "./interface";

const StartupOptions = atom<IStartupOptions>({
	key: 'ActiveStartupEntryOptions',
	default: {
		backupRegistry: false,
		calendarShutdown: false,
		calendarStartup: false,
		calendarStartupDates: [],
		command: '',
		lateStartup: false,
		monthDayStartup: false,
		monthDayStartupDays: 0,
		monthDayStartupDaysLast: false,
		monthDayStartupDaysSecondLast: false,
		startupTime: dayjs("2023-01-01T12:00"),
		startupType: 0,
		timedClose: false,
		timedReopen: false,
		timedShutdown: false,
		timedShutdownTime: dayjs("2023-01-01T12:00"),
		weekDayStartup: false,
		weekDayStartupDays: 0,
	}
});

export default StartupOptions;

export function useStartupOptions() {
	const setOptions = useSetRecoilState(StartupOptions);

	const setOption = (key: keyof IStartupOptions, value: any) => {
		setOptions((previousOptions) => ({
			...previousOptions,
			[key]: value
		}));
	};

	return { setOption };
}




// export const [options, setOptions] = useReducer(
// 	(previous: StartupOptions, next:Partial<StartupOptions>) => {
// 		return { ...previous, ...next } as StartupOptions;
// 	},
// 	{
// 		startupType: 0,
// 		startupTime: dayjs("2023-01-01T12:00"),
// 		timedShutdown: false,
// 		timedShutdownTime: dayjs("2023-01-01T12:00"),
// 		timedReopen: false,
// 		timedClose: false,
// 		lateStartup: false,
// 		weekDayStartup: false,
// 		weekDayStartupDays: 0,
// 		monthDayStartup: false,
// 		monthDayStartupDays: 0,
// 		calendarStartup: false,
// 		calendarStartupDays: [dayjs("")],
// 		calendarClosing: false,
// 	},
// );