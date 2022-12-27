import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FramesPlanComponent } from './frames-plan.component';
import {MatDialog} from "@angular/material/dialog";
import {MatHeaderRow, MatHeaderRowDef, MatRowDef} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

describe('FramesPlanComponent', () => {
  let component: FramesPlanComponent;
  let fixture: ComponentFixture<FramesPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FramesPlanComponent,
        MatHeaderRow,
        MatHeaderRowDef,
        MatIcon,
        MatRowDef,
      ],
      providers: [
        { //  Allow object being tested to think it's creating a MatDialog
          provide: MatDialog,
          useValue: jasmine.createSpyObj('MatDialog', ['constructor']),
        }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ],
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
