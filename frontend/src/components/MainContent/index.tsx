import Grid from "@mui/material/Unstable_Grid2";
import { useRecoilState } from "recoil";

import StartupItemDetails from "../StartupItemDetails";
import MainActions from "../MainActions";
import StartupSettings from "../StartupSettings";
import ScheduleSettings from "../ScheduleSettings";
import { ActiveStartupEntry } from "app/atoms/StartupEntry";

const MainContent: React.FC = () => {
	const [activeStartupEntry] = useRecoilState(ActiveStartupEntry);

	return (
		<>
			{activeStartupEntry.Id !== 0 ? (
				<>
					<Grid container>
						<Grid xs={12}>
							<StartupItemDetails />
						</Grid>
						<Grid xs={12}>
							<MainActions/>
						</Grid>
						<Grid xs={6}>
							<StartupSettings/>
						</Grid>
						<Grid xs={6}>
							<ScheduleSettings/>
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