export namespace structs {
	
	
	export class StartupEntry {
	    Id: number;
	    Name: string;
	    Command: string;
	    Type: string;
	    Registry: string;
	    File: string;
	    Icon: string;
	
	    static createFrom(source: any = {}) {
	        return new StartupEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Name = source["Name"];
	        this.Command = source["Command"];
	        this.Type = source["Type"];
	        this.Registry = source["Registry"];
	        this.File = source["File"];
	        this.Icon = source["Icon"];
	    }
	}

}

