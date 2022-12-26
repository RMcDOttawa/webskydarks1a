import { TestBed } from '@angular/core/testing';

import { FramePlanService } from './frame-plan.service';

describe('FramePlanService', () => {
  let service: FramePlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FramePlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
