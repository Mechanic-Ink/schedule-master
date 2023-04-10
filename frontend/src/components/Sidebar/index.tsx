import { useState, useEffect } from "react";
import List from "@mui/material/List";
import {
	Collapse,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
} from "@mui/material";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import PersonIcon from "@mui/icons-material/Person";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import Box from "@mui/system/Box";
import { useRecoilState, useResetRecoilState } from "recoil";


import useStartupEntries, { ActiveStartupEntry } from "app/atoms/StartupEntry";
import IStartupEntry from "app/atoms/StartupEntry/interface";
import StartupOptions, { useStartupOptions } from "app/atoms/StartupOptions";
import useFetchStartupItems from "app/util/actions/useFetchStartupItems";


const Sidebar: React.FC = () => {
	const { allEntries } = useStartupEntries();
	const { fetchStartupItems } = useFetchStartupItems();

	const [isOpenMachine, setIsOpenMachine] = useState(false);
	const [isOpenUser, setIsOpenUser] = useState(false);
	const [isOpenCustom, setIsOpenCustom] = useState(false);

	const [startupCustomEntries, _] = useState<IStartupEntry[]>([]);

	const [activeStartupEntry, setActiveStartupEntry] = useRecoilState(ActiveStartupEntry);

	const { setOption } = useStartupOptions();
	const resetOptions = useResetRecoilState(StartupOptions);


	function toggleOpen(key: string) {
		switch (key) {
			case "machine":
				setIsOpenMachine(!isOpenMachine);
				break;
			case "user":
				setIsOpenUser(!isOpenUser);
				break;
			case "custom":
				setIsOpenCustom(!isOpenCustom);
				break;
		}
	}

	function changeActiveStartupEntry(startupEntry: IStartupEntry) {
		setActiveStartupEntry(startupEntry);
		resetOptions();
		setOption('command', startupEntry.Command);
		console.log(startupEntry.Command);
	}

	useEffect(() => {
		fetchStartupItems();
	}, []);

	return (
		<List
			subheader={<ListSubheader>Startup Items</ListSubheader>}
			sx={{
				overflowX: "hidden",
				overflowY: "scroll",
				height: "90vh",
			}}
		>
			<ListItemButton onClick={() => toggleOpen("machine")}>
				<ListItemIcon>
					<DesktopWindowsIcon />
				</ListItemIcon>
				<ListItemText>
					All Users ({allEntries.filter((startupEntry) => {return startupEntry.Type === 'HKEY_LOCAL_MACHINE'}).length})
				</ListItemText>
			</ListItemButton>
			<Collapse in={isOpenMachine}>
				<List>
					{allEntries
						.filter((startupEntry) => {return startupEntry.Type === 'HKEY_LOCAL_MACHINE'})
						.map((startupEntry) => {
						return (
							<ListItemButton
								key={startupEntry.Id}
								onClick={() => {changeActiveStartupEntry(startupEntry);}}
								sx={{
									background: activeStartupEntry.Id === startupEntry.Id ? 'grey' : 'transparent',
								}}
							>
								<Box
									component="img"
									alt="icon"
									src={
										// "@assets/images/icons/" +
										"/src/assets/images/icons/" +
										startupEntry.Icon
									}
								/>
								&nbsp;
								{startupEntry.Name}
							</ListItemButton>
						);
					})}
				</List>
			</Collapse>
			<ListItemButton onClick={() => toggleOpen("user")}>
				<ListItemIcon>
					<PersonIcon />
				</ListItemIcon>
				<ListItemText>
					Current User ({allEntries.filter((startupEntry) => {return startupEntry.Type === 'HKEY_CURRENT_USER'}).length})
				</ListItemText>
			</ListItemButton>
			<Collapse in={isOpenUser}>
				<List>
					{allEntries
						.filter((startupEntry) => {return startupEntry.Type === 'HKEY_CURRENT_USER'})
						.map((startupEntry) => {
						return (
							<ListItemButton
								key={startupEntry.Id}
								onClick={() => {changeActiveStartupEntry(startupEntry);}}
							>
								<Box
									component="img"
									alt="icon"
									src={
										// "@assets/images/icons/" +
										"/src/assets/images/icons/" +
										startupEntry.Icon
									}
								/>
								&nbsp;
								{startupEntry.Name}
							</ListItemButton>
						);
					})}
				</List>
			</Collapse>
			<ListItemButton onClick={() => toggleOpen("custom")}>
				<ListItemIcon>
					<SettingsSuggestIcon />
				</ListItemIcon>
				<ListItemText>Scheduled ({startupCustomEntries.length})</ListItemText>
			</ListItemButton>
			<Collapse in={isOpenCustom}>
				<List>
					{startupCustomEntries.map((startupEntry) => {
						return (
							<ListItemButton>{startupEntry.Name}</ListItemButton>
						);
					})}
				</List>
			</Collapse>
		</List>
	);
};

export default Sidebar;