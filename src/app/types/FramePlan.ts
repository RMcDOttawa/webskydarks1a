//  The plan for frames to be captured
//  It's a list of the dark frames sets and an index telling us which set we're working on

interface FramePlan {
  frameSets: DarkFrameSet[];
  currentSet: number;
}
