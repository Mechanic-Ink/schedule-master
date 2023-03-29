import { Button, Card, CardContent, Grid, styled } from "@mui/material";

import StartupOptions from "app/atoms/StartupOptions";
import IStartupOptions from "app/atoms/StartupOptions/interface";
import { useRecoilState } from "recoil";
import IMainActions from "./interface";

const MainActions: React.FC<IMainActions> = ({backupRegistry}) => {
	const [options, _] = useRecoilState<IStartupOptions>(StartupOptions);

	const CustomCardContent = styled(CardContent)(`
		&: last-child {
			padding-bottom: 0;
		}
	`);

	const removeRegistry = () => {
		console.log("Backup registry is:", backupRegistry);
		//If backupRegistry is true
		//Create a copy of the registry
		//and delete registry
	};

	const scheduleRegistry = () => {
		console.log("Options", options);
	};


	return (
		<Card sx={{ m:0.5}}>
			<CustomCardContent sx={{mb:0}}>
				<Grid container>
					<Grid item xs={8} sx={{px:0.5}}>
						<Button sx={{width: '100%'}} onClick={() => scheduleRegistry()} variant="contained">Schedule</Button>&nbsp;
					</Grid>
					<Grid item xs={4} sx={{px:0.5}}>
						<Button color="error" sx={{width: '100%'}} onClick={() => removeRegistry()} variant="contained">Remove Registry</Button>
					</Grid>
				</Grid>
			</CustomCardContent>
		</Card>
	);
}

export default MainActions;