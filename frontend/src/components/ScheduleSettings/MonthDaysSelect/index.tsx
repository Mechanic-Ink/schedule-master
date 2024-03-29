import TextField from "@mui/material/TextField";
import MonthDays from "app/util/enums/MonthDays";

import StartupOptions, { useStartupOptions } from "app/atoms/StartupOptions";
import { monthDaysMap } from "app/util/enums/MonthDays";
import MenuItem from "@mui/material/MenuItem";
import { useRecoilState } from "recoil";
import IStartupOptions from "app/atoms/StartupOptions/interface";
import { Checkbox, Divider, FormControlLabel, FormGroup } from "@mui/material";

const MonthDaysSelect: React.FC = () => {
	const [options, _] = useRecoilState<IStartupOptions>(StartupOptions);
	const { setOption } = useStartupOptions();

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		const selected = event.target.value as MonthDays[];

		let days = 0;
		selected.forEach((day) => {
			days |= day;
		});

		const toggleDay = days ^ options.MonthDayStartupDays;

		toggleMonthDay(toggleDay);
	};

	const toggleMonthDay = (monthDay: MonthDays) => {
		setOption('MonthDayStartupDays', (options.MonthDayStartupDays ^ monthDay))
	};

	const isSelected = (day: MonthDays): boolean => {
		return (options.MonthDayStartupDays & day) === day;
	}

	return (
		<>
			<TextField select
				label="Select days"
				value={Object.keys(monthDaysMap)
					.map((key) => parseInt(key))
					.filter(isSelected)}
				onChange={handleChange}
				SelectProps={{
					multiple: true,
					renderValue: (selected) => {
						return (selected as MonthDays[])
							.map((day) => monthDaysMap[day])
							.join(", ");
					},
				}}
			>
				{Object.entries(monthDaysMap).map(([key, value]) => (
					<MenuItem key={key} value={parseInt(key)}>
						{value}
					</MenuItem>
				))}
			</TextField>
			<FormGroup row>
				<FormControlLabel 
					control={<Checkbox onChange={(e) => setOption('MonthDayStartupDaysLast', !options.MonthDayStartupDaysLast)}/>}
					label="Last"
					labelPlacement="end"
				/>
				<FormControlLabel 
					control={<Checkbox onChange={(e) => setOption('MonthDayStartupDaysSecondLast', !options.MonthDayStartupDaysSecondLast)}/>}
					label="Second last"
					labelPlacement="end"
				/>
			</FormGroup>
			<Divider />
		</>
	);
}

export default MonthDaysSelect;