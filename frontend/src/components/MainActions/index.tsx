import { Button, Card, CardContent, Grid, styled } from "@mui/material";
import { useState } from "react";

import { BackupStartupItem, FetchScheduledItems, RemoveRegistryEntry, ScheduleRegistryEntry } from "../../../wailsjs/go/main/App";
import ConfirmationDialog from "app/components/ConfirmationDialog";
import StartupOptions from "app/atoms/StartupOptions";
import IStartupOptions from "app/atoms/StartupOptions/interface";
import useStartupEntries, { ActiveStartupEntry } from "app/atoms/StartupEntry";
import { useRecoilState, useResetRecoilState } from "recoil";
import { useLoading } from "../LoadingProvider";

const MainActions: React.FC = () => {
	const { showLoading, hideLoading } = useLoading();
	const [options] = useRecoilState<IStartupOptions>(StartupOptions);
	const [activeStartupEntry] = useRecoilState(ActiveStartupEntry);
	const resetActiveStartupEntry = useResetRecoilState(ActiveStartupEntry);
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

	function backupStartupItem(id:number) {
		return new Promise((resolve, reject) => {
			BackupStartupItem(id)
				.then((result) => {resolve(result);})
				.catch((error) => {reject(error);})
		});
	}

	function removeRegistryEntry(id:number) {
		return new Promise((resolve, reject) => {
			RemoveRegistryEntry(id)
				.then((result) => {resolve(result);})
				.catch((error) => {reject(error);})
		});
	}

	const removeRegistry = async () => {
		showLoading();
		try {
			if(options.BackupRegistry)await backupStartupItem(activeStartupEntry.Id);

			await removeRegistryEntry(activeStartupEntry.Id);

			removeEntry(activeStartupEntry.Id);
			resetActiveStartupEntry();
			setRemoveDialogOpen(false);
		} catch (error) {
			console.error("An error ocurred:", error);
		} finally {
			hideLoading();
		}
	};

	const scheduleRegistry = async () => {
		// FetchScheduledItems(false);
		// return;
		// // console.log("Options", options);
		// console.log(allEntries);
		showLoading();

		ScheduleRegistryEntry(activeStartupEntry, options);
		if(options.BackupRegistry)await backupStartupItem(activeStartupEntry.Id);
		if(!options.KeepRegistry)await removeRegistryEntry(activeStartupEntry.Id);
		hideLoading();
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
							<Button color="error" sx={{width: '100%'}} onClick={() => setRemoveDialogOpen(true)} variant="contained">Delete</Button>
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