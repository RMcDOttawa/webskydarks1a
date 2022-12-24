import {Component, OnInit} from '@angular/core';
import {fakeFramesPlanData} from "./fake-frames-plan-data";
import {DarkFrame, DarkFrameSet, DarkFrameType, FramePlan} from "../../types";
import {MatTableDataSource} from "@angular/material/table";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'app-frames-plan',
  templateUrl: './frames-plan.component.html',
  styleUrls: ['./frames-plan.component.css']
})
export class FramesPlanComponent implements OnInit {
  //  The stored data - will later come from browser storage
  private framePlan: FramePlan = {frameSets: [], currentSet: 0};
  private emptyFrameSet = {frameSets: [], currentSet: 0};

  //  Info to reflect the framePlan on the table on the html page
  elementData: {id: number, quantity: number, frameType: string, exposure: number, binning: number, complete: number} [] = [];
  displayedColumns: string[] = ['id', 'quantity', 'frameType', 'exposure', 'binning', 'complete'];
  dataSource!:MatTableDataSource<DarkFrameSet>;

  constructor(
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    //  Load the frames plan saved in settings or, if there is none, an empty plan
    const loadedPlan = this.settingsService.getFramePlan();
    if (loadedPlan === null) {
      this.framePlan = this.emptyFrameSet;
    } else {
      this.framePlan = loadedPlan;
    }
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.framePlan.frameSets);
  }

  //  Development-only methods to load and clear fake data into the browser store

  //  "Store Fake Data" button has been clicked.  Write the fake data into the browser store,
  //  so it is available to be loaded into the table
  storeFakeData() {
    this.settingsService.setFramePlan(fakeFramesPlanData);
    this.framePlan = fakeFramesPlanData;
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.framePlan.frameSets);
  }

  emptyFakeData() {
    this.settingsService.setFramePlan(this.emptyFrameSet);
    this.framePlan = this.emptyFrameSet;
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.framePlan.frameSets);
  }

  deleteFakeData() {
    this.settingsService.deleteFramePlan();
    this.framePlan = this.emptyFrameSet;
    this.dataSource = new MatTableDataSource<DarkFrameSet>(this.framePlan.frameSets);
  }
}
