import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraAutosaveComponent } from './camera-autosave.component';

describe('CameraAutosaveComponent', () => {
  let component: CameraAutosaveComponent;
  let fixture: ComponentFixture<CameraAutosaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraAutosaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraAutosaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
