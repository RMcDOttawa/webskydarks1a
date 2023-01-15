import {Component, Input, OnInit} from '@angular/core';
import {CoolingStatus} from "../../../types";

@Component({
  selector: 'app-cooling-status',
  templateUrl: './cooling-status.component.html',
  styleUrls: ['./cooling-status.component.css']
})
export class CoolingStatusComponent implements OnInit {

  @Input() coolingStatus: CoolingStatus | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
