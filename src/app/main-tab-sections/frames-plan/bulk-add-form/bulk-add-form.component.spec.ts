import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAddFormComponent } from './bulk-add-form.component';
import {MatDialogRefMock} from "../../../testingMocks/MatDialogRefMock";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA_MOCK} from "../../../testingMocks/MAT_DIALOG_DATA_MOCK";
import {MockComponent, MockDirective} from "ng-mocks";
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatFormField} from "@angular/material/form-field";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('BulkAddFormComponent', () => {
  let component: BulkAddFormComponent;
  let fixture: ComponentFixture<BulkAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BulkAddFormComponent,
        MockDirective(MatCardTitle),
        MockDirective(MatCardContent),
        MockDirective(MatCardActions),
      ],
      providers: [
        {provide: MatDialogRef, useClass: MatDialogRefMock},
        {provide: MAT_DIALOG_DATA, useClass: MAT_DIALOG_DATA_MOCK},
      ],
      imports: [
        MockComponent(MatCard),
        MockComponent(MatCheckbox),
        MockComponent(MatFormField),
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

  const arbitraryNumberOfFrames = '123';
  const validExposuresList = '20 30 50 123.45  6.   .123';
  const invalidExposuresList = '20 30 fart 50 123.45  6.   .123';

  //   ****** Test exposures field validator

  it('Should validate a good exposures list field', () => {
    const darkFormGroup = component.darkSectionGroup;

    //  Get the "number of frames" field and set it to a non-zero number
    const numFramesControl = darkFormGroup.get('numFramesControl');
    expect(numFramesControl).toBeTruthy();
    numFramesControl?.setValue(arbitraryNumberOfFrames);
    expect(numFramesControl?.value).toEqual(arbitraryNumberOfFrames);

    //  Get the exposures field and set it to a valid exposures string
    const exposureLengthsControl = darkFormGroup.get('exposureLengthsControl');
    expect(exposureLengthsControl).toBeTruthy();
    exposureLengthsControl?.setValue(validExposuresList);
    expect(exposureLengthsControl?.value).toEqual(validExposuresList);

    expect(darkFormGroup.valid).toBeTruthy();
  });

  it ('Should fail if exposures list contains bad numbers', () => {
    const darkFormGroup = component.darkSectionGroup;

    //  Get the "number of frames" field and set it to a non-zero number
    const numFramesControl = darkFormGroup.get('numFramesControl');
    numFramesControl?.setValue(arbitraryNumberOfFrames);

    //  Get the exposures field and set it to an invalid exposures string
    const exposureLengthsControl = darkFormGroup.get('exposureLengthsControl');
    exposureLengthsControl?.setValue(invalidExposuresList);

    expect(darkFormGroup.valid).toBeFalsy();
  });

  it('Should fail if #frames > 0 but exposures list empty', () => {
    const darkFormGroup = component.darkSectionGroup;

    //  Get the "number of frames" field and set it to a non-zero number
    const numFramesControl = darkFormGroup.get('numFramesControl');
    numFramesControl?.setValue(arbitraryNumberOfFrames);

    //  Get the exposures field and set it to an empty string
    const exposureLengthsControl = darkFormGroup.get('exposureLengthsControl');
    exposureLengthsControl?.setValue('   ');

    expect(darkFormGroup.valid).toBeFalsy();
  });

  it('Should allow empty exposures field if #frame = 0', () => {
    const darkFormGroup = component.darkSectionGroup;

    //  Get the "number of frames" field and set it to zero
    const numFramesControl = darkFormGroup.get('numFramesControl');
    numFramesControl?.setValue('0');

    //  Get the exposures field and set it to an empty string
    const exposureLengthsControl = darkFormGroup.get('exposureLengthsControl');
    exposureLengthsControl?.setValue('   ');

    expect(darkFormGroup.valid).toBeTruthy();
  });

  //   ****** Validate the validator that insists #frames>0 comes with some binning levels being selected

  it('Should reject Bias section of #frames > 0 but no check boxes checked', () => {
    const biasFormGroup = component.biasSectionGroup;

    //  Get the "number of frames" field and set it to a non-zero number
    const numFramesControl = biasFormGroup.get('numFramesControl');
    numFramesControl?.setValue(arbitraryNumberOfFrames);

    //  Get the 4 checkboxes and set each of them to false
    biasFormGroup.get('binningControl1')?.setValue(false);
    biasFormGroup.get('binningControl2')?.setValue(false);
    biasFormGroup.get('binningControl3')?.setValue(false);
    biasFormGroup.get('binningControl4')?.setValue(false);

    expect(biasFormGroup.valid).toBeFalsy();
  })

  it('Should validate Bias section of #frames > 0 but a check box is checked', () => {
    const biasFormGroup = component.biasSectionGroup;

    //  Get the "number of frames" field and set it to a non-zero number
    const numFramesControl = biasFormGroup.get('numFramesControl');
    numFramesControl?.setValue(arbitraryNumberOfFrames);

    //  Get the 4 checkboxes and set each of them to false
    biasFormGroup.get('binningControl1')?.setValue(false);
    biasFormGroup.get('binningControl2')?.setValue(true);
    biasFormGroup.get('binningControl3')?.setValue(false);
    biasFormGroup.get('binningControl4')?.setValue(false);

    expect(biasFormGroup.valid).toBeTruthy();
  })

  it('Should validate Bias section of #frames = 0 even though check boxes checked', () => {
    const biasFormGroup = component.biasSectionGroup;

    //  Get the "number of frames" field and set it to a non-zero number
    const numFramesControl = biasFormGroup.get('numFramesControl');
    numFramesControl?.setValue('0');

    //  Get the 4 checkboxes and set each of them to false
    biasFormGroup.get('binningControl1')?.setValue(false);
    biasFormGroup.get('binningControl2')?.setValue(false);
    biasFormGroup.get('binningControl3')?.setValue(false);
    biasFormGroup.get('binningControl4')?.setValue(false);

    expect(biasFormGroup.valid).toBeTruthy();
  })

});
