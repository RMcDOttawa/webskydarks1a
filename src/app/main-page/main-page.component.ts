import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../services/settings/settings.service";

//  The main "page" that sits below the top toolbar and contains all the application interaction.
//  It is subdivided by a tab bar into different functions

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  defaultTabIndex!: number;
  acquisitionInProgress: boolean = false;

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    const savedTabIndex = this.settingsService.getSelectedMainTab();
    this.defaultTabIndex = (savedTabIndex === null) ? 0 : savedTabIndex;
  }

  onTabIndexChanged(newIndex: number) {
    // console.log('onTabIndexChanged: ', newIndex);
    this.settingsService.setSelectedMainTab(newIndex);
  }

  //  The "run acquisition" component has sent up an event about the status of the acquisition
  receiveAcquisitionEvent(status: boolean) {
    // console.log('MainPageComponent/receiveAcquisitionEvent, status: ', status);
    this.acquisitionInProgress = status;
  }
}
