import {
	Button,
	Card,
	CardContent,
	Checkbox,
	Divider,
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

import { useReducer, useState } from "react";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Grid from "@mui/material/Unstable_Grid2";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// import { ShowExecutableLocation } from "go/App";



import StartupItem from "../StartupItem";
// import { useEntries } from "app/components/StartupEntry/context";
import { useEntries } from "../../util/contexts/StartupEntry/context";
import StartupOptions from "app/util/interfaces/IStartupOptions";
import IMainContent from "./interface";
// import WeekDays from "app/util/enums/WeekDays";
import WeekDays from "../../util/enums/WeekDays";
// import MonthDays from "app/util/enums/MonthDays";


const MainContent: React.FC<IMainContent> = ({ activeStartupItem }) => {
	const { entries, setEntries } = useEntries();

	const [backupRegistry, setBackupRegistry] = useState<boolean>(true);

	const [options, setOptions] = useReducer(
		(previous: StartupOptions, next:Partial<StartupOptions>) => {
			return { ...previous, ...next } as StartupOptions;
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

	const toggleStartupDay = (weekday: WeekDays) => {
		setOptions({weekDayStartupDays: (options.weekDayStartupDays ^ weekday)});
	};

	const removeRegistry = () => {
		//If backupRegistry is true
		//Create a copy of the registry
		//and delete registry
	};

	return (
		<>
			{activeStartupItem ? (
				<>
					<StartupItem
						item={activeStartupItem}
						backupRegistry={backupRegistry}
						setBackupRegistry={setBackupRegistry}
					/>
					<br />
					<Grid container spacing={1}>
						<Grid xs={12}>
							<Card>
								<CardContent>
									<Grid container>
										<Grid xs={8}>
											<Button sx={{width: '100%'}} variant="contained">Schedule</Button>&nbsp;
										</Grid>
										<Grid xs={4}>
											<Button color="error" sx={{width: '100%'}} onClick={() => removeRegistry()} variant="contained">Remove Registry</Button>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
						<Grid xs={6}>
							<Card>
								<CardContent>
									<Grid container>
										<Grid xs={12} sm={12} md={12} lg={12} xl={12}>
											<FormControl>

												<Grid container spacing={1}>

													<Grid xs={6}>
														<FormControl fullWidth>
															<InputLabel id="startup-type-label">When to run</InputLabel>
															<Select
																labelId="startup-type-label"
																value={options.startupType}
																label="When to run"
																onChange={(e) => setOptions({startupType: Number(e.target.value)})}
															>
																<MenuItem value={0}>Startup</MenuItem>
																<MenuItem value={1}>Log on</MenuItem>
																<MenuItem value={2}>Scheduled</MenuItem>
															</Select>
														</FormControl>
													</Grid>

													{(options.startupType == 2) && (
														<>
															<Grid xs={6}>
																<FormControl fullWidth>
																	<LocalizationProvider dateAdapter={AdapterDayjs}>
																		<TimePicker
																			value={options.startupTime}
																			renderInput={(params) => <TextField sx={{maxWidth: '12rem'}} {...params} />}
																			onChange={(e) => setOptions({startupTime: e ?? dayjs("2023-01-01T12:00")})}/>
																	</LocalizationProvider>
																</FormControl>
															</Grid>
															<Grid xs={12}>
																<FormControlLabel
																	control={
																		<Checkbox checked={options.lateStartup} onChange={(e) => setOptions({lateStartup: e.target.checked})}/>
																	}
																	label="Skip if unable to start on schedule"
																/>
															</Grid>
														</>
													)}
												</Grid>

												<FormControlLabel
													control={
														<Checkbox checked={options.timedShutdown} onChange={(e) => setOptions({timedShutdown: e.target.checked})}/>
													}
													label="Close at a specified time"
												/>

												{(options.timedShutdown)?
													<>
														<LocalizationProvider dateAdapter={AdapterDayjs}>
															<TimePicker
																value={options.timedShutdownTime}
																renderInput={(params) => <TextField sx={{maxWidth: '12rem'}} {...params} />}
																onChange={(e) => setOptions({timedShutdownTime: e ?? dayjs("2023-01-01T12:00")})}/>
														</LocalizationProvider>
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
							</Card>
						</Grid>
						<Grid xs={6}>
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
							</Card>
						</Grid>
					</Grid>
				</>
			) : (
				<div>Please select a startup Item.</div>
			)}
		</>
	);
};

export default MainContent;


/*
					// <Card sx={{ overflowWrap: "break-word" }}>
					// 	<CardContent>
					// 		<Typography>
					// 			<strong>Name</strong>: {activeStartupItem.Name}
					// 			<br />
					// 			<strong>Command</strong>:
					// 			{activeStartupItem.Command}&nbsp;
					// 			<span title="Edit Command">
					// 				<EditIcon
					// 					sx={{
					// 						width: "0.6m",
					// 						height: "0.6em",
					// 						cursor: "pointer",
					// 					}}
					// 				/>
					// 			</span>
					// 			<br />
					// 			<strong>Registry</strong>:
					// 			{activeStartupItem.Type}\
					// 			{activeStartupItem.Registry}
					// 			<br />
					// 			<strong>File</strong>:
					// 			<Link
					// 				href="#"
					// 				onClick={() =>
					// 					ShowExecutableLocation(
					// 						activeStartupItem.File
					// 					)
					// 				}
					// 				color="inherit"
					// 				title="Open File Location"
					// 			>
					// 				{activeStartupItem.File}
					// 			</Link>
					// 		</Typography>
					// 		<FormControl>
					// 			<FormControlLabel
					// 				control={
					// 					<Checkbox checked={backupRegistry} onChange={(e) => setBackupRegistry(!backupRegistry)}/>
					// 				}
					// 				label="Backup Registry"
					// 			/>
					// 		</FormControl>
					// 	</CardContent>
					// </Card>

*/