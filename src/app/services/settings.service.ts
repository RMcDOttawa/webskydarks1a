import {Injectable} from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {FramePlan} from "../types";

//  Service to store application settings, abstracting away how that is done.
//  All settings are set and retrieved through public methods in this service.

//  Settings can be any object that can be converted to string-json

const testSettingKey = 'test setting key do not use';
const selectedMainTabKey = 'selected main tab';
const framePlanKey = 'frame plan';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private localStorage: LocalStorageService
  ) {
  }

  //  Store and retrieve an unused 'test' setting - for unit testing this service
  public setTestSetting(value: any): void {
    this.localStorage.setObject(testSettingKey, value);
  }

  public getTestSetting(): any {
    return this.localStorage.getObject(testSettingKey);
  }

  //  The current tab selected on the main window (zero-origin index number)
  public setSelectedMainTab(selectedIndex: number): void {
    this.localStorage.setObject(selectedMainTabKey, selectedIndex);
  }
  public getSelectedMainTab() : number | null {
    return this.localStorage.getObject(selectedMainTabKey);
  }

  setFramePlan(framePlan: FramePlan) {
    this.localStorage.setObject(framePlanKey, framePlan);
  }

  deleteFramePlan() {
    this.localStorage.delete(framePlanKey);
  }
}
