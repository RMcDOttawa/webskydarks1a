import { Injectable } from '@angular/core';

//  Service to manage the actual acquisition of frames.  It spawns the web worker subtask, and provides
//  input and output feedback to the main session tab

@Injectable({
  providedIn: 'root'
})
export class AcquisitionService {
  private webWorker: Worker | null = null;

  constructor() { }

  //  Is the web worker task currently running?
  isRunning() {
    // console.log('AcquisitionService/isRunning stub');
    return this.webWorker !== null;
  }

  //  We've been asked to start the acquisition process.
  //  Set up a background task (web worker) and send it the appropriate message to get to work
  beginAcquisition() {
    console.log('AcquisitionService/beginAcquisition entered');

    //  Code copied from angular documentation
      if (typeof Worker !== 'undefined') {
        // Create a new
        this.webWorker = new Worker(new URL('../../background-task/background.worker', import.meta.url));
        this.webWorker.onmessage = (message) => {
          this.receiveMessageFromWorker(message);
        };
        this.webWorker.postMessage('Initial message to background worker');
      } else {
        // Web workers are not supported in this environment.
        alert('This browser does not support background tasks, so acquisition cannot proceed. Use a supported modern browser.');
      }
    console.log('AcquisitionService/beginAcquisition exits');
  }

  //  Background worker has sent us a message.
  //  This will be some kind of update to the acquisition process, and is parsed and reflected in the UI.

  receiveMessageFromWorker(message: MessageEvent) {
    console.log('AcquisitionService/receiveMessageFromWorker: ', message.data);
  }

  //  Cancel the background task and destroy the worker
  cancelAcquisition() {
    console.log('AcquisitionService/cancelAcquisition entered');
    if (this.webWorker) {
      this.webWorker.terminate();
      this.webWorker = null;
    }
    console.log('AcquisitionService/cancelAcquisition exits');
  }
}
