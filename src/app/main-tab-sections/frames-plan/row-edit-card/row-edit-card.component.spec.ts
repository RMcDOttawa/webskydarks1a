import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowEditCardComponent } from './row-edit-card.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatDialogRefMock} from "../../../testingMocks/MatDialogRefMock";
import {mat_dialog_data_mock} from "../../../testingMocks/MatDialogDataMock";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {FormControl} from "@angular/forms";

describe('RowEditCardComponent', () => {
  let component: RowEditCardComponent;
  let fixture: ComponentFixture<RowEditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RowEditCardComponent,
      ],
      providers: [
        { //  Allow object being tested to think it's injecting a MatDialog
          provide: MatDialogRef,
          useClass: MatDialogRefMock
        },
        { // MAT_DIALOG_DATA
          provide: MAT_DIALOG_DATA,
          useValue: mat_dialog_data_mock,
        }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
