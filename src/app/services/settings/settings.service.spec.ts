import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //  Store and retrieve a string
  it('should store and retrieve a test string', () => {
    const testString = 'string to store in service test method';
    service.setTestSetting(testString);
    const retrieved = service.getTestSetting();
    expect(retrieved).toEqual(testString);
  });

  //  Store and retrieve a complex object
  it('should store and retrieve a complex test object', () => {
    const testObject = {
      description: 'string to store in service test method',
      someNumbers: [1, 2, 3, 4, 5]
    };
    service.setTestSetting(testObject);
    const retrieved = service.getTestSetting();
    expect(retrieved).toEqual(testObject);
  });

});
