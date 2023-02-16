import StartupEntry from "app/util/interfaces/IStartupEntry";

export default interface IStartupEntryItem {
	item: StartupEntry;
	backupRegistry: boolean; 
	setBackupRegistry: React.Dispatch<React.SetStateAction<boolean>>;
}