import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpFramesPlanComponent } from './help-frames-plan.component';

describe('HelpFramesPlanComponent', () => {
  let component: HelpFramesPlanComponent;
  let fixture: ComponentFixture<HelpFramesPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpFramesPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpFramesPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
