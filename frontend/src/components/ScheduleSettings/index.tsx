import { Card, CardContent, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import WeekDays from "../../util/enums/WeekDays";
import IScheduleSettings from "./interface";

const ScheduleSettings: React.FC<IScheduleSettings> = ({options, setOptions}) => {

	const findDateIndex = (dates: Dayjs[], date: Dayjs) => {
		const timestamp = date.unix();
		return dates.findIndex((item) => item.unix() === timestamp);
	}

	const toggleStartupDay = (weekday: WeekDays) => {
		setOptions({weekDayStartupDays: (options.weekDayStartupDays ^ weekday)});
	};

	return (
		<Card sx={{ m:0.5}}>
			<CardContent>
				<Grid container>
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
						<FormControl>
							<FormLabel>Scheduling Settings:</FormLabel>
							<FormControlLabel
								control={<Checkbox onChange={(e) => setOptions({weekDayStartup: e.target.checked})}/>}
								label="Run on specific week days"
							/>
							{(options.weekDayStartup) &&
								<>
									<FormGroup row>
										<FormControlLabel
											sx={{marginLeft:'3px', marginRight: '2px'}}
											control={<Checkbox onChange={(e) => toggleStartupDay(WeekDays.Monday)}/>}
											label="Mon"
											title="Monday"
											labelPlacement="top"
										/>
										<FormControlLabel
											sx={{marginLeft:'3px', marginRight: '2px'}}
											control={<Checkbox onChange={(e) => toggleStartupDay(WeekDays.Tuesday)}/>}
											label="Tue"
											title="Tuesday"
											labelPlacement="top"
										/>
										<FormControlLabel
											sx={{marginLeft:'3px', marginRight: '2px'}}
											control={<Checkbox onChange={(e) => toggleStartupDay(WeekDays.Wednesday)}/>}
											label="Wed"
											title="Wednesday"
											labelPlacement="top"
										/>
										<FormControlLabel
											sx={{marginLeft:'3px', marginRight: '2px'}}
											control={<Checkbox onChange={(e) => toggleStartupDay(WeekDays.Thursday)}/>}
											label="Thu"
											title="Thursday"
											labelPlacement="top"
										/>
										<FormControlLabel
											sx={{marginLeft:'3px', marginRight: '2px'}}
											control={<Checkbox onChange={(e) => toggleStartupDay(WeekDays.Friday)}/>}
											label="Fri"
											title="Friday"
											labelPlacement="top"
										/>
										<FormControlLabel
											sx={{marginLeft:'3px', marginRight: '2px'}}
											control={<Checkbox onChange={(e) => toggleStartupDay(WeekDays.Saturday)}/>}
											label="Sat"
											title="Saturday"
											labelPlacement="top"
										/>
										<FormControlLabel
											sx={{marginLeft:'3px', marginRight: '2px'}}
											control={<Checkbox onChange={(e) => toggleStartupDay(WeekDays.Sunday)}/>}
											label="Sun"
											title="Sunday"
											labelPlacement="top"
										/>
									</FormGroup>
									<Divider />
								</>
							}
							<FormControlLabel
								control={<Checkbox onChange={(e) => setOptions({monthDayStartup: e.target.checked})}/>}
								label="Run on specific days of the month"
							/>
							<FormControlLabel
								control={<Checkbox onChange={(e) => setOptions({calendarStartup: e.target.checked})}/>}
								label="Run on specified dates"
							/>
							{(options.calendarStartup) &&
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<StaticDatePicker
										// format="MM/DD/YYYY"
										label="Select dates"
										// value={options.calendarStartupDays}
										value={dayjs("")}
										renderInput={(params) => <TextField {...params} />}
										onChange={(choice) => {
											if(choice == null) return;

											const days = [...options.calendarStartupDays];
											const date = choice.startOf('day');
											// console.log(date);

											const index = findDateIndex(days, date);
											if(index >= 0) days.splice(index, 1);
											else days.push(date);

											setOptions({calendarStartupDays: days});
										}}
									/>
								</LocalizationProvider>
							}
							<FormLabel>Automatically close the app if:</FormLabel>
							<FormControlLabel
								control={<Checkbox onChange={(e) => setOptions({calendarClosing: e.target.checked})}/>}
								label="It runs during days/dates that it is not scheduled"
							/>
							<FormControlLabel
								control={<Checkbox onChange={(e) => setOptions({clockClosing: e.target.checked})}/>}
								label="It runs outside of the time range specified"
							/>
						</FormControl>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}

export default ScheduleSettings;