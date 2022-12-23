import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FramesPlanComponent } from './frames-plan.component';

describe('FramesPlanComponent', () => {
  let component: FramesPlanComponent;
  let fixture: ComponentFixture<FramesPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FramesPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FramesPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
