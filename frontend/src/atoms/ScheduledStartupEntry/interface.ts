import IStartupEntry from '../StartupEntry/interface';
import IStartupOptions from '../StartupOptions/interface';

export default interface IScheduledStartupEntry {
	Entry:		IStartupEntry;
	Options:	IStartupOptions;
}