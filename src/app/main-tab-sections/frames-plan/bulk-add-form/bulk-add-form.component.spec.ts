import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAddFormComponent } from './bulk-add-form.component';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatDialogRefMock} from "../../../testingMocks/MatDialogRefMock";
import {mat_dialog_data_mock} from "../../../testingMocks/MatDialogDataMock";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('BulkAddFormComponent', () => {
  let component: BulkAddFormComponent;
  let fixture: ComponentFixture<BulkAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkAddFormComponent ],
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

    fixture = TestBed.createComponent(BulkAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
