import { useReducer, useState, useContext } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import dayjs from "dayjs";

// import { ShowExecutableLocation } from "go/App";

import StartupItemDetails from "../StartupItemDetails";
import MainActions from "../MainActions";
import StartupOptions from "app/util/interfaces/IStartupOptions";
import IMainContent from "./interface";
import StartupSettings from "../StartupSettings";
import ScheduleSettings from "../ScheduleSettings";
// import IStartupEntry from "app/util/interfaces/IStartupEntry";
// import { StartupItemContext } from "app/util/contexts/StartupItem/context";
// import {activeStartupEntry, setActiveStartupEntry } from "app/objects/ActiveStartupEntry";

// import StartupEntries from 'app/atoms/StartupEntry';
// import { useRecoilValue, useRecoilState } from "recoil"
import { ActiveStartupEntry } from "app/atoms/StartupEntry";
import { useRecoilState } from "recoil";


const MainContent: React.FC<IMainContent> = ({ activeStartupItem }) => {
	const [backupRegistry, setBackupRegistry] = useState<boolean>(true);
	const [activeStartupEntry, setActiveStartupEntry] = useRecoilState(ActiveStartupEntry);

	// const { activeItem, updateActiveItem } = useContext(StartupItemContext);

	// console.log("AYYY");
	// console.log(activeStartupEntry);
	// activeStartupEntry.Name = activeStartupItem?.Name ?? 'Na';
	// console.log(startupEntry.Name);

	// console.log("ACTIVE ITEM");
	// console.log(activeItem);
	// updateActiveItem({prop: "Name", payload: "Testing"});
	// console.log(activeItem);

	// const startupEntry = useRecoilValue(StartupEntry);

	// console.log("STARTUP ENTREEEE");




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

	return (
		<>
			{activeStartupEntry.Id !== 0 ? (
				<>
					<Grid container>
						<Grid xs={12}>
							<StartupItemDetails
								item={activeStartupEntry}
								backupRegistry={backupRegistry}
								setBackupRegistry={setBackupRegistry}
							/>
						</Grid>
						<Grid xs={12}>
							<MainActions backupRegistry={backupRegistry}/>
						</Grid>
						<Grid xs={6}>
							<StartupSettings options={options} setOptions={setOptions}/>
						</Grid>
						<Grid xs={6}>
							<ScheduleSettings options={options} setOptions={setOptions}/>
						</Grid>
					</Grid>
				</>
			) : (
				<div>Please select a startup Item. {activeStartupEntry.Id}</div>
			)}
		</>
	);
};

export default MainContent;