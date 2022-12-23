//  Specification for a single dark (or bias) frame

interface DarkFrame {
  frameType: DarkFrameType;
  binning: number;    // Integer, typically 1 to 4.
  exposure: number;   // 0 if a bias frame, otherwise seconds including fraction
}
