import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  const testKey = 'testKey';
  const testValue = 'Arbitrary string to test service';
  const nonExistentKey = 'ensure this key is never used to store something';

  const testObjectKey = 'testObjectKey';
  const testObject: string[] = ['test', 'object', 'to', 'store', 'as', 'json'];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store a value successfully', () => {
    window.localStorage.removeItem(testKey);  // Ensure it's not there

    service.setString(testKey, testValue);

    expect(window.localStorage.getItem(testKey)).toEqual(testValue);
  });

  it('should retrieve a stored value successfully', () => {
    window.localStorage.removeItem(testKey);  // Ensure it's not there
    window.localStorage.setItem(testKey, testValue);

    const retrieved = service.getString(testKey);

    expect(retrieved).toEqual(testValue);
  });

  it('should return null for a non-existent key', () => {

    const retrieved = service.getString(nonExistentKey);

    expect(retrieved).toBeNull();
  });

  it('should store a complex object as a json string', () => {
    const jsonConversion = JSON.stringify(testObject);
    window.localStorage.removeItem(testObjectKey);  // Ensure it's not there

    //  Store it
    service.setObject(testObjectKey, testObject);

    //  Confirm json was stored
    expect(window.localStorage.getItem(testObjectKey)).toEqual(jsonConversion);

  });

  it('should retrieve a stored complex object', () => {
    //  Manually store the json for the object
    const jsonConversion = JSON.stringify(testObject);
    window.localStorage.removeItem(testObjectKey);  // Ensure it's not there
    window.localStorage.setItem(testObjectKey, jsonConversion);

    //  Retrieve the object
    const retrievedObject = service.getObject(testObjectKey);
    expect(retrievedObject).toEqual(testObject);

  })


});
