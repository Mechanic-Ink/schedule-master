import { Button, Card, CardContent, Grid, styled } from "@mui/material";
import { useState } from "react";

import { BackupStartupItem, RemoveRegistryEntry } from "../../../wailsjs/go/main/App";
import ConfirmationDialog from "app/components/ConfirmationDialog";
import StartupOptions from "app/atoms/StartupOptions";
import IStartupOptions from "app/atoms/StartupOptions/interface";
import useStartupEntries, { ActiveStartupEntry } from "app/atoms/StartupEntry";
import { useRecoilState } from "recoil";

const MainActions: React.FC = () => {
	const [options] = useRecoilState<IStartupOptions>(StartupOptions);
	const [activeStartupEntry] = useRecoilState(ActiveStartupEntry);
	const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false);
	const {
		allEntries,
		// getEntry,
		// addEntry, 
		// setEntry,
		removeEntry, 
		// removeEntries 
	} = useStartupEntries();

	const CustomCardContent = styled(CardContent)(`
		&: last-child {
			padding-bottom: 0;
		}
	`);

	const removeRegistry = () => {
		if(options.backupRegistry)BackupStartupItem(activeStartupEntry.Id);
		// console.log("Backup registry is:", options.backupRegistry);
		RemoveRegistryEntry(activeStartupEntry.Id);
		// removeEntry(activeStartupEntry.Id);
		setRemoveDialogOpen(false);

	};

	const scheduleRegistry = () => {
		// console.log("Options", options);
		console.log(allEntries);
	};

	return (
		<>
			<Card sx={{ m:0.5}}>
				<CustomCardContent sx={{mb:0}}>
					<Grid container>
						<Grid item xs={8} sx={{px:0.5}}>
							<Button sx={{width: '100%'}} onClick={() => scheduleRegistry()} variant="contained">Schedule</Button>&nbsp;
						</Grid>
						<Grid item xs={4} sx={{px:0.5}}>
							<Button color="error" sx={{width: '100%'}} onClick={() => setRemoveDialogOpen(true)} variant="contained">Remove Registry</Button>
						</Grid>
					</Grid>
				</CustomCardContent>
			</Card>
			<ConfirmationDialog
				isOpen={removeDialogOpen}
				title="Are you sure you want to remove this registry item?"
				message="If you have ticked the 'Backup Registry' checbox above, a copy will be saved onto the hard drive."
				onConfirm={removeRegistry}
				onCancel={() => setRemoveDialogOpen(false)}
			/>
		</>
	);
}

export default MainActions;