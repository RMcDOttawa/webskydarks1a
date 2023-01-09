import {Component, Input, OnInit} from '@angular/core';
import {FramePlanService} from "../../../services/frame-plan/frame-plan.service";
import {DarkFrameSet} from "../../../types";

@Component({
  selector: 'app-acquisition-list',
  templateUrl: './acquisition-list.component.html',
  styleUrls: ['./acquisition-list.component.css']
})
export class AcquisitionListComponent implements OnInit {

  framesList: DarkFrameSet[] = [];
  @Input() indexInProgress: number = -1;

  constructor(public framePlanService: FramePlanService) { }

  ngOnInit(): void {
    this.framesList = this.framePlanService.getFrameSets();
  }

  //  determine if the frameset of given ID is complete (# wanted = # completed)
  setIsComplete(id: number): boolean {
    const index: number = this.framePlanService.findIndexById(id);
    return this.framesList[index].numberCaptured >= this.framesList[index].numberWanted;
  }

  //  Determine if a given frameset is the one we are currently working on.
  setInProgress(id: number): boolean {
    const index: number = this.framePlanService.findIndexById(id);
    // console.log(`AcquisitionListComponent/setInProgress. id ${id}, index ${index}, inprogress ${this.indexInProgress}`)
    return index === this.indexInProgress;
  }
}
