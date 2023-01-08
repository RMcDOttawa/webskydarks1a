import {Injectable} from '@angular/core';
import {FramePlanService} from "../frame-plan/frame-plan.service";
import {ServerCommunicationService} from "../server-communication/server-communication.service";

const fakeAcquisitionSeconds = 30;
const fakeConsoleIntervalSeconds = 1;

const milliseconds = 1000;
const maxBinningValue = 10;


//  Service to manage the actual acquisition of frames.
//  Since actual acquisition is done async by theSkyX this service is non-blocking, but
//  has to use timers and callbacks to keep an eye on theSkyX and know when things are complete

@Injectable({
  providedIn: 'root'
})
export class AcquisitionService {
  private consoleMessageCallback: ((message: string) => void) | undefined;
  private acquisitionFinishedCallback: (() => void) | undefined;
  private acquisitionRunning = false;
  fakeDownloadTimerId:  ReturnType<typeof setTimeout> | null  = null;
  fakeAcquisitionTimerId:  ReturnType<typeof setTimeout> | null  = null;
  fakeConsoleTimerId:  ReturnType<typeof setInterval> | null  = null;
  fakeConsoleSequence: number = 0;

  downloadTimes: number[] = [];

  constructor(
    private framePlanService: FramePlanService,
    private communicationService: ServerCommunicationService
  ) {
  }

  //  Is the acquisiiton task currently running?
  isRunning() {
    return this.acquisitionRunning;
  }

  //  We've been asked to start the acquisition process.
  //  We want to keep the polling of the status of TheSky non-blocking, so we use promises for the major steps

  async beginAcquisition(consoleMessageCallback: (message: string) => void,
                         acquisitionFinishedCallback: () => void) {
    // console.log('AcquisitionService/beginAcquisition entered');
    this.acquisitionRunning = true;
    this.consoleMessageCallback = consoleMessageCallback;
    this.acquisitionFinishedCallback = acquisitionFinishedCallback;

    //  Console log that we're starting
    this.consoleMessageCallback('Beginning acquisition');

    //  Measure the download times for different binning images to predict durations,
    this.downloadTimes = await this.measureDownloadTimes();
    if (!this.acquisitionRunning) return;   // check if cancelled
    //  Debug console output
    // for (let b = 0; b < this.downloadTimes.length; b++) {
    //   if (this.downloadTimes[b] !== -1) {
    //     console.log(`Download binned ${b} took ${this.downloadTimes[b]} seconds.`);
    //   }
    // }

    //  Do the actual image acquisition
    await this.acquireAllImages();
    if (!this.acquisitionRunning) return;   // check if cancelled

    //  Report that we're done
    // console.log('STUB clean-up');
    this.consoleMessageCallback('Ending acquisition');
    this.acquisitionFinishedCallback();
    this.acquisitionRunning = false;
    this.shutdown();

    // console.log('AcquisitionService/beginAcquisition exits');
  }

  //  Cancel  any running acquisition tasks
  cancelAcquisition() {
    // console.log('AcquisitionService/cancelAcquisition entered');
    this.consoleMessageCallback!('Acquisition process cancelled');
    if (this.acquisitionFinishedCallback) this.acquisitionFinishedCallback();
    this.shutdown();
    // console.log('AcquisitionService/cancelAcquisition exits');
  }


  //  Get a complete list of the binning sizes we will be acquiring, and measure how long each takes to
  //  download (this download time is significant - like 20 seconds with my camera).
  //  To measure download time, we just time taking a bias frame. Bias frames have zero-length exposure,
  //  so the elapsed time to take them is pure download.

  //  Testing stub: we just do a delay for now.

  private measureDownloadTimes(): Promise<number[]> {
    // console.log('Creating measureDownloadTimes promise');
    this.consoleMessageCallback!('Measuring download times');

    //  Determine which binning values are used in the acquisition plan
    // console.log('   Determining which binning values are needed');
    let binningNeeded: boolean[] = Array(maxBinningValue + 1).fill(false);
    this.framePlanService.getFrameSets().forEach((frameSet) => {
      if (frameSet.numberWanted > frameSet.numberCaptured) {
        binningNeeded[frameSet.frameSpec.binning] = true;
      }
    });
    //  Debug console output
    // for (let b = 0; b < binningNeeded.length; b++) {
    //   if (binningNeeded[b]) {
    //     console.log(`      Need binning ${b}`);
    //   }
    // }

    //  Time the downloads of the needed binning values
    return new Promise<number[]>(async (resolve) => {
      let resultArray: number[] = Array(maxBinningValue + 1).fill(-1);
      // console.log('Download timing promise entered');
      for (let b = 0; b < binningNeeded.length; b++) {
        if (binningNeeded[b]) {
          resultArray[b] = await this.communicationService.timeDownload(b);
          this.consoleMessageCallback!(`  Download binned ${b}x${b}: ${resultArray[b]} seconds.`);
        }
      }
      // console.log('Download timing promise resolves');
      resolve(resultArray);
      // console.log('Download timing promise exits');
    })
  }

  //  Acquire all the images that need to be captured.
  //  Note that we can tell theSKy to start taking an image, but it doesn't report back when it's done. So we will
  //  calculate how long it should take (including download), then start polling theSky for its status.

  //  Testing stub: just do a delay for now.

  private acquireAllImages(): Promise<void> {
    // console.log('Creating acquireAllImages promise');
    this.consoleMessageCallback!('Acquiring images');
    return new Promise<void>((resolve) => {
      //  We use a single timer to end the simulated acquisition after a while
      // console.log(`  Starting ${fakeAcquisitionSeconds}-second timer to fake acquisition`);
      this.fakeAcquisitionTimerId = setTimeout(() => {
        // console.log('  Acquisition fake timer has fired');
        resolve();
      }, fakeAcquisitionSeconds * milliseconds);

      //  Meanwhile, we'll use an interval timer to send periodic console messages back
      this.fakeConsoleTimerId = setInterval(() => {
        // console.log('  Console log timer has fired');
        this.fakeConsoleSequence++;
        this.consoleMessageCallback!(`Simulated console message ${this.fakeConsoleSequence}`);
      }, fakeConsoleIntervalSeconds * milliseconds)
    })
  }

  shutdown() {
    // console.log('AcquisitionService/shutdown');
    //  Cancel any running timeout timers
    if (this.fakeDownloadTimerId) {
      clearTimeout(this.fakeDownloadTimerId);
      this.fakeDownloadTimerId = null;
      // console.log('  Download timer cancelled');
    }
    if (this.fakeAcquisitionTimerId) {
      clearTimeout(this.fakeAcquisitionTimerId);
      this.fakeAcquisitionTimerId = null;
      // console.log('  Acquisition timer cancelled');
    }
    if (this.fakeConsoleTimerId) {
      clearInterval(this.fakeConsoleTimerId);
      this.fakeConsoleTimerId = null;
      // console.log('  Fake console interval timer cancelled');
    }

    this.acquisitionRunning = false;

  }
}
