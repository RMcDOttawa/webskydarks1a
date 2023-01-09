import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DarkFrame, DarkFrameSet} from "../../../types";
import {
  AbstractControl,
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
  selectedRow: number;
  formGroup!: FormGroup;


  constructor(
    private dialogRef: MatDialogRef<RowEditCardComponent>,
    private framePlanService: FramePlanService,
    @Inject(MAT_DIALOG_DATA) public data: {
      edit: boolean,
      frameSet: DarkFrameSet,
      selectedRow: number,
      refreshCallback: () => void }) {
    //  Prevent clicking outside window from closing it
    dialogRef.disableClose = true;

    this.isEdit = data.edit;
    this.frameSet = data.frameSet;
    this.selectedRow = data.selectedRow;
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('360px');

    this.formGroup = new FormGroup({
      frameTypeControl: new FormControl(this.frameSet.frameSpec.frameType),

      quantityControl: new FormControl(this.frameSet.numberWanted, [
        Validators.required,    //  Field is required
        Validators.pattern('[0-9]+'),    //  Digits only, so integer
        Validators.min(1),
      ]),

      binningControl: new FormControl(this.frameSet.frameSpec.binning, [
        Validators.required,    //  Field is required
        Validators.pattern('[0-9]+'),    //  Digits only, so integer
        Validators.min(1),
      ]),

      completedControl: new FormControl(this.frameSet.numberCaptured, [
        Validators.required,    //  Field is required
        Validators.pattern('[0-9]+'),    //  Digits only, so integer
        Validators.min(0),
      ]),

      exposureControl: new FormControl(this.frameSet.frameSpec.exposure, [
        Validators.required,    //  Field is required
        this.floatingPointValidator(),
      ])
    });

  }

  //  Exposure field can be any number, including decimals.
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

  //  Cancel button has been clicked.  Close the window without saving anything.
  cancelDialog() {
    this.dialogRef.close();
  }

  //  This is the method called both when saving an existing frame set that has been edited, and when
  //  creating a new frame set.  We use "isEdit" to determine which is which.  If it is a New item,
  //  we pass the selected row index (-1 = nothing selected) to the service so the new frame can be
  //  inserted at the appropriate point - either before the selected row or at the end of the list
  saveDialog() {
    const updatedFrameSpec: DarkFrame = {
      frameType: this.formGroup.get('frameTypeControl')!.value,
      binning: Number(this.formGroup.get('binningControl')!.value),
      exposure: Number(this.formGroup.get('exposureControl')!.value)
    };
    const updatedFrameSet: DarkFrameSet = {
      id: this.frameSet.id, // Will be -1 if this is a new frame set
      frameSpec: updatedFrameSpec,
      numberWanted: Number(this.formGroup.get('quantityControl')!.value),
      numberCaptured: Number(this.formGroup.get('completedControl')!.value)
    };
    if (this.isEdit) {
      this.framePlanService.updateFrameSet(updatedFrameSet);
    } else {
      this.framePlanService.addNewFrameSet(updatedFrameSet, this.selectedRow);
    }
    this.data.refreshCallback();
    this.dialogRef.close();
  }

}
