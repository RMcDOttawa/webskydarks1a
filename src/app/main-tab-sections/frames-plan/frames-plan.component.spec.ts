import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FramesPlanComponent } from './frames-plan.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatDialogMock} from "../../testingMocks/MatDialogMock";
import {MatIcon} from "@angular/material/icon";
import {MockComponent, MockDirective} from "ng-mocks";
import {MatHeaderRowDef, MatRowDef, MatTableDataSource} from "@angular/material/table";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('FramesPlanComponent', () => {
  let component: FramesPlanComponent;
  let fixture: ComponentFixture<FramesPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FramesPlanComponent,
        MockDirective(MatHeaderRowDef),
        MockDirective(MatRowDef),
      ],
      providers: [
        {provide: MatDialog, useClass: MatDialogMock}
      ],
      imports: [
        MockComponent(MatIcon),
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
