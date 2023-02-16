interface IStartupEntry {
	ID: number;
	Name: string;
	Command: string;
	Type: string;
	Registry: string;
	File: string;
	Icon: string;
}

export default IStartupEntry;