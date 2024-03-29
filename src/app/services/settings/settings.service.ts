import {Injectable} from '@angular/core';
import {LocalStorageService} from "../local-storage/local-storage.service";
import {FramePlanType} from "../frame-plan/frame-plan.service";
import {ServerCoordinates, SessionEnd, SessionStart, TemperatureControl} from "../../types";

//  Service to store application settings, abstracting away how that is done.
//  All settings are set and retrieved through public methods in this service.

//  Settings can be any object that can be converted to string-json

const testSettingKey = 'WebSkyDarks test setting key do not use';
const selectedMainTabKey = 'WebSkyDarks selected main tab';
const framePlanKey = 'WebSkyDarks frame plan';
const serverCoordsKey = 'WebSkyDarks Server Coordinates';
const serverHttpsKey = 'Server HTTPS';
const sessionStartKey = 'Session Start';
const sessionEndKey = 'Session End';
const temperatureControlKey = 'Temperature Control';

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

  //  The frame plan - list of frames sets wanted
  setFramePlan(framePlan: FramePlanType) {
    this.localStorage.setObject(framePlanKey, framePlan);
  }

  public getFramePlan(): FramePlanType | null {
    return this.localStorage.getObject(framePlanKey);
  }

  deleteFramePlan() {
    this.localStorage.delete(framePlanKey);
  }

  //  The server address and port
  public setServerAddressAndPort(address: string, port: number) {
    const settingsObject: ServerCoordinates = {
      address: address,
      port: port
    };
    this.localStorage.setObject(serverCoordsKey, settingsObject);
  }

  public getServerAddressAndPort(): ServerCoordinates | null {
    return this.localStorage.getObject(serverCoordsKey);

  }

  //  Whether the server is using HTTPS
  getServerHttps(): boolean {
    const retrieved = this.localStorage.getString(serverHttpsKey);
    if (retrieved === null) return false;
    return retrieved.toLowerCase() === 'true';
  }

  setServerHttps(useHttps: boolean) {
    this.localStorage.setString(serverHttpsKey, String(useHttps));
  }

  //  When should the acquisition session start?
  getSessionStart(): SessionStart | null {
    return this.localStorage.getObject(sessionStartKey);
  }

  setSessionStart(startSpecs: SessionStart) {
    this.localStorage.setObject(sessionStartKey, startSpecs);
  }
  //  When should the acquisition session end?
  getSessionEnd(): SessionEnd | null {
    return this.localStorage.getObject(sessionEndKey);
  }

  setSessionEnd(startSpecs: SessionEnd) {
    this.localStorage.setObject(sessionEndKey, startSpecs);
  }

  //  Information about temperature control
  getTemperatureControl(): TemperatureControl | null {
    return this.localStorage.getObject(temperatureControlKey);
  }

  setTemperatureControl(temperatureSpecs: TemperatureControl) {
    this.localStorage.setObject(temperatureControlKey, temperatureSpecs);
  }
}
