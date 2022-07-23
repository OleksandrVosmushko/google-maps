export interface CommandData {
  command: Command;
  data: any;
}

export enum Command {
  Search,
  Add,
  Remove,
  ClearAll
}
