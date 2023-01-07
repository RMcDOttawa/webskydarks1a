import {Injectable} from '@angular/core';

const fakeDownloadSeconds = 5;
const fakeAcquisitionSeconds = 15;


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

  constructor() { }

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
    await this.measureDownloadTimes();
    if (!this.acquisitionRunning) return;   // check if cancelled

    //  Do the actual image acquisition
    await this.acquireAllImages();
    if (!this.acquisitionRunning) return;   // check if cancelled

    //  Report that we're done
    console.log('STUB clean-up');
    this.consoleMessageCallback('Ending acquisition');
    this.acquisitionFinishedCallback();
    this.acquisitionRunning = false;

    // console.log('AcquisitionService/beginAcquisition exits');
  }

  //  Cancel  any running acquisition tasks
  cancelAcquisition() {
    // console.log('AcquisitionService/cancelAcquisition entered');
    this.consoleMessageCallback!('Acquisition process cancelled');

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

    this.acquisitionRunning = false;
    if (this.acquisitionFinishedCallback) this.acquisitionFinishedCallback();
    // console.log('AcquisitionService/cancelAcquisition exits');
  }


  //  Get a complete list of the binning sizes we will be acquiring, and measure how long each takes to
  //  download (this download time is significant - like 20 seconds with my camera).
  //  To measure download time, we just time taking a bias frame. Bias frames have zero-length exposure,
  //  so the elapsed time to take them is pure download.

  //  Testing stub: we just do a delay for now.

  private measureDownloadTimes(): Promise<void> {
    // console.log('Creating measureDownloadTimes promise');
    this.consoleMessageCallback!('Measuring download times');
    return new Promise<void>((resolve) => {
      // console.log(`  Starting ${fakeDownloadSeconds}-second timer to fake download timer`);
      this.fakeDownloadTimerId = setTimeout(() => {
        // console.log('  Download fake timer has fired');
        resolve();
      }, fakeDownloadSeconds*1000)
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
      // console.log(`  Starting ${fakeAcquisitionSeconds}-second timer to fake acquisition`);
      this.fakeAcquisitionTimerId = setTimeout(() => {
        // console.log('  Acquisition fake timer has fired');
        resolve();
      }, fakeAcquisitionSeconds*1000)
    })
  }
}
