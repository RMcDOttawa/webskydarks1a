import {Injectable} from '@angular/core';
import {FramePlanService} from "../frame-plan/frame-plan.service";
import {ServerCommunicationService} from "../server-communication/server-communication.service";
import {CoolingStatus, DarkFrame, DarkFrameSet, DarkFrameType, SessionStart} from "../../types";
import {SettingsService} from "../settings/settings.service";

// const fakeAcquisitionSeconds = 30;
// const fakeConsoleIntervalSeconds = 1;

const milliseconds = 1000;
const maxBinningValue = 10;

const hedge_multiplier = 0.01;  //  Add 1% to the exposure in case the download lags for some reason
// const hedge_multiplier = -.15;  //  For testing, force the wait to be 5% too short, to test polling loop
const hedge_constant = 0.5;     //  And add an additional 1/2 second
const delay_between_completion_checks = 1;  // seconds
const max_polling_time_after_exposure = 60; // seconds

const progress_bar_minimum_duration_secs = 5;    //  Progress bar when >= this many seconds exposure
const progress_bar_update_interval_secs = 0.1;      //  Update the progress bar every this many seconds

const max_possible_date = new Date(8640000000000000); // from Date documentation

const cooling_status_update_interval_seconds = 33;


//  Service to manage the actual acquisition of frames.
//  Since actual acquisition is done async by theSkyX this service is non-blocking, but
//  has to use timers and callbacks to keep an eye on theSkyX and know when things are complete

@Injectable({
  providedIn: 'root'
})
export class AcquisitionService {
  private consoleMessageCallback: ((message: string, indentLevel?: number) => void) | undefined;
  private acquisitionFinishedCallback: (() => void) | undefined;
  private workingFrameIndexCallback: ((frameIndex: number) => void) | undefined;

  //  Callbacks to make a progress bar visible and update it.  We'll do this only for exposures
  //  longer than some threshold, and update with a periodic timer
  private setProgressBarVisibilityCallback: ((visibility: boolean) => void) | undefined;
  private setProgressBarProgressCallback: ((progress: number) => void) | undefined;
  private setCoolingStatusCallback: ((coolingStatus: CoolingStatus) => void) | undefined;

  private acquisitionRunning = false;
  private exposuresHaveBegun = false;

  fakeDownloadTimerId: ReturnType<typeof setTimeout> | null = null;
  fakeAcquisitionTimerId: ReturnType<typeof setTimeout> | null = null;
  fakeConsoleTimerId: ReturnType<typeof setInterval> | null = null;
  fakeConsoleSequence: number = 0;

  //  Timers used for delayed start
  delayedStartTimerId: ReturnType<typeof setTimeout> | null = null;
  // delayBlipIntervalId: ReturnType<typeof setInterval> | null = null;

  progressBarStartedAt!: Date;
  progressBarTargetMilliseconds!: number;
  progressBarIntervalId: ReturnType<typeof setInterval> | null = null;

  //  Interval used to periodically update coooling status while using the cooler
  coolingUpdateIntervalId: ReturnType<typeof setInterval> | null = null;

