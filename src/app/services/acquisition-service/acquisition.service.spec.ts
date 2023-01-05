import { TestBed } from '@angular/core/testing';

import { AcquisitionService } from './acquisition.service';

describe('AcquisitionService', () => {
  let service: AcquisitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcquisitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
