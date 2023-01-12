import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartEndSpecsComponent } from './start-end-specs.component';
import {MockComponent, MockDirective} from "ng-mocks";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('StartEndSpecsComponent', () => {
  let component: StartEndSpecsComponent;
  let fixture: ComponentFixture<StartEndSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StartEndSpecsComponent,
        MockDirective(MatRadioGroup),
      ],
      imports: [
        MockComponent(MatRadioButton),
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartEndSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
