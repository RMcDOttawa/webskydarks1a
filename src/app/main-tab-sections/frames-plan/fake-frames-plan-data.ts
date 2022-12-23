export const fakeFramesPlanData: FramePlan = {
  frameSets: [
    {
      frameSpec: {
        frameType: DarkFrameType.biasFrame,
        binning: 1,
        exposure: 0
      },
      numberWanted: 16,
      numberCaptured: 16
    },
    {
      frameSpec: {
        frameType: DarkFrameType.biasFrame,
        binning: 2,
        exposure: 0
      },
      numberWanted: 16,
      numberCaptured: 16
    },
    {
      frameSpec: {
        frameType: DarkFrameType.biasFrame,
        binning: 4,
        exposure: 0
      },
      numberWanted: 16,
      numberCaptured: 6
    },
    {
      frameSpec: {
        frameType: DarkFrameType.darkFrame,
        binning: 1,
        exposure: 60
      },
      numberWanted: 16,
      numberCaptured: 0
    },
    {
      frameSpec: {
        frameType: DarkFrameType.darkFrame,
        binning: 1,
        exposure: 180
      },
      numberWanted: 16,
      numberCaptured: 0
    },
    {
      frameSpec: {
        frameType: DarkFrameType.darkFrame,
        binning: 1,
        exposure: 300
      },
      numberWanted: 16,
      numberCaptured: 0
    },
    {
      frameSpec: {
        frameType: DarkFrameType.darkFrame,
        binning: 2,
        exposure: 300
      },
      numberWanted: 16,
      numberCaptured: 0
    },
  ],
  currentSet: 2
}
