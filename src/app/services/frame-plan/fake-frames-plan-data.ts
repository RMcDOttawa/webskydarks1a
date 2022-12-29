import {DarkFrameSet, DarkFrameType} from "../../types";

export const fakeFrameSets: DarkFrameSet[] = [
    { // Index 0
      frameSpec: {
        frameType: DarkFrameType.biasFrame,
        binning: 1,
        exposure: 0
      },
      id: 1,
      numberWanted: 161,
      numberCaptured: 16
    },
    { // Index 1
      frameSpec: {
        frameType: DarkFrameType.biasFrame,
        binning: 2,
        exposure: 0
      },
      id: 2,
      numberWanted: 162,
      numberCaptured: 16
    },
    { // Index 2
      frameSpec: {
        frameType: DarkFrameType.biasFrame,
        binning: 4,
        exposure: 0
      },
      id: 3,
      numberWanted: 163,
      numberCaptured: 6
    },
    { // Index 3
      frameSpec: {
        frameType: DarkFrameType.darkFrame,
        binning: 1,
        exposure: 60
      },
      id: 4,
      numberWanted: 164,
      numberCaptured: 0
    },
    { // Index 4
      frameSpec: {
        frameType: DarkFrameType.darkFrame,
        binning: 1,
        exposure: 180
      },
      id: 5,
      numberWanted: 165,
      numberCaptured: 0
    },
    { // Index 5
      frameSpec: {
        frameType: DarkFrameType.darkFrame,
        binning: 1,
        exposure: 300
      },
      id: 6,
      numberWanted: 166,
      numberCaptured: 0
    },
    { // Index 6
      frameSpec: {
        frameType: DarkFrameType.darkFrame,
        binning: 2,
        exposure: 300
      },
      id: 7,
      numberWanted: 167,
      numberCaptured: 0
    },
  ];
