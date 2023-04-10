import { Card, CardContent, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid } from "@mui/material";
import IStartupOptions from "app/atoms/StartupOptions/interface";
import { useRecoilState } from "recoil";

import MultiDateSelect from "./MultiDateSelect"
import StartupOptions, { useStartupOptions } from "app/atoms/StartupOptions";
import WeekDays from "../../util/enums/WeekDays";
import MonthDaysSelect from './MonthDaysSelect';

const ScheduleSettings: React.FC = () => {
	const [options, _] = useRecoilState<IStartupOptions>(StartupOptions);
	const { setOption } = useStartupOptions();

	const toggleStartupDay = (weekDay: WeekDays) => {
		setOption('weekDayStartupDays', (options.weekDayStartupDays ^ weekDay));
	};

	return (
		<Card sx={{ m:0.5}}>
			<CardContent>
				<Grid container>
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
						<FormLabel>Scheduling Settings:</FormLabel>
						<FormControlLabel
							control={<Checkbox onChange={(e) => setOption('weekDayStartup', e.target.checked)}/>}
							label="Run on specific week days"
						/>
						{options.weekDayStartup &&
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
							control={<Checkbox onChange={(e) => setOption('monthDayStartup', e.target.checked)}/>}
							label="Run on specific days of the month"
						/>
						{options.monthDayStartup && <MonthDaysSelect /> }

						<FormControlLabel
							control={<Checkbox onChange={(e) => setOption('calendarStartup', e.target.checked)}/>}
							label="Run on specified dates"
						/>
						{options.calendarStartup && <MultiDateSelect/>}

						{(options.weekDayStartup || options.monthDayStartup || options.calendarStartup) &&
							<>
								<br/>
								<FormLabel>Automatically close the app if:</FormLabel>
								<FormControlLabel
									control={<Checkbox onChange={(e) => setOption('calendarShutdown', e.target.checked)}/>}
									label="It runs during days/dates that it is not scheduled"
								/>
								{options.timedShutdown &&
									<FormControlLabel
										control={<Checkbox onChange={(e) => setOption('timedShutdown', e.target.checked)}/>}
										label="It runs outside of the time range specified"
									/>
								}
							</>
						}
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}

export default ScheduleSettings;