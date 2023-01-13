import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";

@Component({
  selector: 'app-temperature-specs',
  templateUrl: './temperature-specs.component.html',
  styleUrls: ['./temperature-specs.component.css']
})
export class TemperatureSpecsComponent implements OnInit {

  formGroup!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      targetTemperatureControl: new FormControl(0, [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(-100),
        Validators.max(100),
      ]),
      targetToleranceControl: new FormControl(.5, [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(-10),
        Validators.max(10),
      ]),
      coolingCheckIntervalControl: new FormControl(60, [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(0.1),
        Validators.max(60 * 60),
      ]),
      coolingMaxTimeControl: new FormControl(15 * 60 , [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(1),
        Validators.max(6 * 60 * 60),
      ]),
      coolingRetriesControl: new FormControl(3 , [
        Validators.required,    //  Field is required
        Validators.pattern('[0-9]+'),    //  Digits only, so integer
        Validators.min(0),
        Validators.max(10),
      ]),
      coolingRetriesDelayControl: new FormControl(10*60 , [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(0),
        Validators.max(3 * 60 * 60),
      ]),
      abortTemperatureControl: new FormControl(false),
      temperatureAbortThresholdControl: new FormControl({
        value: 5,
        disabled: true
      }, [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(-100),
        Validators.max(+100),
      ]),
    });

    //  Set up listener on temperature abort checkbox to enable theinput field
    this.formGroup.get('abortTemperatureControl')!.valueChanges.subscribe((checkBoxOn: boolean) => {
      const inputField = this.formGroup.get('temperatureAbortThresholdControl');
      if (checkBoxOn) {
        inputField!.enable();
      } else {
        inputField!.disable();
      }
    });
  }

  //  Several fields can be any number, including decimals.
  //  Trying to get all the possible cases with a regular expression was complex and error-ridden,
  //  Create a validation function that test if a form field is a valid floating point
  //  number by trying to convert it
  private floatingPointValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const stringToValidate: string = control.value;
      const conversionAttempt = Number(stringToValidate);
      return isNaN(conversionAttempt) ? {invalidFloat: {value: stringToValidate}} : null;
    }
  }

}
