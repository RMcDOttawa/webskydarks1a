import {TestBed} from '@angular/core/testing';

import {FramePlanService} from './frame-plan.service';
import {SettingsService} from "../settings/settings.service";
import {fakeFrameSets} from "./fake-frames-plan-data";
import {DarkFrameSet, DarkFrameType} from "../../types";
import {MockComponent} from "ng-mocks";
import {MatIcon} from "@angular/material/icon";

describe('FramePlanService', () => {
  let service: FramePlanService;
  let settingsServiceSpy: any;
  let settingsServiceMock: any;

  beforeEach(() => {

    //  Set up a mock settings service that returns useable responses
    settingsServiceMock = jasmine.createSpyObj('SettingsService',
      {
        'getFramePlan': {frameSets: fakeFrameSets},
        'setFramePlan': null,
      });
    // settingsServiceMock.getFramePlan.and.returnValue({frameSets: fakeFrameSets});

    TestBed.configureTestingModule({
      imports: [
        MockComponent(MatIcon),
      ],
      providers: [
        FramePlanService,
        {provide: SettingsService, useValue: settingsServiceMock},
      ]
    });

    service = TestBed.inject(FramePlanService);
    settingsServiceSpy = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should set empty frameset on construction', () => {
    expect(service.frameSets).toBeDefined();
    expect(service.frameSets.length).toEqual(0);
    expect(service.frameSets).toEqual([]);
  });

  it('Should load dark frames from service when loadFramePlanFromStore called', () => {
    service.loadFramePlanFromStore();
    expect(settingsServiceMock.getFramePlan).toHaveBeenCalledTimes(1);
    expect(service.frameSets.length).toBe(fakeFrameSets.length);
  });

  it ('Should find correct index of a frame, by id number', () => {
    service.loadFakeFramePlan();
    const index = service.findIndexById(3);
    expect(index).toBe(2);
  });

  it('Should report index -1 for a frame set not found', () => {
    service.loadFakeFramePlan();
    const index = service.findIndexById(1234);
    expect(index).toBe(-1);

  });

  it('Should allocate next available ID number', () => {
    service.loadFakeFramePlan();
    const nextId = service.allocateNextIdNumber();
    expect(nextId).toBe(8);
  });

  const sampleFrameSet: DarkFrameSet = {
    frameSpec: {
      frameType: DarkFrameType.biasFrame,
      binning: 4,
      exposure: 0
    },
    id: 333,
    numberWanted: 163,
    numberCaptured: 6
  };

  it('Should add one given frameset to the plan', () => {
    service.deleteAllFrameSets();
    expect(service.frameSets.length).toBe(0);
    service.addNewFrameSet(sampleFrameSet, -1);
    expect(service.frameSets.length).toBe(1);
    expect(service.frameSets[0]).toEqual(sampleFrameSet);
  });

  it('Should create multiple framesets from a bulk-add', () => {
    service.deleteAllFrameSets();
    service.bulkAdd(5, [1, 2],
      6, [3,4], [20, 30, 40]);
    expect(service.frameSets.length).toBe(2 + 2*3);
  });

  it('Can delete a frameset by ID', () => {
    service.loadFakeFramePlan();
    expect(service.findIndexById(3)).toBe(2);
    service.deleteFrameSetById(3);
    expect(service.findIndexById(3)).toBe(-1);
  });

});
