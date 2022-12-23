import { Injectable } from '@angular/core';
import {LocalStorageService} from "./local-storage.service";

//  Service to store application settings, abstracting away how that is done.
//  All settings are set and retrieved through public methods in this service.

//  Settings can be any object that can be converted to string-json

const testSettingKey = 'test setting key do not use';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private localStorage: LocalStorageService
  ) { }

  //  Store and retrieve an unused 'test' setting - for unit testing this service
  public setTestSetting(value: any): void {
    this.localStorage.setObject(testSettingKey, value);
  }
  public getTestSetting(): any {
    return this.localStorage.getObject(testSettingKey);
  }

}
