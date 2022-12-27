//  Mock for the injectable MAT_DIALOG_DATA
//
// import {fakeFrameSets} from "../services/frame-plan/fake-frames-plan-data";
// import {DarkFrameSet, DarkFrameType} from "../types";
//
// export class MatDialogDataMock {
//   data: any;
//   constructor() {
//     this.data = {
//       edit: true,
//       frameSet: {
//         frameSpec: {
//           frameType: DarkFrameType.biasFrame,
//           binning: 1,
//           exposure: 0
//         },
//         id: 1,
//         numberWanted: 161,
//         numberCaptured: 16
//       }
//     }
//   }
// }

import {DarkFrameType} from "../types";

export const mat_dialog_data_mock = {
  edit: true,
  frameSet: {
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
