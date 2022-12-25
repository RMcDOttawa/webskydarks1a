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
