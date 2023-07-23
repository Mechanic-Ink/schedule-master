import { Button, Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, Link, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

import { ShowExecutableLocation } from "../../../wailsjs/go/main/App";

import { useRecoilState } from "recoil";
import IStartupOptions from "app/atoms/StartupOptions/interface";
import StartupOptions, { useStartupOptions } from "app/atoms/StartupOptions";
import { ActiveStartupEntry } from "app/atoms/StartupEntry";

const StartupItemDetails: React.FC = () => {
	const [options] = useRecoilState<IStartupOptions>(StartupOptions);
	const { setOption } = useStartupOptions();
	const [editCommandOpen, setEditCommandOpen] = useState(false);
	const [activeStartupEntry] = useRecoilState(ActiveStartupEntry);

	const editItemCommand = () => {
		const newCommand = (document.getElementById('editCommandField') as HTMLInputElement).value;

		setOption('Command', newCommand);

		setEditCommandOpen(false);
	}

	return (
		<>
			<Dialog open={editCommandOpen} onClose={() => setEditCommandOpen(false)} fullWidth maxWidth="sm" >
				<DialogTitle>Edit Command</DialogTitle>
				<DialogContent>
					<TextField id="editCommandField" label="Command to execute" variant="standard" defaultValue={options.Command || ''} fullWidth/>
				</DialogContent>
				<DialogActions>
					<Button color="error" onClick={() => setEditCommandOpen(false)}>Cancel</Button>
					<Button onClick={editItemCommand}>Save</Button>
				</DialogActions>
			</Dialog>
			<Card sx={{ overflowWrap: "break-word", m:0.5}}>
				<CardContent>
					<Typography>
						<strong>Name</strong>:&nbsp;{activeStartupEntry.Name}
						<br />
						<strong>Command</strong>:&nbsp;
						{options.Command}&nbsp;
						<span title="Edit Command" onClick={() => setEditCommandOpen(true)}>
							<EditIcon
								sx={{
									width: "0.6m",
									height: "0.6em",
									cursor: "pointer",
								}}
							/>
						</span>
						<br />
						<strong>Registry</strong>:&nbsp;
						{activeStartupEntry.Type}\
						{activeStartupEntry.Registry}
						<br />
						<strong>File</strong>:&nbsp;
						<Link
							href="#"
							onClick={() =>
								ShowExecutableLocation(
									activeStartupEntry.File
								)
							}
							color="inherit"
							title="Open File Location"
						>
							{activeStartupEntry.File}
						</Link>
					</Typography>
					<Grid container>
						<Grid item xs={6} sm={6} lg={6} xl={6}>
							<FormControlLabel
								control={
									<Checkbox checked={options.BackupRegistry} onChange={(e) => setOption('BackupRegistry', !options.BackupRegistry)}/>
								}
								label="Backup Registry"
							/>
						</Grid>
						<Grid item xs={6} sm={6} lg={6} xl={6}>
							<FormControlLabel
								control={
									<Checkbox checked={options.KeepRegistry} onChange={(e) => setOption('KeepRegistry', !options.KeepRegistry)}/>
								}
								label="Keep Registry"
							/>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</>
	);
};

export default StartupItemDetails;