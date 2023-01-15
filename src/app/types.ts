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

//  When to start an acquisition session
export interface SessionStart {
  immediate: boolean;       //  Start immediately?
  laterDate: Date | null;   //  If immediate=false, then when?
}

//  When to stop an acquisition session
export interface SessionEnd {
  whenDone: boolean;       //  Run to completion, then stop?
  laterDate: Date | null;  //  If whenDone=false, then when?
}

//  Information about camera temperature control
export interface TemperatureControl {
  enabled: boolean,             //  Use temperature control?
  target: number,               //  Cool to this temperature
  within: number,               //    target temp is plus-or-minus this amount
  checkInterval: number,        //  Check this often (seconds) while cooling
  maxTime: number,              //  Max time to attempt to reach target temp
  retries: number,              //  If cooling failed, try again this many times
  retryDelay: number,           //      ... waiting this long between retries
  abortOnRise: boolean,         //  Abort session if temperature deviates
  abortThreshold: number,       //      ... by this much
  offAfterSession: boolean      //  Turn cooler off at end of acquisition session
}

//  Information about the status of the camera cooling system
export interface CoolingStatus {
  temperature: number,    //  Current chip temperature
  coolerPower: number     //  Cooler %power
}
