import { Card, CardContent, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Radio } from "@mui/material";
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
		setOption('WeekDayStartupDays', (options.WeekDayStartupDays ^ weekDay));
	};

	const toggleRunType = (type: string) => {
		switch (type) {
			case "weekdays":
				setOption('WeekDayStartup', true)
				setOption('MonthDayStartup', false)
				setOption('CalendarStartup', false)
			break;

			case "monthdays":
				setOption('WeekDayStartup', false)
				setOption('MonthDayStartup', true)
				setOption('CalendarStartup', false)
			break;

			case "dates":
				setOption('WeekDayStartup', false)
				setOption('MonthDayStartup', false)
				setOption('CalendarStartup', true)
			break;
		}
	}

	return (
		<Card sx={{ m:0.5, mb:0}}>
			<CardContent>
				<Grid container>
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
						<FormLabel>Scheduling Settings:</FormLabel>
						<FormControlLabel
							control={<Radio checked={options.WeekDayStartup} onChange={(e) => toggleRunType("weekdays")}/>}
							label="Run on specific week days"
						/>
						{options.WeekDayStartup &&
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
						control={<Radio checked={options.MonthDayStartup} onChange={(e) => toggleRunType("monthdays")}/>}
							label="Run on specific days of the month"
						/>
						{options.MonthDayStartup && <MonthDaysSelect /> }

						<FormControlLabel
							control={<Radio checked={options.CalendarStartup} onChange={(e) => toggleRunType("dates")}/>}
							label="Run on specified dates"
						/>
						{options.CalendarStartup && <MultiDateSelect/>}
					</Grid>
{/*					<Grid item xs={12}>
						{(options.WeekDayStartup || options.MonthDayStartup || options.CalendarStartup) &&
							<>
								<Divider />
								<br/>
								<FormLabel>Automatically close the app if:</FormLabel>
								<FormControlLabel
									control={<Checkbox onChange={(e) => setOption('CalendarShutdown', e.target.checked)}/>}
									label="It runs during days/dates that it is not scheduled"
								/>
								{options.TimedShutdown &&
									<FormControlLabel
										control={<Checkbox onChange={(e) => setOption('TimedShutdown', e.target.checked)}/>}
										label="It runs outside of the time range specified"
									/>
								}
							</>
						}
					</Grid>*/}
				</Grid>
			</CardContent>
		</Card>
	);
}

export default ScheduleSettings;