import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {SettingsService} from "../../services/settings/settings.service";
import {TemperatureControl} from "../../types";

@Component({
  selector: 'app-temperature-specs',
  templateUrl: './temperature-specs.component.html',
  styleUrls: ['./temperature-specs.component.css']
})
export class TemperatureSpecsComponent implements OnInit {

  formGroup!: FormGroup;

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    //  Get the initial values for this form - from settings if they exist, otherwise defaults
    let defaults = this.settingsService.getTemperatureControl();
    if (defaults === null) {
      console.log('No temperature settings stored, using defaults.');
      defaults = {
        enabled: false,
        target: 0,
        within: 1,
        checkInterval: 300,
        maxTime: 30 * 60,
        retries: 3,
        retryDelay: 20 * 60,
        abortOnRise: false,
        abortThreshold: 5
      }
    }

    //  Create the group of controls, with their initial values and validators
    this.formGroup = new FormGroup({
      useTemperatureControl: new FormControl(defaults.enabled),
      targetTemperatureControl: new FormControl({value: defaults.target, disabled: !defaults.enabled}, [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(-100),
        Validators.max(100),
      ]),
      targetToleranceControl: new FormControl({value: defaults.within, disabled: !defaults.enabled}, [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(-10),
        Validators.max(10),
      ]),
      coolingCheckIntervalControl: new FormControl({value: defaults.checkInterval, disabled: !defaults.enabled}, [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(0.1),
        Validators.max(60 * 60),
      ]),
      coolingMaxTimeControl: new FormControl({value: defaults.maxTime, disabled: !defaults.enabled} , [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(1),
        Validators.max(6 * 60 * 60),
      ]),
      coolingRetriesControl: new FormControl({value: defaults.retries, disabled: !defaults.enabled} , [
        Validators.required,    //  Field is required
        Validators.pattern('[0-9]+'),    //  Digits only, so integer
        Validators.min(0),
        Validators.max(10),
      ]),
      coolingRetriesDelayControl: new FormControl({value: defaults.retryDelay, disabled: !defaults.enabled} , [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(0),
        Validators.max(3 * 60 * 60),
      ]),
      abortTemperatureControl: new FormControl({value: defaults.abortOnRise, disabled: !defaults.enabled}),
      temperatureAbortThresholdControl: new FormControl({
        value: defaults.abortThreshold,
        disabled: !(defaults.abortOnRise && defaults.enabled)
      }, [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
        Validators.min(0.1),
        Validators.max(100),
      ]),
    });

    //  Set up listener on main checkbox to enable or disable all the fields
    this.formGroup.get('useTemperatureControl')!.valueChanges.subscribe((checkBoxOn: boolean) => {
      Object.keys(this.formGroup.controls).forEach(key => {
        if (key !== 'useTemperatureControl' && key !== 'temperatureAbortThresholdControl') {
          if (checkBoxOn) {
            this.formGroup.controls[key].enable();
          } else {
            this.formGroup.controls[key].disable();
          }
        }
      });
      //  Do the abort threshold separately since it is dependent on two settings
      const abortThreshold = this.formGroup.get('temperatureAbortThresholdControl');
      if (checkBoxOn && this.formGroup.get('abortTemperatureControl')!.value === true) {
        abortThreshold!.enable();
      } else {
        abortThreshold!.disable();
      }
    });

    //  Set up listener on temperature abort checkbox to enable the corresponding input field
    this.formGroup.get('abortTemperatureControl')!.valueChanges.subscribe((checkBoxOn: boolean) => {
      const inputField = this.formGroup.get('temperatureAbortThresholdControl');
      if (checkBoxOn) {
        inputField!.enable();
      } else {
        inputField!.disable();
      }
    });

    //  Set up listener on entire form, so we can update settings when it changes
    this.formGroup!.valueChanges.subscribe (() => {
      // console.log('Formgroup changed, parm = ', parm);
      // console.log('  Formgroup valid = ', this.formGroup.valid);
      const g = this.formGroup;
      if (g.valid) {
        // console.log('  Form has changed and is still valid, update settings.');
        const newSettings: TemperatureControl = {
          enabled: g.get('useTemperatureControl')!.value,
          target: g.get('targetTemperatureControl')!.value,
          within: g.get('targetToleranceControl')!.value,
          checkInterval: g.get('coolingCheckIntervalControl')!.value,
          maxTime: g.get('coolingMaxTimeControl')!.value,
          retries: g.get('coolingRetriesControl')!.value,
          retryDelay: g.get('coolingRetriesDelayControl')!.value,
          abortOnRise: g.get('abortTemperatureControl')!.value,
          abortThreshold: g.get('temperatureAbortThresholdControl')!.value,
        };
        // console.log('  Saving settings: ', newSettings);
        this.settingsService.setTemperatureControl(newSettings);
      }
    })
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
