//  Mock for the injectable MAT_DIALOG_DATA

import {DarkFrameSet, DarkFrameType} from "../types";

  export class MAT_DIALOG_DATA_MOCK  {
  edit:boolean = true;
  frameSet: DarkFrameSet = {
    frameSpec: {
      frameType: DarkFrameType.biasFrame,
      binning: 1,
      exposure: 0
    },
    id: 1,
    numberWanted: 161,
    numberCaptured: 16
  }
}
