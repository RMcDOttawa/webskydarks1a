import { Injectable } from '@angular/core';

//
//  Service abstraction for storing and retrieving key-value pairs in local browser storage
//

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  //  Set string value of given key
  public setString(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  //  Set arbitrary object value for a given key (json stringify it to a string)
  public setObject(key: string, value: any): void {
    const objectAsString = JSON.stringify(value);
    this.setString(key, objectAsString);
  }

  //  Get string stored for given key
  public getString(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  //  Get arbitrary object stored for given key
  //  We assume the object has been stored as a JSON string
  public getObject(key: string): any {
    const retrievedString = this.getString(key);
    if (retrievedString === null) return null;
    const rebuiltObject = JSON.parse(retrievedString);
    return rebuiltObject;
  }
}
