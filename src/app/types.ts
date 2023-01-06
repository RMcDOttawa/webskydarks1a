//  The two types of dark frame we can collect
export enum DarkFrameType {
  darkFrame = "dark",
  biasFrame = "bias"
}

//  A description of a single dark frame
export interface DarkFrame  {
  frameType: DarkFrameType;  //  One of the two values above (can't get enums to work, can't be bothered fighting now)
  binning: number;    // Integer, typically 1 to 4.
  exposure: number;   // 0 if a bias frame, otherwise seconds including fraction
}

//  A set of identical dark frames
export interface DarkFrameSet  {
  id: number;               //  Unique ID assigned to each frame set
  frameSpec:  DarkFrame;    //  What kind of dark frame?
  numberWanted: number;     //  How many do we want?
  numberCaptured: number;   //  How many, if any, have we already taken?

}

//  How to specify where the relay server is
export interface ServerCoordinates {
  address: string;
  port: number;
}



//  Messages send from the application to the Web Worker subtask

export enum WebWorkerCommand {
  start = 'start',
  shutdown = 'shutdown',
}

export type WebWorkerMessage = {
  command: WebWorkerCommand;
  payload?: any;
}


//  Messages send from the Web Worker back to the application

export enum WebWorkerResponse {
  debugMessage= 'debug',
  fakeConsoleResponse = 'console',
}

export type WebWorkerResponseMessage = {
  command: WebWorkerResponse;
  payload?: any;
}
