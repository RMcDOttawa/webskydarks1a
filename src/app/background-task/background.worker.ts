//noinspection
/// <reference lib="webworker" />

import {WebWorkerCommand, WebWorkerMessage, WebWorkerResponse, WebWorkerResponseMessage} from "../types";

addEventListener('message', messageListener);

let fakeConsoleTimerId:  ReturnType<typeof setInterval> | null  = null;
let fakeConsoleSequence = 0;

// noinspection PointlessArithmeticExpressionJS
const fakeConsoleInterval = 3 * 1000;

function messageListener (message: any)  {
  const incomingMessage = message.data as WebWorkerMessage;
  // console.log('background worker message event listener received: ', incomingMessage);
  switch (incomingMessage.command) {
    case WebWorkerCommand.start:
      startCommand();
      break;
    case WebWorkerCommand.shutdown:
      shutdownCommand();
      break;
    default:
      console.error('Unexpected command to web worker: ', incomingMessage.command);
  }
}

//  Specific commands we can receive

function startCommand() {
  // console.log("WebWorker received a Start command");
  const responseMessage: WebWorkerResponseMessage = {
    command: WebWorkerResponse.debugMessage,
    payload: 'WebWorker acknowledges receiving a Start command'
  };
  postMessage(responseMessage);

  // For testing, we set up a repeating task to send a fake console line
  fakeConsoleTimerId = setInterval(() => {
    fakeConsoleSequence++;
    const responseMessage: WebWorkerResponseMessage = {
      command: WebWorkerResponse.fakeConsoleResponse,
      payload: `Fake console message ${fakeConsoleSequence}`
    };
    postMessage(responseMessage);
  }, fakeConsoleInterval)
}

function shutdownCommand() {
  // console.log("WebWorker received a Shutdown command");
  const responseMessage: WebWorkerResponseMessage = {
    command: WebWorkerResponse.debugMessage,
    payload: 'WebWorker acknowledges receiving a Shutdown command'
  };
  postMessage(responseMessage);

  //  Shut down the repeating fake console timer
  if (fakeConsoleTimerId) {
    clearInterval(fakeConsoleTimerId);
  }

  //  Removing event listeners allows a more complete shutdown and memory free-up
  removeEventListener('message', messageListener);

}


//  Various listeners to detect conditions while developing and testing
//  Comment these out when development done, since we're not bothering to fully encapsulate them
//  in functions and remove them on shutdown

addEventListener('error', (error) => {
  console.log('background worker error event listener received: ', error);
});

addEventListener('messageerror', (error) => {
  console.log('background worker messageerror event listener received: ', error);
});

addEventListener('rejectionhandled', (error) => {
  console.log('background worker rejectionhandled event listener received: ', error);
});

addEventListener('unhandledrejection', (error) => {
  console.log('background worker unhandledrejection event listener received: ', error);
});
