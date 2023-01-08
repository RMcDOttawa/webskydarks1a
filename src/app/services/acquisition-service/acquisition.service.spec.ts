import { TestBed } from '@angular/core/testing';

import { AcquisitionService } from './acquisition.service';
import {fakeFrameSets} from "../frame-plan/fake-frames-plan-data";
import {FramePlanService} from "../frame-plan/frame-plan.service";

describe('AcquisitionService', () => {
  let service: AcquisitionService;
  let spy: any;
  let framePlanServiceSpy: any;

  beforeEach(() => {

    //  Mock the Frame Plan service to return the fake data when asked for the frame sets
    spy = jasmine.createSpyObj('FramePlanService',
      {
        'getFrameSets': fakeFrameSets
      });

    TestBed.configureTestingModule({
      providers: [AcquisitionService,
        {provide: FramePlanService, useValue: spy}
      ]
    });

    service = TestBed.inject(AcquisitionService);
    framePlanServiceSpy = TestBed.inject(FramePlanService) as jasmine.SpyObj<FramePlanService>;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should determine correct binnings needed for fake data', () => {
    let correctAnswer: boolean[] = Array(11).fill(false);
    correctAnswer[1] = true;
    correctAnswer[2] = true;
    correctAnswer[4] = true;

    const testResult = service.determineBinningsNeeded();
    expect(framePlanServiceSpy.getFrameSets).toHaveBeenCalledTimes(1);
    expect(testResult).toEqual(correctAnswer);
  })
});
