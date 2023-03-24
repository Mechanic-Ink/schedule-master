import { Card, CardContent, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

import IStartupSettings from "./interface";

const StartupSettings: React.FC<IStartupSettings> = ({options, setOptions}) => {

	return (
		<Card sx={{ m:0.5}}>
			<CardContent>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<FormLabel sx={{pb:1}}>Startup Settings:</FormLabel><br/><br/>
					</Grid>
					<Grid item xs={6}>
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
							<Grid item xs={6} sx={{px: 1}}>
								<FormControl fullWidth>
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<TimePicker
											value={options.startupTime}
											renderInput={(params) => <TextField sx={{maxWidth: '12rem'}} {...params} />}
											onChange={(e) => setOptions({startupTime: e ?? dayjs("2023-01-01T12:00")})}/>
									</LocalizationProvider>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<FormControlLabel
										control={
											<Checkbox checked={options.lateStartup} onChange={(e) => setOptions({lateStartup: e.target.checked})}/>
										}
										label="Skip if unable to start on schedule"
									/>
								</FormControl>
							</Grid>
						</>
					)}
					<Grid item xs={12}>
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
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}

export default StartupSettings;