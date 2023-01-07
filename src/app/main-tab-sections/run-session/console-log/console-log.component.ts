import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-console-log',
  templateUrl: './console-log.component.html',
  styleUrls: ['./console-log.component.css']
})
export class ConsoleLogComponent implements OnInit {

  //  Console text is set up in the parent and passed in here
  @Input() consoleText: string = '';

  //  Get access to the div containing the console text to enable scrolling
  //  Must use an event handler so the scrolling takes place after the new lines are added
  @ViewChild('console') private consoleDiv!: ElementRef;

  constructor() {
  }

  ngOnInit(): void {
  }

  //  Detect when the console text has changed and scroll the div to keep the last line visible
  //  Do the scroll here because this method fires after the updated pane is rendered.
  ngAfterViewChecked() {
    // console.log('ConsoleLogComponent/ngAfterViewChecked entered');
    this.consoleDiv.nativeElement.scroll({
      top: this.consoleDiv.nativeElement.scrollHeight,
      bottom: 0,
      left: 0,
      behavior: 'smooth'
    });
  }



}
