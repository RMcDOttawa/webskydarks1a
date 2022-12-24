import {Component, OnInit} from '@angular/core';
import {fakeFramesPlanData} from "./fake-frames-plan-data";
import {DarkFrame, DarkFrameSet, DarkFrameType, FramePlan} from "../../types";

@Component({
  selector: 'app-frames-plan',
  templateUrl: './frames-plan.component.html',
  styleUrls: ['./frames-plan.component.css']
})
export class FramesPlanComponent implements OnInit {
  private framePlan: FramePlan = fakeFramesPlanData;
  // private framePlan: FramePlan = fakeFramesPlanData;  //  Plan being displayed and maintained by this page
  constructor() {
  }

  ngOnInit(): void {
  }

}
