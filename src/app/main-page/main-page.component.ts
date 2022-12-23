import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../services/settings.service";

//  The main "page" that sits below the top toolbar and contains all the application interaction.
//  It is subdivided by a tab bar into different functions

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  defaultTabIndex!: number;

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    const savedTabIndex = this.settingsService.getSelectedMainTab();
    this.defaultTabIndex = (savedTabIndex === null) ? 0 : savedTabIndex;
  }

  onTabIndexChanged(newIndex: number) {
    this.settingsService.setSelectedMainTab(newIndex);
  }

}
