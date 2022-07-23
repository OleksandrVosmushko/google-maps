export interface CommandData {
  command: Command;
  data: any;
}

export enum Command {
  Select,
  Add,
  Remove,
  ClearAll
}
