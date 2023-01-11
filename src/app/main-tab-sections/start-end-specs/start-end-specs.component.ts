import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-start-end-specs',
  templateUrl: './start-end-specs.component.html',
  styleUrls: ['./start-end-specs.component.css']
})
export class StartEndSpecsComponent implements OnInit {
  formGroupStart!: FormGroup;
  formGroupEnd!: FormGroup;

  constructor(
  ) { }

  ngOnInit(): void {
    this.formGroupStart = new FormGroup({
      startGroupControl: new FormControl('startnow'),
    });
    this.formGroupEnd = new FormGroup({
      endGroupControl: new FormControl('endlater'),
    });
  }
}
