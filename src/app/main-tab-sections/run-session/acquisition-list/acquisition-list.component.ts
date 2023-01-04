import { Component, OnInit } from '@angular/core';
import {FramePlanService} from "../../../services/frame-plan/frame-plan.service";

@Component({
  selector: 'app-acquisition-list',
  templateUrl: './acquisition-list.component.html',
  styleUrls: ['./acquisition-list.component.css']
})
export class AcquisitionListComponent implements OnInit {

  constructor(public framePlanService: FramePlanService) { }

  ngOnInit(): void {
  }

}
