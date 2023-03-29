import IStartupEntry from "app/atoms/StartupEntry/interface";

export default interface IStartupEntryItem {
	item: IStartupEntry;
	backupRegistry: boolean; 
	setBackupRegistry: React.Dispatch<React.SetStateAction<boolean>>;
}