import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

const defaultServerAddress = 'localhost';
const defaultPortNumber = '3040';

@Component({
  selector: 'app-server-specs',
  templateUrl: './server-specs.component.html',
  styleUrls: ['./server-specs.component.css']
})
export class ServerSpecsComponent implements OnInit {
  formGroup!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({

      addressControl: new FormControl(defaultServerAddress, [
        Validators.required,    //  Field is required
      ]),
      portNumberControl: new FormControl(defaultPortNumber, [
        Validators.required,    //  Field is required
        Validators.pattern('[0-9]+'),    //  Digits only, so integer
      ]),
    });
  }

  //  User has clicked "reset". Restore the fields' default values
  resetDefaults() {
    this.formGroup.get('addressControl')?.setValue(defaultServerAddress);
    this.formGroup.get('portNumberControl')?.setValue(defaultPortNumber);
  }
}
