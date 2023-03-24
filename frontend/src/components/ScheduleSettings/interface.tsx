import StartupOptions from "app/util/interfaces/IStartupOptions";

export default interface IScheduleSettings {
	options: StartupOptions;
	setOptions: React.Dispatch<Partial<StartupOptions>>;
}