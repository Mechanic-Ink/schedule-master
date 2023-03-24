import StartupOptions from "app/util/interfaces/IStartupOptions";

export default interface IStartupSettings {
	options: StartupOptions; 
	setOptions: React.Dispatch<Partial<StartupOptions>>;
}