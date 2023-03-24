import StartupEntry from "app/util/interfaces/IStartupEntry";

export default interface ISidebar {
	setActiveStartupItem: (StartupEntry: StartupEntry) => void;
}