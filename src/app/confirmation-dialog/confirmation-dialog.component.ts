import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
  title: string = '';
  message: string = '';
  cancelLabel: string = 'Cancel';
  proceedLabel: string = 'Proceed';

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogComponent) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.cancelLabel = data.cancelLabel;
    this.proceedLabel = data.proceedLabel;
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmationDialogModel {

  constructor(public title: string, public message: string,
              public cancelLabel: string, public proceedLabel: string) {
  }
}
