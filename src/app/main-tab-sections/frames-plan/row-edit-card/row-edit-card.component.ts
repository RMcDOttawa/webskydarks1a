import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DarkFrame, DarkFrameSet, DarkFrameType} from "../../../types";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {FramePlanService} from "../../../services/frame-plan/frame-plan.service";

@Component({
  selector: 'app-row-edit-card',
  templateUrl: './row-edit-card.component.html',
  styleUrls: ['./row-edit-card.component.css']
})
export class RowEditCardComponent implements OnInit {
  isEdit: boolean;
  frameSet: DarkFrameSet;

  //  Validator controls
  quantityControl!: FormControl;
  binningControl!: FormControl;
  completedControl!: FormControl;
  exposureControl!: FormControl;
  frameTypeControl!: FormControl;

  constructor(
    private dialogRef: MatDialogRef<RowEditCardComponent>,
    private framePlanService: FramePlanService,
    @Inject(MAT_DIALOG_DATA) public data: { edit: boolean, frameSet: DarkFrameSet, refreshCallback: () => void }) {
    //  Prevent clicking outside window from closing it
    // dialogRef.disableClose = true;

    this.isEdit = data.edit;
    this.frameSet = data.frameSet;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('360px');

    this.frameTypeControl = new FormControl(this.frameSet.frameSpec.frameType);

    //  Quantity field must be an integer >= 1
    this.quantityControl = new FormControl(this.frameSet.numberWanted, [
      Validators.required,    //  Field is required
      Validators.pattern('[0-9]+'),    //  Digits only, so integer
      Validators.min(1),
    ]);

    //  Binning field must be an integer >= 1
    this.binningControl = new FormControl(this.frameSet.frameSpec.binning, [
      Validators.required,    //  Field is required
      Validators.pattern('[0-9]+'),    //  Digits only, so integer
      Validators.min(1),
    ]);

    //  Completed field must be an integer >= 0
    this.completedControl = new FormControl(this.frameSet.numberCaptured, [
      Validators.required,    //  Field is required
      Validators.pattern('[0-9]+'),    //  Digits only, so integer
      Validators.min(0),
    ]);

    //  Exposure field can be any number, including decimals.
    //  Trying to get all the possible cases with a regular expression was complex and error-ridden,
    //  so instead we're using a custom validator that just attempts the actual conversion
    this.exposureControl = new FormControl(this.frameSet.frameSpec.exposure, [
      Validators.required,    //  Field is required
      this.floatingPointValidator(),
    ]);
  }

  //  Create a validation function that test if a form field is a valid floating point
  //  number by trying to convert it
  private floatingPointValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const stringToValidate: string = control.value;
      const conversionAttempt = Number(stringToValidate);
      return isNaN(conversionAttempt) ? {invalidFloat: {value: stringToValidate}} : null;
    }
  }

  //  Cancel button has been clicked.  Close the window without saving anything.
  cancelDialog() {
    this.dialogRef.close();
  }

  saveDialog() {
    const updatedFrameSpec: DarkFrame = {
      frameType: this.frameTypeControl.value,
      binning: this.binningControl.value,
      exposure: this.exposureControl.value
    };
    const updatedFrameSet: DarkFrameSet = {
      id: this.frameSet.id,
      frameSpec: updatedFrameSpec,
      numberWanted: this.quantityControl.value,
      numberCaptured: this.completedControl.value
    };
    this.framePlanService.updateFrameSet(updatedFrameSet);
    this.data.refreshCallback();
    this.dialogRef.close();
  }
}
