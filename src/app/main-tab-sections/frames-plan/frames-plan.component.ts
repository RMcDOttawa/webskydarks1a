import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {DarkFrameSet} from "../../types";
import {FramePlanService} from "../../services/frame-plan.service";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'app-frames-plan',
  templateUrl: './frames-plan.component.html',
  styleUrls: ['./frames-plan.component.css']
})
export class FramesPlanComponent implements OnInit {

  //  Info to reflect the framePlan on the table on the html page
  elementData: {id: number, quantity: number, frameType: string, exposure: number, binning: number, complete: number} [] = [];
  displayedColumns: string[] = ['id', 'quantity', 'frameType', 'exposure', 'binning', 'complete'];
  dataSource!:MatTableDataSource<DarkFrameSet>;

  //  We will record the ID of the selected row, if any.   IDs are positive numbers, so we use -1 for none.
  // public selectedId: number = -1;

  constructor(
    private framePlanService: FramePlanService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.framePlanService.loadFramePlanFromStore();
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.framePlanService.getFrameSets());
  }

  //  Development-only methods to load and clear fake data into the browser store

  //  "Store Fake Data" button has been clicked.  Write the fake data into the browser store,
  //  so it is available to be loaded into the table
  storeFakeData() {
    this.framePlanService.storeFakeData();
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.framePlanService.getFrameSets());
  }

  //  "Empty fake data" button clicked.  We'll delete all the frame sets in the fake data, but leave the (empty)
  //  plan in the browser store
  emptyFakeData() {
    this.framePlanService.deleteAllFrameSets();
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.framePlanService.getFrameSets());
  }

  //  "Delete fake data" button clicked.  Delete all the frame sets, and delete the plan from the
  //  browser store
  deleteFakeData() {
    this.framePlanService.deleteStoredPlan();
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.framePlanService.getFrameSets());
  }

}
