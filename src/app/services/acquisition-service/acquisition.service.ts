import {Injectable} from '@angular/core';
import {WebWorkerCommand, WebWorkerMessage, WebWorkerResponse, WebWorkerResponseMessage} from "../../types";

// noinspection PointlessArithmeticExpressionJS
const shutdownSettlingTime = 1 * 1000;  //  (1s in ms) how long to give background task to shut down before we terminate

//  Service to manage the actual acquisition of frames.  It spawns the web worker subtask, and provides
//  input and output feedback to the main session tab

@Injectable({
  providedIn: 'root'
})
export class AcquisitionService {
  private webWorker: Worker | null = null;
  private consoleMessageCallback: ((message: string) => void) | undefined;

  constructor() { }

  //  Is the web worker task currently running?
  isRunning() {
    // console.log('AcquisitionService/isRunning stub');
    return this.webWorker !== null;
  }

  //  We've been asked to start the acquisition process.
  //  Set up a background task (web worker) and send it the appropriate message to get to work
  beginAcquisition(consoleMessageCallback: (message: string) => void) {
    // console.log('AcquisitionService/beginAcquisition entered');

    //  Code copied from angular documentation
      if (typeof Worker !== 'undefined') {
        this.consoleMessageCallback = consoleMessageCallback;
        // Create a new
        this.webWorker = new Worker(new URL('../../background-task/background.worker', import.meta.url));
        this.webWorker.onmessage = (message) => {
          this.receiveMessageFromWorker(message);
        };

        //  Tell the web worker to get started with its task
        const startMessage: WebWorkerMessage = {command: WebWorkerCommand.start};
        this.webWorker.postMessage(startMessage);

      } else {
        // Web workers are not supported in this environment.
        alert('This browser does not support background tasks, so acquisition cannot proceed. Use a supported modern browser.');
      }
    // console.log('AcquisitionService/beginAcquisition exits');
  }

  //  Background worker has sent us a message.
  //  This will be some kind of update to the acquisition process, and is parsed and reflected in the UI.

  receiveMessageFromWorker(message: MessageEvent) {
    // console.log('AcquisitionService/receiveMessageFromWorker: ', message.data);
    const receivedMessage: WebWorkerResponseMessage = message.data as WebWorkerResponseMessage;
    // console.log('  Encapsulated response message: ', receivedMessage);
    switch (receivedMessage.command) {
      case WebWorkerResponse.debugMessage:
        console.log(receivedMessage.payload);
        break;
      case WebWorkerResponse.fakeConsoleResponse:
        this.fakeConsoleMessage(receivedMessage.payload);
        break;
      default:
        console.error('Unexpected response code from WebWorker: ', receivedMessage.command);
    }
  }



  //  Cancel the background task and destroy the worker
  cancelAcquisition() {
    // console.log('AcquisitionService/cancelAcquisition entered');
    if (this.webWorker) {
      //  Tell the web worker to shut down, so it has a chance to clean up before we kill it
      // console.log('Asking sub-task to shut down');
      const shutdownMessage: WebWorkerMessage = {command: WebWorkerCommand.shutdown};
      this.webWorker.postMessage(shutdownMessage);

      //  Kill the process after giving it a few seconds to stop
      setTimeout(() => {
        console.log('Killing subtask');
        this.webWorker!.terminate();
        this.webWorker = null;
      }, shutdownSettlingTime)
    }
    // console.log('AcquisitionService/cancelAcquisition exits');
  }

  //  We've received a console message string from the web worker
  //  This is used primarily in the initial debugging, to create periodic events to log
  private fakeConsoleMessage(message: string) {
    console.log('AcquisitionService/fakeConsoleMessage: ', message);
  }
}
