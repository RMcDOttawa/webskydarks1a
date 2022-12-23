import { Injectable } from '@angular/core';

//
//  Service abstraction for storing and retrieving key-value pairs in local browser storage
//

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  //  Get string stored for given key
  public get(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  //  Set string value of given key
  public set(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }
}
