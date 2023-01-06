import {Component, OnInit} from '@angular/core';
import {AcquisitionService} from "../../services/acquisition-service/acquisition.service";
import {ServerCommunicationService} from "../../services/server-communication/server-communication.service";
import {FramePlanService} from "../../services/frame-plan/frame-plan.service";

@Component({
  selector: 'app-run-session',
  templateUrl: './run-session.component.html',
  styleUrls: ['./run-session.component.css']
})
export class RunSessionComponent implements OnInit {

  //  String contents of console are constructed here and passed to the console component to display
  public consoleContents: string = '';

  constructor(
    private acquisitionService: AcquisitionService,
    private communicationService: ServerCommunicationService,
    private framePlanService: FramePlanService
  ) {
  }

  ngOnInit(): void {
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
    this.acquisitionService.beginAcquisition(this.consoleMessage.bind(this));
  }

  //  Cancel Acquisition button has been clicked.
  cancelAcquisition() {
    // console.log('Run-Session component Cancelling acquisition');
    this.acquisitionService.cancelAcquisition();
  }

  //  Callback function from the acquisition service when it has something to display on console
  consoleMessage(message: string): void {
    this.consoleContents = this.consoleContents + this.timestampMessage(message) + '<br>';
  }

  private timestampMessage(message: string): string {
    const formattedTime = (new Date()).toLocaleTimeString('en-US', {hour12: false});
    return formattedTime + ' ' + message;
    // const formattedTime = (new Date()).toLocaleTimeString();
    // const partsOfFormattedTime = formattedTime.split(' ');
    // return partsOfFormattedTime[0] + ' ' + message;
  }
}
