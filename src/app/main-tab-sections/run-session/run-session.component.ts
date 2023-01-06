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
    console.log('Run-Session component Starting acquisition');
    this.acquisitionService.beginAcquisition();
  }

  //  Cancel Acquisition button has been clicked.
  cancelAcquisition() {
    console.log('Run-Session component Cancelling acquisition');
    this.acquisitionService.cancelAcquisition();
  }
}
