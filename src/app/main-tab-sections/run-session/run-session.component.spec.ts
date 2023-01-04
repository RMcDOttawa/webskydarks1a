import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunSessionComponent } from './run-session.component';
import {MockComponent, MockDirective} from "ng-mocks";
import {MatCardActions} from "@angular/material/card";
import {CameraAutosaveComponent} from "./camera-autosave/camera-autosave.component";
import {ConsoleLogComponent} from "./console-log/console-log.component";
import {AcquisitionListComponent} from "./acquisition-list/acquisition-list.component";

describe('RunSessionComponent', () => {
  let component: RunSessionComponent;
  let fixture: ComponentFixture<RunSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RunSessionComponent,
        MockDirective(MatCardActions),
      ],
      imports: [
        MockComponent(CameraAutosaveComponent),
        MockComponent(ConsoleLogComponent),
        MockComponent(AcquisitionListComponent),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
