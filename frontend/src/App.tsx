import Grid from "@mui/material/Unstable_Grid2";
import { RecoilRoot } from 'recoil';
// import logo from "./assets/images/logo-universal.png";

import Sidebar from "./components/Sidebar";
import MenuBar from "./components/MenuBar";
import MainContent from "./components/MainContent";
import { EntriesProvider } from "./util/contexts/StartupEntry/context";

import "./App.css";
import { useLoading } from "./components/LoadingProvider";
import LoadingOverlay from "./components/LoadingProvider/Overlay";
// import {Greet} from "../wailsjs/go/main/App";

function App() {
	const { isLoading } = useLoading();

	return (
		<>
			<EntriesProvider>
				<RecoilRoot>
					<div id="App">
						<Grid container>
							<Grid xs={12} sm={12} md={12} lg={12} xl={12}>
								<MenuBar />
							</Grid>
							<Grid xs={3}>
								<Sidebar />
							</Grid>
							<Grid xs={9}>
								<MainContent/>
							</Grid>
						</Grid>
					</div>
				</RecoilRoot>
			</EntriesProvider>
			<LoadingOverlay open={isLoading}/>
		</>
	);
}

export default App;
