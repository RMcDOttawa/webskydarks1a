import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpFramesPlanComponent } from './help-frames-plan.component';
import {MockComponent} from "ng-mocks";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";

describe('HelpFramesPlanComponent', () => {
  let component: HelpFramesPlanComponent;
  let fixture: ComponentFixture<HelpFramesPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HelpFramesPlanComponent,
      ],
      imports: [
        MockComponent(MatToolbar),
        MockComponent(MatIcon),
      ]
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
