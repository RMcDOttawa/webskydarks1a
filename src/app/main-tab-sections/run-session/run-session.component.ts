import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AcquisitionService} from "../../services/acquisition-service/acquisition.service";
import {ServerCommunicationService} from "../../services/server-communication/server-communication.service";
import {FramePlanService} from "../../services/frame-plan/frame-plan.service";

@Component({
  selector: 'app-run-session',
  templateUrl: './run-session.component.html',
  styleUrls: ['./run-session.component.css']
})
export class RunSessionComponent implements OnInit {

  //  Event to tell parent if we are busy acquiring images so it can disable other tabs.
  @Output() acquisitionEvent = new EventEmitter<boolean>();

  //  String contents of console are constructed here and passed to the console component to display
  public consoleContents: string = '';

  indexInProgress: number = -1;

  constructor(
    private acquisitionService: AcquisitionService,
    private communicationService: ServerCommunicationService,
    private framePlanService: FramePlanService
  ) {
  }

  ngOnInit(): void {
    this.acquisitionEvent.emit(false);  // Not acquiring right now
    this.indexInProgress = this.framePlanService.findIndexOfNextSetToAcquire();
  }

  //  Should the "cancel" button be enabled?
  //  Enabled only if there is an acquisition task running.
  enableCancelButton(): boolean {
    // console.log('RunSessionComponent/enableCancelButton entered');
    // console.log(`  enableCancelButton returning ${shouldEnable}`);
    return this.acquisitionService.isRunning();
  }

  //  Should the "begin" button be enabled?
  //  To be enabled:
  //    Task is not already running
  //    Frame plan must have at least 1 incomplete frameset
  //  Ideally we'd also like to enable based on the server being reachable, but that test is too
  //  expensive, so we'll leave it and let the attempt to click "begin" test that.
   enableBeginButton(): boolean {
    return (!this.acquisitionService.isRunning()) && (this.framePlanService.findIndexOfNextSetToAcquire() !== -1);
  }

  //  Begin Acquisition button has been clicked.
  beginAcquisition() {
    //  Note: bind in callback is so the callback has access to this object and its variables
    this.acquisitionEvent.emit(true);  // Tell parent we are acquiring frames
    this.acquisitionService.beginAcquisition(this.consoleMessage.bind(this),
      this.updateFrameIndex.bind(this),
      this.acquisitionFinished.bind(this));
  }

  //  Cancel Acquisition button has been clicked.
  cancelAcquisition() {
    // console.log('Run-Session component Cancelling acquisition');
    this.acquisitionService.cancelAcquisition();
    this.acquisitionEvent.emit(false);  // Tell parent we are not acquiring frames
  }

  //  Callback function from the acquisition service when it has something to display on console
  consoleMessage(message: string, indentLevel: number = 1): void {
    this.consoleContents = this.consoleContents + this.timestampMessage(message, indentLevel) + '<br>\n';
  }

  //  Callback function to be informed when acquisition is finished.
  acquisitionFinished() : void {
    // console.log('acquisitionFinished callback called');
    this.acquisitionEvent.emit(false);  // Tell parent we are not acquiring frames
    this.indexInProgress = this.framePlanService.findIndexOfNextSetToAcquire();
  }

  //  Callback to update the frame index being displayed as current
  updateFrameIndex(frameIndex: number): void {
    this.indexInProgress = frameIndex;
  }

  private timestampMessage(message: string, indentLevel: number): string {
    const formattedTime = (new Date()).toLocaleTimeString('en-US', {hour12: false});
    const leadingSpace = (indentLevel === 1) ? ' ' : '&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(indentLevel - 1);
    return formattedTime + leadingSpace + message;
    // const formattedTime = (new Date()).toLocaleTimeString();
    // const partsOfFormattedTime = formattedTime.split(' ');
    // return partsOfFormattedTime[0] + ' ' + message;
  }

  clearConsole() {
    this.consoleContents = '';
  }
}
