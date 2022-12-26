import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {DarkFrameSet} from "../../types";
import {FramePlanService} from "../../services/frame-plan/frame-plan.service";
import {SettingsService} from "../../services/settings/settings.service";

@Component({
  selector: 'app-frames-plan',
  templateUrl: './frames-plan.component.html',
  styleUrls: ['./frames-plan.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FramesPlanComponent implements OnInit {

  //  Info to reflect the framePlan on the table on the html page
  displayedColumns: string[] = ['select', 'id', 'quantity', 'frameType', 'exposure', 'binning', 'complete'];
  dataSource!: MatTableDataSource<DarkFrameSet>;
  checkedItems: boolean[] = [];
  frameSetsToDisplay: DarkFrameSet[] = [];

  //  We will record the ID of the selected row, if any.   IDs are positive numbers, so we use -1 for none.
  // public selectedId: number = -1;

  constructor(
    private framePlanService: FramePlanService
  ) {
  }

  ngOnInit(): void {
    this.framePlanService.loadFramePlanFromStore();
    this.frameSetsToDisplay = this.framePlanService.getFrameSets();
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.frameSetsToDisplay);

    this.checkedItems = this.makeCheckedArray(this.frameSetsToDisplay.length);
  }

  private makeCheckedArray(length: number): boolean[] {
    return Array(length).fill(false);
  }

  selectOrDeselectAll(event: any) {
    const checked = event.checked;
    // Reflect the check visually on the table
    for (let index = 0; index < this.checkedItems.length; index++) {
      this.checkedItems[index] = checked;
    }
  }

  //  Determine if the given dark frame set should be checked.  We use the ID to get the index number then
  //  check our local "checked" array at that index.
  isChecked(frameSet: DarkFrameSet) {
    const id = frameSet.id;
    const itemIndex = this.framePlanService.findIndexById(id);
    return (itemIndex >= 0 ? this.checkedItems[itemIndex] : false);
  }

  //  A checkbox has been clicked.  Toggle the local "checked" array for that item, by getting the index
  //  via id lookup
  checkboxChanged(frameSet: DarkFrameSet) {
    const id = frameSet.id;
    const itemIndex = this.framePlanService.findIndexById(id);
    if (itemIndex >= 0) {
      this.checkedItems[itemIndex] = !this.checkedItems[itemIndex];
    }
  }

  //  Return the number of currently selected rows - this is used to enable and disable buttons
  numSelected(): number {
    return this.checkedItems.filter(Boolean).length;
  }

  //  One or more rows are selected.  Delete them from the plan.
  //  Because indexes change as we delete things, we'll work via the frame set ids, retrieving them first
  deleteSelected() {
    const selectedIds = this.getSelectedIds();
    selectedIds.forEach(id => {
      this.framePlanService.deleteFrameSetById(id)
    });
    this.frameSetsToDisplay = this.framePlanService.getFrameSets();
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.frameSetsToDisplay);
    this.checkedItems = this.makeCheckedArray(this.frameSetsToDisplay.length);
  }

  //  Get the internal ID numbers of any frames corresponding to selected checkboxes
  //  We use the index of the checkboxes and map those to framesets via the service
  private getSelectedIds(): number[] {
    let selectedIds: number[] = [];
    for (let index = 0; index < this.checkedItems.length; index++) {
      if (this.checkedItems[index]) {
        const thisFrameSet = this.framePlanService.getFrameSetByIndex(index);
        if (thisFrameSet) {
          selectedIds.push(thisFrameSet.id);
        }
      }
    }
    return selectedIds;
  }

  //  Can the selected row be moved up?  Any row except the first can be moved up, so just check index=0
  canMoveSelectedUp() {
    const selectedIndices = this.getSelectedIndices();
    //  TO be able to move this set up, none of them can be the first item (i.e. index 0)
    const positionOfZero = selectedIndices.indexOf(0);
    return (positionOfZero == -1);
  }

  //  Can the selected row be moved down?  Any row except the last can be moved up, so just check index
  canMoveSelectedDown() {
    const selectedIndices = this.getSelectedIndices();
    //  TO be able to move this set down, none of them can be the last item (i.e. n-1)
    const positionOfLast = selectedIndices.indexOf(this.checkedItems.length - 1);
    return (positionOfLast == -1);
  }

  //  Return an array of the indices of selected rows
  private getSelectedIndices() {
    //todo Find a way to do this without a for-loop.  reduce function?
    let selectedIndices: number[] = [];
    for (let index = 0; index < this.checkedItems.length; index++) {
      if (this.checkedItems[index]) {
        selectedIndices.push(index);
      }
    }
    return selectedIndices;
  }

  //  Development-only methods to load and clear fake data into the browser store

  //  "Store Fake Data" button has been clicked.  Write the fake data into the browser store,
  //  so it is available to be loaded into the table
  storeFakeData() {
    this.framePlanService.storeFakeData();
    this.frameSetsToDisplay = this.framePlanService.getFrameSets();
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.frameSetsToDisplay);
    this.checkedItems = this.makeCheckedArray(this.frameSetsToDisplay.length);
  }

  //  "Empty fake data" button clicked.  We'll delete all the frame sets in the fake data, but leave the (empty)
  //  plan in the browser store
  emptyFakeData() {
    this.framePlanService.deleteAllFrameSets();
    this.frameSetsToDisplay = this.framePlanService.getFrameSets();
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.frameSetsToDisplay);
    this.checkedItems = this.makeCheckedArray(this.frameSetsToDisplay.length);
  }

  //  "Delete fake data" button clicked.  Delete all the frame sets, and delete the plan from the
  //  browser store
  deleteFakeData() {
    this.framePlanService.deleteStoredPlan();
    this.frameSetsToDisplay = this.framePlanService.getFrameSets();
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.frameSetsToDisplay);
    this.checkedItems = this.makeCheckedArray(this.frameSetsToDisplay.length);
  }
}
