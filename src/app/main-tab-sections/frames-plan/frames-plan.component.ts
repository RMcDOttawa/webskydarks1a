import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {DarkFrameSet, DarkFrameType} from "../../types";
import {FramePlanService} from "../../services/frame-plan/frame-plan.service";
import {MatDialog} from "@angular/material/dialog";
import {RowEditCardComponent} from "./row-edit-card/row-edit-card.component";
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from "@angular/material/checkbox";
import {BulkAddFormComponent} from "./bulk-add-form/bulk-add-form.component";
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from "../../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-frames-plan',
  templateUrl: './frames-plan.component.html',
  styleUrls: ['./frames-plan.component.css'],
  providers: [
    //  Arrange that the selection checkbox doesn't have its built-in function of toggling itself when clicked.
    //  Instead, we will intercept a click anywhere in the row and use that to set the selection
    {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: {clickAction: 'noop'}}
  ]
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
    private framePlanService: FramePlanService,
    private dialog: MatDialog,
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

  //  The checkbox in the title bar has been clicked.  Toggle all boxes on or off,
  //  depending on the state this one has received.  We'll count the on and off boxes and
  //  assume the minority value is the one to be toggled.
  selectOrDeselectAll() {
    if (this.checkedItems.length > 0) {
      const numSelected = this.numSelected();
      const currentMajority = (numSelected / this.checkedItems.length) > 0.5;
      const toggledValue = !currentMajority;
      // Reflect the check visually on the table
      for (let index = 0; index < this.checkedItems.length; index++) {
        this.checkedItems[index] = toggledValue;
      }
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
  // checkboxChanged(frameSet: DarkFrameSet) {
  //   const id = frameSet.id;
  //   const itemIndex = this.framePlanService.findIndexById(id);
  //   if (itemIndex >= 0) {
  //     this.checkedItems[itemIndex] = !this.checkedItems[itemIndex];
  //   }
  // }

  //  A row has been clicked.  Change the selected row to this one.  If the Shift key is down,
  //  toggle the selection of this row but leave the others as they are (so shift-click can add to
  //  a multi-selection, or remove an item from it)

  rowClicked(frameSet: DarkFrameSet, event: MouseEvent) {
    const id = frameSet.id;
    const itemIndex = this.framePlanService.findIndexById(id);
    // console.log(`Clicked row ${itemIndex}, id ${id}, shift=${event.shiftKey}`);
    if (itemIndex >= 0) {
      if (event.shiftKey) {
        //  Shift-click toggles the selection state of this item
        this.checkedItems[itemIndex] = !this.checkedItems[itemIndex];
      } else {
        //  Click without shift sets the selection to just this item
        this.checkedItems = this.makeCheckedArray(this.frameSetsToDisplay.length);
        this.checkedItems[itemIndex] = true;
      }
    }
  }

  //  A row has been double-clicked.
  //  If this is the only row selected, this is equivalent to the "Edit" button.
  rowDoubleClicked(frameSet: DarkFrameSet) {
    const id = frameSet.id;
    const itemIndex = this.framePlanService.findIndexById(id);
    // console.log(`Double-Clicked row ${itemIndex}, id ${id}`);
    if (this.numSelected() == 1) {
      this.openEditDialog();
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

  //  Exactly one row is selected, and it is known not to be the first row.
  //  Move it one index left (toward zero) in the array, shifting the other values right to make room
  moveSelectedUp() {
    const selectedIndices = this.getSelectedIndices();
    if (selectedIndices.length === 1 && selectedIndices[0] > 0) {
      const selectedIndex = selectedIndices[0];
      //  Move the actual data
      this.framePlanService.moveFrameSetAtIndex(selectedIndex, -1);
      this.frameSetsToDisplay = this.framePlanService.getFrameSets();
      //  Move the selection checkmark
      this.checkedItems[selectedIndex] = false;
      this.checkedItems[selectedIndex - 1] = true;
      //  Trigger update
      this.dataSource = new MatTableDataSource<DarkFrameSet>(this.frameSetsToDisplay);
    } else {
      alert('Internal error detected in moveSelectedUp - selected rows not valid');
    }
  }

  //  Exactly one row is selected, and it is known not to be the last row.
  //  Move it one index right (away from zero) in the array, shifting the other values left to make room
  moveSelectedDown() {
    const selectedIndices = this.getSelectedIndices();
    if (selectedIndices.length === 1 && selectedIndices[0] < this.checkedItems.length) {
      const selectedIndex = selectedIndices[0];
      this.framePlanService.moveFrameSetAtIndex(selectedIndex, +1);
      this.frameSetsToDisplay = this.framePlanService.getFrameSets();
      //  Move the selection checkmark
      this.checkedItems[selectedIndex] = false;
      this.checkedItems[selectedIndex + 1] = true;
      //  Trigger update
      this.dataSource = new MatTableDataSource<DarkFrameSet>(this.frameSetsToDisplay);
    } else {
      alert('Internal error detected in moveSelectedDown - selected rows not valid');
    }
  }

  //  Reset the "completed count" of all the frame sets to zero
  resetCompletedCounts() {
    const dialogData = new ConfirmationDialogModel("Confirm Reset",
      "Resetting means your next collection session will start over from scratch. Are you sure?",
      "Cancel", "Reset Counts");
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,
      {maxWidth: "400px",
      data: dialogData});

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.framePlanService.resetCompletedCounts();
        this.frameSetsToDisplay = this.framePlanService.getFrameSets();
      }
    });

    // this.framePlanService.resetCompletedCounts();
    // this.frameSetsToDisplay = this.framePlanService.getFrameSets();
  }


  //  Open a modal dialog in which user can edit the details of the selected frame set
  openEditDialog() {
    const selectedIndices = this.getSelectedIndices();
    if (selectedIndices.length === 1) {
      //  Get the selected frame set
      const selectedIndex = selectedIndices[0];

      //  Open an edit dialog with this frame set as data
      const dialogRef = this.dialog.open(RowEditCardComponent, {
        width: '250px',
        data: {
          'edit': true,
          'frameSet': this.frameSetsToDisplay[selectedIndex],
          'selectedRow': selectedIndex,  //  Used only for NEW items
          'refreshCallback': () => {
            this.frameSetsToDisplay = this.framePlanService.getFrameSets();
            this.dataSource = new MatTableDataSource<DarkFrameSet>(this.frameSetsToDisplay);
          }
        }
      });
    } else {
      alert('Internal error detected in openEditDialog - selected rows not valid');
    }
  }

  // Open a modal dialog used to enter a new frame set.  The same dialog as Edit is used - a few parameters
  //  are changed to reflect that this is a new entry, not an edit.  the selected row index, if one is
  //  selected, is passed in so that the new item can be inserted at that point
  openAddNewDialog() {
    const selectedIndices = this.getSelectedIndices();
    if (selectedIndices.length < 2) {
      const selectedIndex = (selectedIndices.length == 1) ? selectedIndices[0] : -1;
      const dialogRef = this.dialog.open(RowEditCardComponent, {
        width: '250px',
        data: {
          'edit': false,  //Tell component this is a new item
          'frameSet': { //  Defaults for new frame set
            id: -1, numberWanted: 16, numberCaptured: 0,
            frameSpec: {
              frameType: DarkFrameType.darkFrame,
              binning: 1,
              exposure: 60
            }
          },
          'selectedRow': selectedIndex,  //  Used only for NEW items
          'refreshCallback': () => {
            this.frameSetsToDisplay = this.framePlanService.getFrameSets();
            this.dataSource = new MatTableDataSource<DarkFrameSet>(this.frameSetsToDisplay);
          }
        }
      });
    }
  }

  //  Bulk-Add button has been clicked.  Open the dialog to add multiple frames in a pattern.
  openBulkAddDialog() {
    const dialogRef = this.dialog.open(BulkAddFormComponent, {
      // width: '250px',
      data: {
        'refreshCallback': () => {
          this.frameSetsToDisplay = this.framePlanService.getFrameSets();
          this.dataSource = new MatTableDataSource<DarkFrameSet>(this.frameSetsToDisplay);
        }
      }
    });
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
