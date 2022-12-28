import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FramePlanService} from "../../../services/frame-plan/frame-plan.service";
import {DarkFrameSet} from "../../../types";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";

const defaultNumberBiasFrames = 16;
const defaultNumberDarkFrames = 16;

@Component({
  selector: 'app-bulk-add-form',
  templateUrl: './bulk-add-form.component.html',
  styleUrls: ['./bulk-add-form.component.css']
})
export class BulkAddFormComponent implements OnInit {
  biasSectionGroup!: FormGroup;
  darkSectionGroup!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<BulkAddFormComponent>,
    private framePlanService: FramePlanService,
    @Inject(MAT_DIALOG_DATA) public data: {
      refreshCallback: () => void
    }) {
    //  Prevent clicking outside window from closing it
    // dialogRef.disableClose = true;
  }

  ngOnInit(): void {

    //  Form controls and their validators

    //  Bias section: number of frames and binning.  Used as a group so we can validate across elements
    this.biasSectionGroup = new FormGroup({
        // Number-of-bias-frames field must be an integer >= 1
        numFramesControl: new FormControl(defaultNumberBiasFrames, [
          Validators.required,    //  Field is required
          Validators.pattern('[0-9]+')
        ]),
        binningControl1: new FormControl(true),
        binningControl2: new FormControl(true),
        binningControl3: new FormControl(false),
        binningControl4: new FormControl(false),
      },
       this.numberBinningValidator()
    )

    //  Bias section: number of frames and binning.  Used as a group so we can validate across elements
    this.darkSectionGroup = new FormGroup({
        // Number-of-bias-frames field must be an integer >= 1
        numFramesControl: new FormControl(defaultNumberDarkFrames, [
          Validators.required,    //  Field is required
          Validators.pattern('[0-9]+')
        ]),
        binningControl1: new FormControl(true),
        binningControl2: new FormControl(true),
        binningControl3: new FormControl(false),
        binningControl4: new FormControl(false),
      },
      this.numberBinningValidator()
    )

  }

  //  Create a validation function that requires at least one binning checkbox be selected
  //  if the number of frames is > 0.  The created function will be called with the parent group as argument.
  private numberBinningValidator() {
    return (control: any) => {
      const group: FormGroup = control as FormGroup;
      let result : ValidationErrors | null = null;
      const numFramesString = group.get('numFramesControl')!.value;
      const numFrames = numFramesString === '' ? 0 : numFramesString;

      const checkBox1 = group.get('binningControl1')!.value;
      const checkBox2 = group.get('binningControl1')!.value;
      const checkBox3 = group.get('binningControl1')!.value;
      const checkBox4 = group.get('binningControl1')!.value;
      const atLeastOneChecked = checkBox1 || checkBox2 || checkBox3 || checkBox4;

      if (numFrames > 0) {
        if (!atLeastOneChecked) {
          result = {framesWithoutBinning: {}};
        }
      }
      return result;
    }
  }

}
