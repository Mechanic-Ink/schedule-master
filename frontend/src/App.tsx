import { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
// import logo from "./assets/images/logo-universal.png";

import StartupEntry from "app/util/interfaces/IStartupEntry";
import Sidebar from "./components/Sidebar";
import MenuBar from "./components/MenuBar";
import MainContent from "./components/MainContent";
import { EntriesProvider } from "./util/contexts/StartupEntry/context";

import "./App.css";
// import {Greet} from "../wailsjs/go/main/App";

function App() {
    // const [resultText, setResultText] = useState(
    //     "Please enter your name below 👇"
    // );
    // const [name, setName] = useState("");
    // const updateName = (e: any) => setName(e.target.value);
    // const updateResultText = (result: string) => setResultText(result);

    // function greet() {
    //     Greet(name).then(updateResultText);
    // }

    const [startupEntry, setStartupEntry] = useState<StartupEntry>();

    return (
        <EntriesProvider>
            <div id="App">
                <Grid container>
                    <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
                        <MenuBar />
                    </Grid>
                    <Grid xs={3}>
                        <Sidebar setActiveStartupItem={setStartupEntry} />
                    </Grid>
                    <Grid xs={9}>
                        <MainContent activeStartupItem={startupEntry} />
                    </Grid>
                </Grid>
            </div>
        </EntriesProvider>
    );
}

export default App;
