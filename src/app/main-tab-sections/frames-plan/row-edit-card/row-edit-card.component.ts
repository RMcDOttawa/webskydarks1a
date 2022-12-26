import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DarkFrameSet} from "../../../types";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-row-edit-card',
  templateUrl: './row-edit-card.component.html',
  styleUrls: ['./row-edit-card.component.css']
})
export class RowEditCardComponent implements OnInit {
  isEdit: boolean;
  frameSet: DarkFrameSet;
  originalFrameSet: DarkFrameSet;

  //  Validator controls
  quantityControl!: FormControl;
  binningControl!: FormControl;

  constructor(
    private dialogRef: MatDialogRef<RowEditCardComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {edit: boolean, frameSet: DarkFrameSet})
  {
    //  Prevent clicking outside window from closing it
    // dialogRef.disableClose = true;

    this.isEdit = data.edit;
    this.originalFrameSet = data.frameSet;

    //  Edit a COPY of the frameSet so, if user cancels dialog, we haven't changed original
    this.frameSet = structuredClone(data.frameSet);
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('360px');
    this.quantityControl = new FormControl('', [
      Validators.required,    //  Field is required
      Validators.pattern('[0-9]+'),    //  Digits only, so integer
      Validators.min(1),
    ]);
    this.binningControl = new FormControl('', [
      Validators.required,    //  Field is required
      Validators.pattern('[0-9]+'),    //  Digits only, so integer
      Validators.min(1),
    ])

  }

  cancelDialog() {
    alert('cancelDialog');
  }

  saveDialog() {
    alert('saveDialog');
  }
}
