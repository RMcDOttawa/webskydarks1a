import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowEditCardComponent } from './row-edit-card.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatDialogRefMock} from "../../../testingMocks/MatDialogRefMock";
import {MAT_DIALOG_DATA_MOCK} from "../../../testingMocks/MAT_DIALOG_DATA_MOCK";
import {MockComponent, MockDirective} from "ng-mocks";
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatFormField} from "@angular/material/form-field";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {FormGroup} from "@angular/forms";

describe('RowEditCardComponent', () => {
  let component: RowEditCardComponent;
  let fixture: ComponentFixture<RowEditCardComponent>;
  let formGroup: FormGroup;

  //  We depend on a responsive frameplan service
  const mockFramePlanService = jasmine.createSpyObj("FramePlanService",
    ["updateFrameSet", "addNewFrameSet"]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RowEditCardComponent,
        MockDirective(MatCardTitle),
        MockDirective(MatCardContent),
        MockDirective(MatCardActions),
        MockDirective(MatRadioGroup),
      ],
      providers: [
        {provide: MatDialogRef, useClass: MatDialogRefMock},
        {provide: MAT_DIALOG_DATA, useClass: MAT_DIALOG_DATA_MOCK},
      ],
      imports: [
        MockComponent(MatCard),
        MockComponent(MatCheckbox),
        MockComponent(MatFormField),
        MockComponent(MatRadioButton),
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    formGroup = component.formGroup;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //  ***** Validate quantity control

  it('Should fail if #frames is left empty', () => {
    const quantityControl = formGroup.get('quantityControl');
    quantityControl?.setValue('');
    expect(formGroup.valid).toBeFalsy();
  });

  it('Should validate if #frames is an integer >= 1', () => {
    const quantityControl = formGroup.get('quantityControl');
    quantityControl?.setValue('16');
    expect(formGroup.valid).toBeTruthy();
  });

  it('Should fail if #frames is an integer < 1', () => {
    const quantityControl = formGroup.get('quantityControl');
    quantityControl?.setValue('0');
    expect(formGroup.valid).toBeFalsy();
  });

  it('Should fail if #frames is not a number', () => {
    const quantityControl = formGroup.get('quantityControl');
    quantityControl?.setValue('not a number');
    expect(formGroup.valid).toBeFalsy();
  });

  it('Should fail if #frames is a number but not an integer', () => {
    const quantityControl = formGroup.get('quantityControl');
    quantityControl?.setValue('12.34');
    expect(formGroup.valid).toBeFalsy();
  });

  //  We won't bother validating the binning field, as the validation is identical to quantity field
  //  Same withthe completed control

  //  Exposure control requires validation because it is different - it can be any number, including floating point

  it('Should fail if exposure is left empty', () => {
    const exposureControl = formGroup.get('exposureControl');
    exposureControl?.setValue('');
    expect(formGroup.valid).toBeFalsy();
  });

  it('Should validate if exposure is an integer >= 1', () => {
    const exposureControl = formGroup.get('exposureControl');
    exposureControl?.setValue('16');
    expect(formGroup.valid).toBeTruthy();
  });

  it('Should validate if exposure is floating point number', () => {
    const exposureControl = formGroup.get('exposureControl');
    exposureControl?.setValue('3.14159');
    expect(formGroup.valid).toBeTruthy();
  });

  it('Should fail if exposure is not a number', () => {
    const exposureControl = formGroup.get('exposureControl');
    exposureControl?.setValue('not a number');
    expect(formGroup.valid).toBeFalsy();
  });

});
