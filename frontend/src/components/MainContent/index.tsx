import {
	Button,
	Card,
	CardContent,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	InputLabel,
	Link,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useReducer } from "react";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Grid from "@mui/material/Unstable_Grid2";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useEntries } from "../StartupEntry/context";
import { StartupEntry } from "../StartupEntry/interface";
import { ShowExecutableLocation } from "../../../wailsjs/go/main/App";
// import * as wails from "wails";

interface IMainContent {
	activeStartupItem: StartupEntry | undefined;
}

interface IStartupOptions {
	startupType:			number;
	startupTime:			Dayjs;
	timedShutdown:			boolean;
	timedShutdownTime:		Dayjs;
	timedReopen:			boolean;
	timedClose:				boolean;
	clockClosing:			boolean;
	lateStartup:			boolean;
	weekDayStartup:			boolean;
	weekDayStartupDays:		number;
	monthDayStartup:		boolean;
	monthDayStartupDays:	number;
	calendarStartup:		boolean;
	calendarStartupDays:	Dayjs[];
	calendarClosing:		boolean;
}

enum Weekdays {
	Monday		= 1,
	Tuesday		= 2,
	Wednesday	= 4,
	Thursday	= 8,
	Friday		= 16,
	Saturday	= 32,
	Sunday		= 64
}

enum MonthDays {
	Day1 = 1,
	Day2 = 2,
	Day3 = 4,
	Day4 = 8,
	Day5 = 16,
	Day6 = 32,
	Day7 = 64,
	Day8 = 128,
	Day9 = 256,
	Day10 = 512,
	Day11 = 1024,
	Day12 = 2048,
	Day13 = 4096,
	Day14 = 8192,
	Day15 = 16384,
	Day16 = 32768,
	Day17 = 65536,
	Day18 = 131072,
	Day19 = 262144,
	Day20 = 524288,
	Day21 = 1048576,
	Day22 = 2097152,
	Day23 = 4194304,
	Day24 = 8388608,
	Day25 = 16777216,
	Day26 = 33554432,
	Day27 = 67108864,
	Day28 = 134217728,
	Day29 = 268435456,
	Day30 = 536870912,
	Day31 = 1073741824
}

