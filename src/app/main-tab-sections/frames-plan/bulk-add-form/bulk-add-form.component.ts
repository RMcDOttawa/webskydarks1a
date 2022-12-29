import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FramePlanService} from "../../../services/frame-plan/frame-plan.service";
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";

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
    dialogRef.disableClose = true;
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
        exposureLengthsControl: new FormControl(''),
      },
      [this.numberBinningValidator(), this.exposureListValidator()]
    )

  }

  //  Create a validation function that requires at least one binning checkbox be selected
  //  if the number of frames is > 0.  The created function will be called with the parent group as argument.
  public numberBinningValidator() {
    return (control: any) => {
      const group: FormGroup = control as FormGroup;
      let result: ValidationErrors | null = null;
      const numFramesString = group.get('numFramesControl')!.value;
      const numFrames = numFramesString === '' ? 0 : numFramesString;

      const checkBox1 = group.get('binningControl1')!.value;
      const checkBox2 = group.get('binningControl2')!.value;
      const checkBox3 = group.get('binningControl3')!.value;
      const checkBox4 = group.get('binningControl4')!.value;
      const atLeastOneChecked = checkBox1 || checkBox2 || checkBox3 || checkBox4;

      if (numFrames > 0) {
        if (!atLeastOneChecked) {
          result = {framesWithoutBinning: {}};
        }
      }
      return result;
    }
  }

  //  Create a validation function for the exposure list field in the dark-frames section.
  //  This field cannot be empty if the "number of frames" is > 0
  //  If non-empty, this field must be a list of space-separted numbers (decimals ok)
  public exposureListValidator() {
    return (control: any) => {
      const group: FormGroup = control as FormGroup;
      let result: ValidationErrors | null = null;
      const numFramesString = group.get('numFramesControl')!.value;
      const numFrames = numFramesString === '' ? 0 : numFramesString;
      const valuesField: string = group.get('exposureLengthsControl')!.value;

      if (numFrames > 0) {
        const tokens: string[] = valuesField.split(/\s+/);
        if (valuesField.trim().length == 0) {
          result = {emptyExposuresField: {}};
        } else {
          //  Remove any blank tokens produced by the parse
          const tokensNoBlanks = tokens.filter((item) => item !== '');
          //  Test if every item in this parsed array is a number
          const allNumbers = tokensNoBlanks.every((item) =>  !isNaN(Number(item)) );
          if (!allNumbers) {
            result = {invalidNumbersInExposures: {}};
          }
        }
      }
      return result;
    }
  }

  //  The Cancel button has been clicked.  Close the dialog without doing anything.
  cancelDialog() {
    this.dialogRef.close();
  }

  //  Save dialog has been clicked.  Package up all the request specifications and pass them to the
  //  Frames service to create the new frames, then close and refresh.  We can assume the fields are all
  //  valid strings - validation has been done at the interface.
  saveDialog() {

    //  Get the bias frames info
    const numBiasFrames: number = parseInt(this.biasSectionGroup.get('numFramesControl')!.value);
    const biasBinning1: boolean = this.biasSectionGroup.get('binningControl1')!.value;
    const biasBinning2: boolean = this.biasSectionGroup.get('binningControl2')!.value;
    const biasBinning3: boolean = this.biasSectionGroup.get('binningControl3')!.value;
    const biasBinning4: boolean = this.biasSectionGroup.get('binningControl4')!.value;

    //  Array of binning values wanted
    let biasBinnings: number[] = [];
    if (biasBinning1) biasBinnings.push(1);
    if (biasBinning2) biasBinnings.push(2);
    if (biasBinning3) biasBinnings.push(3);
    if (biasBinning4) biasBinnings.push(4);

    //  Get the dark frames info
    const numDarkFrames: number = parseInt(this.darkSectionGroup.get('numFramesControl')!.value);
    const darkBinning1: boolean = this.darkSectionGroup.get('binningControl1')!.value;
    const darkBinning2: boolean = this.darkSectionGroup.get('binningControl2')!.value;
    const darkBinning3: boolean = this.darkSectionGroup.get('binningControl3')!.value;
    const darkBinning4: boolean = this.darkSectionGroup.get('binningControl4')!.value;

    let darkBinnings: number[] = [];
    if (darkBinning1) darkBinnings.push(1);
    if (darkBinning2) darkBinnings.push(2);
    if (darkBinning3) darkBinnings.push(3);
    if (darkBinning4) darkBinnings.push(4);

    //  Array of exposure lengths for dark frames
    let darkExposures: number[] = [];
    if (numDarkFrames > 0) {
      const valuesField: string = this.darkSectionGroup.get('exposureLengthsControl')!.value;
      const tokens: string[] = valuesField.split(/\s+/);
      const tokensNoBlanks: string[] = tokens.filter((item) => item !== '');
      darkExposures = tokensNoBlanks.map((str) => Number(str));
    }

    this.framePlanService.bulkAdd(numBiasFrames, biasBinnings, numDarkFrames, darkBinnings, darkExposures);
    //  Refresh the table display and close this dialog
    this.data.refreshCallback();
    this.dialogRef.close();
  }
}
