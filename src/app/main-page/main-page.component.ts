import { Component, OnInit } from '@angular/core';

//  The main "page" that sits below the top toolbar and contains all the application interaction.
//  It is subdivided by a tab bar into different functions

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
