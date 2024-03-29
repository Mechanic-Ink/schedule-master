// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {structs} from '../models';

export function BackupStartupItem(arg1:number):Promise<void>;

export function BackupStartupItems():Promise<boolean>;

export function Exit():Promise<void>;

export function FetchScheduledItems(arg1:boolean):Promise<Array<structs.ScheduledStartupEntry>>;

export function FetchStartupItems(arg1:boolean):Promise<Array<structs.StartupEntry>>;

export function Hide():Promise<void>;

export function OpenBackupFolder():Promise<void>;

export function PrepareDataDirectory():Promise<void>;

export function RemoveRegistryEntry(arg1:number):Promise<boolean>;

export function ScheduleRegistryEntry(arg1:structs.StartupEntry,arg2:structs.StartupOptions):Promise<boolean>;

export function Show():Promise<void>;

export function ShowExecutableLocation(arg1:string):Promise<void>;
