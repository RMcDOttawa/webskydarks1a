//  One set of dark frames to be captured.
//  i.e. a specific type of dark frame, the quantity wanted, and the quantity captured so far.

interface DarkFrameSet {
  frameSpec:  DarkFrame;    //  What kind of dark frame?
  numberWanted: number;     //  How many do we want?
  numberCaptured: number;   //  How many, if any, have we already taken?
}