  downloadTimes: number[] = [];
  private delayTimerId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private framePlanService: FramePlanService,
    private communicationService: ServerCommunicationService,
    private settingsService: SettingsService
  ) {
  }

  //  Is the acquisition task currently running?
  isRunning() {
    return this.acquisitionRunning;
  }

  //  We've been asked to start the acquisition process.
  //  We want to keep the polling of the status of TheSky non-blocking, so we use promises for the major steps
  // this.setProgressBarVisibility.bind(this),
  // this.setProgressBarProgress.bin(this)

  async beginAcquisition(consoleMessageCallback: (message: string, indentLevel?: number) => void,
                         workingFrameIndexCallback: (frameIndex: number) => void,
                         acquisitionFinishedCallback: () => void,
                         setProgressBarVisibility: (visibility: boolean) => void,
                         setProgressBarProgress: (progress: number) => void,
                         setCoolingStatus: (coolingStatus: CoolingStatus) => void,
  ) {
    // console.log('AcquisitionService/beginAcquisition entered');
    this.consoleMessageCallback = consoleMessageCallback;
    this.acquisitionFinishedCallback = acquisitionFinishedCallback;
    this.workingFrameIndexCallback = workingFrameIndexCallback;
    this.setProgressBarVisibilityCallback = setProgressBarVisibility;
    this.setProgressBarProgressCallback = setProgressBarProgress;
    this.setCoolingStatusCallback = setCoolingStatus;
    this.acquisitionRunning = true;
    this.exposuresHaveBegun = false;

    //  We may need to wait awhile, depending on startup settings
    await this.waitIfNecessary();
    if (this.delayedStartTimerId) {
      clearTimeout(this.delayedStartTimerId);
      this.delayedStartTimerId = null;
      console.log('  Delayed start timer cancelled');
    }

    //  Now, if requested, we will turn on camera cooling and wait until it reaches the target temperature
    //  This might fail, so abort if we don't get there.
    try {
      const abortForCoolingFailure = await this.coolCameraIfRequested();
      if (abortForCoolingFailure) {
        this.consoleMessageCallback(`Unable to cool camera to target, aborting session.`);
        await this.cancelAcquisition();
        return;
      }
    } catch (err) {
      this.consoleMessageCallback(`Unable to cool camera to target, aborting session.`);
      await this.cancelAcquisition();
      return;
    }
    if (!this.acquisitionRunning) return;   // check if cancelled

    //  Console log that we're starting
    this.consoleMessageCallback('Beginning acquisition');
    //  Flag that, as of now, the camera might be exposing something, so we know to abort on a cancel or fail
    this.exposuresHaveBegun = true;
    //  Measure the download times for different binning images to predict durations,
    try {
      this.downloadTimes = await this.measureDownloadTimes();
    } catch (err) {
      this.consoleMessageCallback(`Unable to time downloads: ${err}`);
      await this.cancelAcquisition();
      return;
    }
    if (!this.acquisitionRunning) return;   // check if cancelled

    //  Do the actual image acquisition
    try {
      await this.acquireAllImages();
    } catch (err) {
      this.consoleMessageCallback(`Unable to acquire images: ${err}`);
      await this.cancelAcquisition();
      return;
    }
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
  async cancelAcquisition(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      console.log('AcquisitionService/cancelAcquisition entered');
      try {
        if (this.acquisitionRunning && this.exposuresHaveBegun) {
          if (await this.communicationService.isExposureComplete()) {
            console.log('  Nothing to abort');
          } else {
            console.log('  Aborting in-progress exposure');
            await this.communicationService.abortExposure();
          }
        }
      } catch (e) {
        console.log('Error cancelling acquisition: ', e);
      } finally {
        this.consoleMessageCallback!('Acquisition process cancelled');
        if (this.acquisitionFinishedCallback) this.acquisitionFinishedCallback();
        this.shutdown();
        console.log('AcquisitionService/cancelAcquisition exits');
        resolve();
      }
    })
  }


  //  Get a complete list of the binning sizes we will be acquiring, and measure how long each takes to
  //  download (this download time is significant - like 20 seconds with my camera).
  //  To measure download time, we just time taking a bias frame. Bias frames have zero-length exposure,
  //  so the elapsed time to take them is pure download.

  //  Testing stub: we just do a delay for now.

  private measureDownloadTimes(): Promise<number[]> {
    // console.log('Creating measureDownloadTimes promise');
    this.consoleMessageCallback!('Measuring download times');
    const binningNeeded = this.determineBinningsNeeded();

    //  Time the downloads of the needed binning values
    return new Promise<number[]>(async (resolve, reject) => {
      let resultArray: number[] = Array(maxBinningValue + 1).fill(-1);
      // console.log('  Download timing promise entered');
      for (let b = 0; b < binningNeeded.length; b++) {
        if (binningNeeded[b]) {
          // console.log('  About to call relay/timedownload/', b);
          try {
            // console.log('  Try succeeded on timedownload');
            resultArray[b] = await this.communicationService.timeDownload(b);
            this.consoleMessageCallback!(`Download binned ${b}x${b}: ${resultArray[b]} seconds.`, 2);
          } catch (e) {
            // console.log('  Try failed on timedownload');
            reject('download failed');
          }
        }
      }
      // console.log('Download timing promise resolves');
      resolve(resultArray);
      // console.log('Download timing promise exits');
    })
  }

  //  Determine which binning values are used in the acquisition plan.
  //  Return an array of 11 booleans.  Each is true if the binning value at that index is needed. (index 0 ignored)
  //  e.g., if we need binning 2x2, then the array[2] will be true
  determineBinningsNeeded(): boolean[] {
    // console.log('   Determining which binning values are needed');
    let binningNeeded: boolean[] = Array(maxBinningValue + 1).fill(false);
    this.framePlanService.getFrameSets().forEach((frameSet) => {
      if (frameSet.numberWanted > frameSet.numberCaptured) {
        binningNeeded[frameSet.frameSpec.binning] = true;
      }
    });
    return binningNeeded;
  }

  //  Acquire all the images that need to be captured.
  //  Note that we can tell theSKy to start taking an image, but it doesn't report back when it's done. So we will
  //  calculate how long it should take (including download), then start polling theSky for its status.

  //  Acquisition runs until either all images are acquired, or an optional end date and time is passed
  //  We handle the "optionality" of the end time by just using an infinite future if it isn't specified

  private acquireAllImages(): Promise<void> {
    const acquisitionEndTime = this.getAcquisitionEndTime();
    const endTimeString = acquisitionEndTime.toLocaleTimeString();
    if (acquisitionEndTime === max_possible_date) {
      this.consoleMessageCallback!('Acquiring images.');
    } else {
      this.consoleMessageCallback!(`Acquiring images until ${endTimeString}.`);
    }
    return new Promise<void>(async (resolve, reject) => {
      const frameSets: DarkFrameSet[] = this.framePlanService.getFrameSets();
      //  Main loop - get each frame that needs to be acquired (a frame from an incomplete frame set),
      //  Acquire it, upate the frameset completion counts, and repeat.  Keep an eye on the Cancelled flag too.
      let frameSetIndex: number = this.framePlanService.findIndexOfNextSetToAcquire();
      let temperatureOk: boolean = true;
      while (frameSetIndex !== -1
      && this.acquisitionRunning
      && this.withinDefinedRunTime(acquisitionEndTime)
      && temperatureOk) {
        //  Tell the UI what frame index we are on
        this.workingFrameIndexCallback!(frameSetIndex);

        const thisFrameSet = frameSets[frameSetIndex];
        try {
          await this.acquireOneFrame(thisFrameSet.numberCaptured + 1, thisFrameSet);
          thisFrameSet.numberCaptured = Number(thisFrameSet.numberCaptured) + 1;
          this.framePlanService.updateFrameSet(thisFrameSet);

          //  Get the next place where an image is still needed.
          frameSetIndex = this.framePlanService.findIndexOfNextSetToAcquire();
        } catch (err) {
          reject(err);
        } //end try
        temperatureOk = await this.temperatureOkOrIgnored();
        if (!temperatureOk) {
          this.consoleMessageCallback!('Temperature has risen more than allowed, aborting acquisition', 1);
        }
      } //end while
      if (!this.withinDefinedRunTime(acquisitionEndTime)) {
        this.consoleMessageCallback!(`Defined end time (${endTimeString}) has passed, stopping acquisition`, 1);
      }
      //  When we get here, all the frames have been captured or the time has expired, so resolve the promise

      resolve();
    });
  }

  shutdown() {
    // console.log('AcquisitionService/shutdown');
    //  Cancel any running timeout timers
    if (this.fakeDownloadTimerId) {
      clearTimeout(this.fakeDownloadTimerId);
      this.fakeDownloadTimerId = null;
      console.log('  Fake Download timer cancelled');
    }
    if (this.fakeAcquisitionTimerId) {
      clearTimeout(this.fakeAcquisitionTimerId);
      this.fakeAcquisitionTimerId = null;
      console.log('  Fake Acquisition timer cancelled');
    }
    if (this.fakeConsoleTimerId) {
      clearInterval(this.fakeConsoleTimerId);
      this.fakeConsoleTimerId = null;
      console.log('  Fake console interval timer cancelled');
    }
    if (this.coolingUpdateIntervalId) {
      clearInterval(this.coolingUpdateIntervalId);
      this.coolingUpdateIntervalId = null;
      console.log('  Cooling status interval timer cancelled');
    }
    if (this.delayedStartTimerId) {
      clearTimeout(this.delayedStartTimerId);
      this.delayedStartTimerId = null;
      console.log('  Delayed start timer cancelled');
    }
    if (this.delayTimerId) {
      clearTimeout(this.delayTimerId);
      this.delayTimerId = null;
      console.log('  Generic delay timer cancelled');
    }
    this.shutDownProgressBar();

    this.acquisitionRunning = false;

  }

  //  Acquire one frame from the given frameset.  It will be running asynchronously in TheSkyX.
  //  We will wait and then poll so that we return only when the acquisition is done (or failed).


  private async acquireOneFrame(counter: number, frameSet: DarkFrameSet): Promise<void> {
    const frameSpec: DarkFrame = frameSet.frameSpec;
    const expectedDuration = this.calculateExpectedDuration(frameSpec);
    // console.log(`acQuireOneFrame: ${frameSpec.frameType}, ${frameSpec.binning}, ${frameSpec.exposure}`);
    // console.log(`  Estimated duration: ${expectedDuration}`);
    this.consoleMessageCallback!(`  Acquiring image ${counter} of set: ${this.describeFrame(frameSpec)}`, 2);

    return new Promise<void>(async (resolve, reject) => {
      this.setUpProgressBar(expectedDuration);
      try {
        // console.log('   Starting acquisition');
        await this.communicationService.startImageAcquisition(frameSpec.frameType,
          frameSpec.exposure, frameSpec.binning);
        if (!this.acquisitionRunning) {
          resolve();
          return;
        }

        //  Wait until it is probably finished
        // console.log('   Waiting for estimated duration: ', expectedDuration * milliseconds);
        await this.delay(expectedDuration * milliseconds);
        if (!this.acquisitionRunning) {
          resolve();
          return;
        }

        //  Poll until it is definitely finished
        // console.log('   Polling until completion confirmed');
        await this.pollUntilExposureComplete();

        resolve();
      } catch (err) {
        console.log('Image acquisition command failed: ', err);
        reject(err);
      } finally {
        this.shutDownProgressBar();
      }

    })
    //  Start image acquisition
  }


  private describeFrame(frameSpec: DarkFrame) {
    if (frameSpec.frameType === DarkFrameType.darkFrame) {
      return `Dark, ${frameSpec.exposure} secs binned ${frameSpec.binning}x${frameSpec.binning}`;
    } else {
      return `Bias, binned ${frameSpec.binning}x${frameSpec.binning}`;
    }
  }

  //  Just a simple delay of given milliseconds.
  //  We will reserve the timerId as a class variable, so we can cancel it if interrupted
  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      this.delayTimerId = setTimeout(() => {
        this.delayTimerId = null;
        resolve();
      }, milliseconds)
    });
  }

  //  Calculate an estimate of how long it should take to acquire this frame set.
  //    Exposure time + download time + a little hedge factor
  private calculateExpectedDuration(frameSpec: DarkFrame): number {
    const hedgeFactor = frameSpec.exposure * hedge_multiplier + hedge_constant;
    return frameSpec.exposure + this.downloadTimes[frameSpec.binning] + hedgeFactor;
  }

  //  the exposure should be complete - but it might not be, and we don't get feedback from TSX
  //  except by asking.  So we poll it to see if we're complete.  If not, wait a while and try
  //  again.  Repeat, with a timeout of "waited too long"
  private async pollUntilExposureComplete(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let totalTimeWaited = 0;
      // console.log('pollUntilExposureComplete');
      try {
        let isComplete = await this.communicationService.isExposureComplete();
        // console.log('Initially, isComplete = ', isComplete);
        while ((totalTimeWaited < max_polling_time_after_exposure) && !isComplete && this.acquisitionRunning) {
          // console.log('   Waiting: ', delay_between_completion_checks * milliseconds);
          await this.delay(delay_between_completion_checks * milliseconds);
          totalTimeWaited += delay_between_completion_checks;
          isComplete = await this.communicationService.isExposureComplete();
          // console.log(`   After ${totalTimeWaited} seconds, isComplete = ${isComplete}`);
        }
        if (isComplete) {
          resolve();
        } else {
          reject('Exposure taking too long');
        }
      } catch (err) {
        reject(err);
      }
    })
  }

  //  If the expected duration of the frame we're acquiring is over some threshold, display a progress bar
  //  and start a timer that will update it periodically
  private setUpProgressBar(expectedDuration: number) {
    // console.log('setUpProgressBar, expected duration: ', expectedDuration);
    if (expectedDuration < progress_bar_minimum_duration_secs) {
      //  To short a duration for a progress bar to be useful, just a distraction. Don't show it.
      this.setProgressBarVisibilityCallback!(false);
    } else {
      //  A long duration benefits from a progress bar.  Set it visible, start the progress at zero
      this.setProgressBarVisibilityCallback!(true);
      this.setProgressBarProgressCallback!(0);
      this.progressBarStartedAt = new Date();
      this.progressBarTargetMilliseconds = expectedDuration * milliseconds;

      this.progressBarIntervalId = setInterval(this.updateProgressBar.bind(this),
        progress_bar_update_interval_secs * milliseconds);
    }
  }

  private updateProgressBar() {
    const timeNow = new Date();
    // console.log('** Update progress bar. Started ', this.progressBarStartedAt, ', now ', timeNow);
    const elapsedMilliseconds = timeNow.getTime() - this.progressBarStartedAt.getTime();
    const percentageComplete = elapsedMilliseconds / this.progressBarTargetMilliseconds * 100;
    // console.log(`  ${elapsedMilliseconds}ms = ${percentageComplete}%`);
    this.setProgressBarProgressCallback!(percentageComplete);
  }

  private shutDownProgressBar() {
    if (this.progressBarIntervalId) {
      clearInterval(this.progressBarIntervalId);
      this.progressBarIntervalId = null;
    }
    this.setProgressBarVisibilityCallback!(false);
  }

  //  Determine if we should be starting right away or after a delay.
  //  If after a delay, do the delay.  If it's a long delay, provider occasional updates
  private async waitIfNecessary(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      let parsedStartDate: Date | null = null;
      const sessionStart: SessionStart | null = this.settingsService.getSessionStart();
      let delay = 0;
      if (sessionStart) {
        if (!sessionStart.immediate) {
          // console.log('  Not immediate, so check start date');
          const now = new Date();
          const storedDate = sessionStart.laterDate;
          if (storedDate) {
            parsedStartDate = new Date(storedDate);
            // console.log('  Stored start date: ', storedDate);
            // console.log('  Parsed start date: ', parsedStartDate);
            if (parsedStartDate > now) {
              delay = parsedStartDate.getTime() - now.getTime();
              // console.log('  Stored start date is in the future, delay ', delay);
              // console.log(`    ${delay/milliseconds} seconds = ${delay/milliseconds/60} minutes = ${delay/milliseconds/60/60} hours`);
            }
          }
        }
      }

      if (delay === 0) {
        // console.log('  No delay needed');
        resolve();
      } else {
        const startTimeString = parsedStartDate?.toLocaleTimeString();
        this.consoleMessageCallback!('Delaying until requested start time ' + startTimeString);
        this.setUpProgressBar(delay / milliseconds);
        this.delayedStartTimerId = setTimeout(() => {
          this.shutDownProgressBar();
          resolve();
        }, delay)
      }
    })

  }

  //  Get an end time for the acquisition run.  It's either specified in the settings or, if the settings say
  //  "when done", we'll use the far future to ensure acquisition can run to completion.

  private getAcquisitionEndTime(): Date {
    let endTime: Date = max_possible_date;
    const endSettings = this.settingsService.getSessionEnd();
    if (endSettings) {
      if (!endSettings.whenDone) {
        const storedDate = endSettings.laterDate;
        if (storedDate) {
          endTime = new Date(storedDate);
        }
      }
    }
    // console.log('getAcquisitionEndTime returning: ', endTime);
    return endTime;
  }

  private withinDefinedRunTime(acuisitionEndTime: Date): boolean {
    // console.log(`withinDefinedRunTime(${acuisitionEndTime}, ${new Date()})`);
    return acuisitionEndTime > new Date();
  }

  //  Cool the camera to the requested temperature, if cooling is enabled.
  //  Return a "should abort" indicator.  We should abort only if we fail to cool to the given target
  private async coolCameraIfRequested(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      let shouldAbort: boolean = false;
      const temperature = this.settingsService.getTemperatureControl();
      if (temperature) {
        if (temperature.enabled) {
          console.log(`  Cooling to ${temperature.target} requested.`);
          this.consoleMessageCallback!(`Cooling camera to ${temperature.target} degrees (&plusmn; ${temperature.within} degree).`, 1);
          try {
            shouldAbort = await this.coolCameraTo(temperature.target, temperature.within,
              temperature.checkInterval, temperature.maxTime,
              temperature.retries, temperature.retryDelay);
          } catch (err) {
            reject(err);
          }
        }
      }
      resolve(shouldAbort);
    })
  }

  private async coolCameraTo(target: number, within: number,
                             checkIntervalSeconds: number,
                             maxTimeSeconds: number, retries: number, retryDelaySeconds: number): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      // console.log(`Cool camera to ${target} within ${within}, checking every ${checkIntervalSeconds} seconds`);
      // console.log(`  Allow at least ${maxTimeSeconds} to cool`);
      // console.log(`  If necessary, retry up to ${retries} times, every ${retryDelaySeconds} seconds.`);
      let shouldAbort: boolean = false;
      try {
        await this.startCoolingTimer();
        let success: boolean = await this.oneCoolingAttempt(target, within, checkIntervalSeconds, maxTimeSeconds);
        let retryCount = retries;
        while ((retryCount-- > 0) && !success && this.acquisitionRunning) {
          // console.log('   Unable to cool to desired temperature, waiting to try again');
          // console.log(`   ${retryCount} retries left`);
          // console.log(`   delaying ${retryDelaySeconds} seconds`);
          await this.delay(retryDelaySeconds * milliseconds);
          // console.log('   Delay done, trying again');
          if (this.acquisitionRunning) success = await this.oneCoolingAttempt(target, within, checkIntervalSeconds, maxTimeSeconds);
        }
        shouldAbort = !success;
        resolve(shouldAbort);
      } catch (err) {
        reject(err);
      }
    });
  }

  //  Take one attempt at cooling the camera to the target within the given time.
  //  Return a success indicator
  private async oneCoolingAttempt(target: number, within: number, checkIntervalSeconds: number, maxTimeSeconds: number): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      let success: boolean = false;

      //  Set up a time limit for how long we'll wait
      const giveUpTime: Date = new Date(new Date().getTime() + (maxTimeSeconds * milliseconds));
      console.log(`It is ${new Date()}, will try cooling until ${giveUpTime}`);

      try {
        //  Start the camera cooling
        await this.communicationService.setCooling(true, target);

        //  Loop to check it at regular intervals until temperature reached or time expired
        while (new Date() < giveUpTime && !success && this.acquisitionRunning) {
          console.log(`   Waiting ${checkIntervalSeconds} seconds before checking temperature`);
          await this.delay(checkIntervalSeconds * milliseconds);
          if (this.acquisitionRunning) {
            //  Get temperature from camera and see if we have reached target
            const cameraTemperature: number = await this.communicationService.getTemperature();
            this.consoleMessageCallback!(`Camera temperature is ${cameraTemperature}.`, 2);
            console.log(`   Camera reports temperature is ${cameraTemperature}`);
            success = this.tempWithinTolerance(cameraTemperature, target, within);
            console.log(`   This is ${success ? '' : 'not'} within the given tolerance`);
          }
        }
        //  If we didn't reach the target, turn of cooling while we wait to retry
        if (!success) {
          await this.communicationService.setCooling(false, 0);
        }
        //  Success if we reached the target temperature.
        resolve(success);
      } catch (err) {
        reject(err);
      }
    })
  }

  //  Determine if the given temperature is close enough to the target
  private tempWithinTolerance(cameraTemperature: number, target: number, within: number): boolean {
    const difference: number = Math.abs(cameraTemperature - target);
    return difference <= within;
  }

  //  Determine if the temperature is still OK.
  //  If we're not enforcing temperature, then it's OK automatically
  //  Otherwise, get the temperature from the camera and check if it's in the acceptable range
  private temperatureOkOrIgnored(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const temperatureSettings = this.settingsService.getTemperatureControl()!;
      let resultOk: boolean = true;
      if (temperatureSettings.enabled) {
        if (temperatureSettings.abortOnRise) {
          try {
            const currentTemperature: Number = Number(await this.communicationService.getTemperature());
            const maximumBeforeAbort = Number(temperatureSettings.target) + Number(temperatureSettings.abortThreshold);
            resultOk = currentTemperature <= maximumBeforeAbort;
            if (!resultOk) {
              this.consoleMessageCallback!(`Temperature ${currentTemperature} has risen more than ${temperatureSettings.abortThreshold} above ${temperatureSettings.target}`);
            }
            // console.log(`Checking for temperature ${currentTemperature} > ${maximumBeforeAbort}: OK = ${resultOk}`);
          } catch (err) {
            console.log('temperatureOkOrIgnored failed on temperature check: ', err);
            reject(err);
          }
        }
      }
      resolve(resultOk);
    })
  }

  //  Start an interval timer to update the cooling information displayed.
  private async startCoolingTimer(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      try {
        this.coolingUpdateIntervalId = setInterval(this.coolingUpdateHandler.bind(this),
          cooling_status_update_interval_seconds * milliseconds);
        resolve();
      } catch (err) {
        // Allow it to fail - it's not critical
        console.log('startCoolingTimer failed: ', err);
      }
    })
  }

  //

  private async coolingUpdateHandler(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      try {
        // console.log('Cooling interval handler');
        if (this.setCoolingStatusCallback) {
          const coolingStatus = await this.communicationService.getCoolingStatus();
          // console.log('  Using callback to set cooling status: ', coolingStatus);
          this.setCoolingStatusCallback(coolingStatus);
        }
      } catch (err) {
        // Allow it to fail - may be unable to get cooling if busy with an image acquisition
        console.log('Cooling update timer handler failed: ', err);
      } finally {
        resolve();
      }
    })
  }
}