const MainContent: React.FC<IMainContent> = ({ activeStartupItem }) => {
	const { entries, setEntries } = useEntries();

	const [options, setOptions] = useReducer(
		(previous: IStartupOptions, next:Partial<IStartupOptions>) => {
			return { ...previous, ...next } as IStartupOptions;
	},
	{
		startupType: 0,
		startupTime: dayjs("2023-01-01T12:00"),
		timedShutdown: false,
		timedShutdownTime: dayjs("2023-01-01T12:00"),
		timedReopen: false,
		timedClose: false,
		clockClosing: false,
		lateStartup: false,
		weekDayStartup: false,
		weekDayStartupDays: 0,
		monthDayStartup: false,
		monthDayStartupDays: 0,
		calendarStartup: false,
		calendarStartupDays: [dayjs("")],
		calendarClosing: false,
	},
	);

	const findDateIndex = (dates: Dayjs[], date: Dayjs) => {
		const timestamp = date.unix();
		return dates.findIndex((item) => item.unix() === timestamp);
	}

	const toggleStartupDay = (weekday: Weekdays) => {
		setOptions({weekDayStartupDays: (options.weekDayStartupDays ^ weekday)});
	};

	return (
		<>
			{activeStartupItem ? (
				<>
					<Card sx={{ overflowWrap: "break-word" }}>
						<CardContent>
							<Typography>
								<strong>Name</strong>: {activeStartupItem.Name}
								<br />
								<strong>Command</strong>:
								{activeStartupItem.Command}&nbsp;
								<span title="Edit Command">
									<EditIcon
										sx={{
											width: "0.6m",
											height: "0.6em",
											cursor: "pointer",
										}}
									/>
								</span>
								<br />
								<strong>Registry</strong>:
								{activeStartupItem.Type}\
								{activeStartupItem.Registry}
								<br />
								<strong>File</strong>:
								<Link
									href="#"
									onClick={() =>
										ShowExecutableLocation(
											activeStartupItem.File
										)
									}
									color="inherit"
									title="Open File Location"
								>
									{activeStartupItem.File}
								</Link>
							</Typography>
							<FormControl>
								<FormControlLabel
									control={
										<Checkbox onChange={(e) => setOptions({})}/>
									}
									label="Backup Registry"
								/>
							</FormControl>
						</CardContent>
					</Card>
					<br />
					<Card>
						<CardContent>
							<Button variant="contained">Schedule</Button>&nbsp;
							<Button onClick={() => console.log(options.weekDayStartupDays)} variant="contained">Remove Registry</Button>
						</CardContent>
					</Card>
					<br />
					<Card>
						<CardContent>
							<Grid container>
								<Grid xs={12} sm={12} md={12} lg={12} xl={12}>
									<FormControl>
										<InputLabel id="startup-type-label">When to run</InputLabel>
										<Select
											labelId="startup-type-label"
											defaultValue="0"
											label="When to run"
											onChange={(e) => setOptions({startupType: Number(e.target.value)})}
										>
											<MenuItem value={0}>Startup</MenuItem>
											<MenuItem value={1}>Log on</MenuItem>
											<MenuItem value={2}>Scheduled</MenuItem>
										</Select>


										{(options.startupType == 2) && (
											<>
												<LocalizationProvider dateAdapter={AdapterDayjs}>
													<TimePicker
														value={options.startupTime}
														renderInput={(params) => <TextField sx={{maxWidth: '12rem'}} {...params} />}
														onChange={(e) => setOptions({startupTime: e ?? dayjs("2023-01-01T12:00")})}/>
												</LocalizationProvider>
												<FormControlLabel
													control={
														<Checkbox onChange={(e) => setOptions({lateStartup: e.target.checked})}/>
													}
													label="Do not run if log on happens after this time"
												/>
											</>
										)}

										<FormControlLabel
											control={
												<Checkbox onChange={(e) => setOptions({timedShutdown: e.target.checked})}/>
											}
											label="Close at a specified time"
										/>

										{(options.timedShutdown)?
											<LocalizationProvider dateAdapter={AdapterDayjs}>
												<TimePicker
													value={options.timedShutdownTime}
													renderInput={(params) => <TextField sx={{maxWidth: '12rem'}} {...params} />}
													onChange={(e) => setOptions({timedShutdownTime: e ?? dayjs("2023-01-01T12:00")})}/>
											</LocalizationProvider>
											: ''
										}
										{(options.startupType == 1 && options.timedShutdown)?
											<>
												<FormControlLabel
													control={<Checkbox onChange={(e) => setOptions({timedReopen: e.target.checked})}/>}
													label="Always reopen the app before close time"
												/>
												<FormControlLabel
													control={<Checkbox onChange={(e) => setOptions({timedClose: e.target.checked})}/>}
													label="Always close the app after close time"
												/>
											</>
											: ''
										}
									</FormControl>
								</Grid>
							</Grid>
						</CardContent>
					</Card><br/>
					<Card>
						<CardContent>
							<Grid container>
								<Grid xs={12} sm={12} md={12} lg={12} xl={12}>
									<FormControl>
										<FormLabel>Scheduling Options:</FormLabel>
										<FormControlLabel
											control={<Checkbox onChange={(e) => setOptions({weekDayStartup: e.target.checked})}/>}
											label="Run on specific week days"
										/>
										{(options.weekDayStartup)?
											<>
												<FormGroup row>
													<FormControlLabel
														sx={{marginLeft:'8px', marginRight: '2px'}}
														control={<Checkbox onChange={(e) => toggleStartupDay(Weekdays.Monday)}/>}
														label="Mon"
														title="Monday"
														labelPlacement="top"
													/>
													<FormControlLabel
														sx={{marginLeft:'8px', marginRight: '2px'}}
														control={<Checkbox onChange={(e) => toggleStartupDay(Weekdays.Tuesday)}/>}
														label="Tue"
														title="Tuesday"
														labelPlacement="top"
													/>
													<FormControlLabel
														sx={{marginLeft:'8px', marginRight: '2px'}}
														control={<Checkbox onChange={(e) => toggleStartupDay(Weekdays.Wednesday)}/>}
														label="Wed"
														title="Wednesday"
														labelPlacement="top"
													/>
													<FormControlLabel
														sx={{marginLeft:'8px', marginRight: '2px'}}
														control={<Checkbox onChange={(e) => toggleStartupDay(Weekdays.Thursday)}/>}
														label="Thu"
														title="Thursday"
														labelPlacement="top"
													/>
													<FormControlLabel
														sx={{marginLeft:'8px', marginRight: '2px'}}
														control={<Checkbox onChange={(e) => toggleStartupDay(Weekdays.Friday)}/>}
														label="Fri"
														title="Friday"
														labelPlacement="top"
													/>
													<FormControlLabel
														sx={{marginLeft:'8px', marginRight: '2px'}}
														control={<Checkbox onChange={(e) => toggleStartupDay(Weekdays.Saturday)}/>}
														label="Sat"
														title="Saturday"
														labelPlacement="top"
													/>
													<FormControlLabel
														sx={{marginLeft:'8px', marginRight: '2px'}}
														control={<Checkbox onChange={(e) => toggleStartupDay(Weekdays.Sunday)}/>}
														label="Sun"
														title="Sunday"
														labelPlacement="top"
													/>
												</FormGroup>
											</>
											: ''
										}
										<FormControlLabel
											control={<Checkbox onChange={(e) => setOptions({monthDayStartup: e.target.checked})}/>}
											label="Run on specific days of the month"
										/>
										<FormControlLabel
											control={<Checkbox onChange={(e) => setOptions({calendarStartup: e.target.checked})}/>}
											label="Run on specified dates"
										/>
										{(options.calendarStartup)?
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
														console.log(date);

														const index = findDateIndex(days, date);
														if(index >= 0) days.splice(index, 1);
														else days.push(date);

														setOptions({calendarStartupDays: days});
													}}
												/>
											</LocalizationProvider>
											: ''
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
					</Card><br/>
				</>
			) : (
				<div>Please select a startup Item.</div>
			)}
		</>
	);
};

export default MainContent;