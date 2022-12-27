import {Injectable} from '@angular/core';
import {DarkFrameSet} from "../../types";
import {SettingsService} from "../settings/settings.service";
import {fakeFrameSets} from "./fake-frames-plan-data";
import {max} from "rxjs";

//  The complete plan of what we need to acquire

export interface FramePlanType {
  frameSets: DarkFrameSet[];
}

@Injectable({
  providedIn: 'root'
})
export class FramePlanService {

  frameSets: DarkFrameSet[];

  //  Construct a FramePlanService, taking the set and cursor, or defaulting to empty
  constructor(
    private settingsService: SettingsService,
  ) {
    this.frameSets = [];
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
    } else {
      //  Load the data from the stored set
      this.frameSets = loadedPlan.frameSets;
    }

  }

  //  Get the array index for a given id.  -1 = not found
  findIndexById(id: number): number {
    for (let index = 0; index < this.frameSets.length; index++) {
      const frameSet = this.frameSets[index];
      if (id === frameSet.id) return index;
    }
    return -1;
  }


  /*** The following methods are used only for testing - the events that invoke them will be hidden for prod ***/

  //  Put fake data into the frame plan, and the browser storage
  storeFakeData() {
    //  Assigning fakes.  Make a copy or future edits will affect the fake set
    this.frameSets = fakeFrameSets.map((frameSet) => frameSet);
    this.settingsService.setFramePlan({frameSets: this.frameSets});
  }

  //  Set the frame plan to empty (no frame sets).  Update the stored version so it exists but is empty.
  deleteAllFrameSets() {
    this.frameSets = [];
    this.settingsService.setFramePlan({frameSets: this.frameSets});
  }

  //  Delete the browser stored frame plan entirely, so next run discovers nothing is stored
  deleteStoredPlan() {
    this.frameSets = [];
    this.settingsService.deleteFramePlan();
  }

  //  Delete the frame set with the given ID from the plan and store
  deleteFrameSetById(idToDelete: number) {
    this.frameSets.splice( this.frameSets.findIndex(fs => fs.id === idToDelete) , 1);
    this.settingsService.setFramePlan({frameSets: this.frameSets});
  }

  //  Retrieve the frame set at the given index in the array.
  //  Note: this is by array index, not by frameset ID
  getFrameSetByIndex(index: number): DarkFrameSet | null {
    if (index >= 0 && index < this.frameSets.length) {
      return this.frameSets[index];
    } else {
      return null;
    }
  }

  //  Move the frame set in the array, at the selected index, by the given amount.
  //  -1 moves it left (toward index 0), while +1 moves it right
  moveFrameSetAtIndex(index: number, increment: number) {
    let arrayWithShift = this.insertAndShift(this.frameSets, index, index + increment);
    this.frameSets = arrayWithShift;
    this.settingsService.setFramePlan({frameSets: this.frameSets});
  }

  //  Return a copy of the given array, with an element moved from the given spot to the given spot
  private insertAndShift(originalArray: DarkFrameSet[], from: number, to: number): DarkFrameSet[] {
    let arrayCopy = originalArray.map((frameSet) => frameSet);
    let cutOut = arrayCopy.splice(from, 1) [0]; // cut the element at index 'from'
    arrayCopy.splice(to, 0, cutOut);            // insert it at index 'to'
    return arrayCopy;
  }

  //  Reset all the completed counts in the plan to zero
  resetCompletedCounts() {
    this.frameSets.forEach((fs) => fs.numberCaptured = 0);
    this.settingsService.setFramePlan({frameSets: this.frameSets});
  }

  //  Update a frameset in the plan with the given frameset.  Locate it by the ID number, which hasn't changed.
  updateFrameSet(updatedFrameSet: DarkFrameSet) {
    // Find the index of this set by ID number
    const frameSetIndex = this.findIndexById(updatedFrameSet.id);
    if (frameSetIndex !== -1) {
      // Replace the entire frameset in the plan and update in storage
      this.frameSets[frameSetIndex] = updatedFrameSet;
      this.settingsService.setFramePlan({frameSets: this.frameSets});
    } else {
      console.error(`Internal error: updating frameset ID ${updatedFrameSet.id}, not in the current plan.`);
    }
  }

  //  Add the given as a new frame set.  Note that it won't have an ID number, so we find the next highest
  //  one available and set that.
  //  If selectedRow is -1, the new set goes at the end of the array.  if it is some other number, we
  //  insert it in the array at that point, shifting other values to the right to make room.
  addNewFrameSet(newFrameSet: DarkFrameSet, selectedRow: number) {
    newFrameSet.id = this.allocateNextIdNumber();
    if (selectedRow === -1) {
      //  Put this at the end of the array
      this.frameSets.push(newFrameSet);
    } else {
      //  Insert at the given point in the array
      if (selectedRow >= 0 && selectedRow < this.frameSets.length) {
        this.frameSets.splice(selectedRow, 0, newFrameSet);
      } else {
        alert(`Error in addNewFrameSet: index ${selectedRow} is out of bounds.`);
      }
    }
    this.settingsService.setFramePlan({frameSets: this.frameSets});
  }

  private allocateNextIdNumber() {
    const maximumIdFrame = this.frameSets.reduce(
      (accumulate, currentValue) => {
        return accumulate.id > currentValue.id ? accumulate : currentValue
      }
    );
    const nextIdNumber = maximumIdFrame.id + 1;
    return nextIdNumber;
  }
}
