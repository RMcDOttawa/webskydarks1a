import { Injectable } from '@angular/core';
import {DarkFrameSet} from "../types";
import {SettingsService} from "./settings.service";
import {fakeFrameSets} from "../main-tab-sections/frames-plan/fake-frames-plan-data";

//  The complete plan of what we need to acquire, and how far along we are in doing so

export interface FramePlanType {
  frameSets: DarkFrameSet[];
  currentSet: number;
}

@Injectable({
  providedIn: 'root'
})
export class FramePlanService {

  frameSets: DarkFrameSet[];
  currentSet: number;

  //  Construct a FramePlanService, taking the set and cursor, or defaulting to empty
  constructor(
    private settingsService: SettingsService,
  ) {
    this.frameSets = [];
    this.currentSet = -1;
  }

  //  Return the frame set array for use in driving a table
  public getFrameSets(): DarkFrameSet[] {
    return this.frameSets;
  }

  //  Load the frames plan saved in settings or, if there is none, an empty plan

  loadFramePlanFromStore() {
    const loadedPlan: FramePlanType | null = this.settingsService.getFramePlan();
    if (loadedPlan === null) {
      //  There is no stored set, so initialize an empty one
      this.frameSets = [];
      this.currentSet = -1;
    } else {
      //  Load the data from the stored set
      this.frameSets = loadedPlan.frameSets;
      this.currentSet = loadedPlan.currentSet;
    }

  }


  /*** The following methods are used only for testing - the events that invoke them will be hidden for prod ***/

  //  Put fake data into the frame plan, and the browser storage
  storeFakeData() {
    this.frameSets = fakeFrameSets;
    this.currentSet = 2;
    this.settingsService.setFramePlan({frameSets: this.frameSets, currentSet: this.currentSet});
  }

  //  Set the frame plan to empty (no frame sets).  Update the stored version so it exists but is empty.
  deleteAllFrameSets() {
    this.frameSets = [];
    this.currentSet = -1;
    this.settingsService.setFramePlan({frameSets: this.frameSets, currentSet: this.currentSet});
  }

  //  Delete the browser stored frame plan entirely, so next run discovers nothing is stored
  deleteStoredPlan() {
    this.frameSets = [];
    this.currentSet = -1;
    this.settingsService.deleteFramePlan();
  }
}
