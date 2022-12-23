import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  const testKey = 'testKey';
  const testValue = 'Arbitrary string to test service';
  const nonExistentKey = 'ensure this key is never used to store something';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store a value successfully', () => {
    window.localStorage.removeItem(testKey);  // Ensure it's not there

    service.set(testKey, testValue);

    expect(window.localStorage.getItem(testKey)).toEqual(testValue);
  });

  it('should retrieve a stored value successfully', () => {
    window.localStorage.removeItem(testKey);  // Ensure it's not there
    window.localStorage.setItem(testKey, testValue);

    const retrieved = service.get(testKey);

    expect(retrieved).toEqual(testValue);
  });

  it('should return null for a non-existent key', () => {

    const retrieved = service.get(nonExistentKey);

    expect(retrieved).toBeNull();
  });

});
