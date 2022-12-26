import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DarkFrameSet} from "../../../types";

@Component({
  selector: 'app-row-edit-card',
  templateUrl: './row-edit-card.component.html',
  styleUrls: ['./row-edit-card.component.css']
})
export class RowEditCardComponent implements OnInit {
  isEdit: boolean;
  frameSet: DarkFrameSet;
  originalFrameSet: DarkFrameSet;

  constructor(
    private dialogRef: MatDialogRef<RowEditCardComponent>,
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
  }

  cancelDialog() {
    alert('cancelDialog');
  }

  saveDialog() {
    alert('saveDialog');
  }
}
