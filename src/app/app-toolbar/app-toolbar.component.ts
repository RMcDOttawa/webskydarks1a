import { Component, OnInit } from '@angular/core';

//  Toolbar that sits at the top of the page in the application, no matter what is in the rest of the window

@Component({
  selector: 'app-app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.css']
})
export class AppToolbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
