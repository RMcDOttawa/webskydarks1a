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

  constructor() { }

  ngOnInit(): void {
  }


  //  Detect when the console text has changed and scroll the div to keep the last line visible
  // ngOnChanges(changes: SimpleChanges) {
    ngOnChanges() {
    // console.log('  ConsoleLogComponent/ngOnChanges fired: ', changes);
    if (this.consoleDiv) {
      // console.log('   Scrolling div to bottom');
      // console.log(`   scrollHeight = ${this.consoleDiv.nativeElement.scrollHeight}`);

      //  Do the scroll after a fraction-second delay, so there is time for the added line to render
      //  This was arrived at through experimentation.  Without the delay, the scroll only goes down to the
      //  second-last line. Eventually I figured out that I was getting this change notification before the
      //  div content had absorbed the new data and re-rendered.  There is probably a better way to do this
      //  scroll after the rendering event rather than relying on a silly timer, but I haven't found it.
      setTimeout(() => {
        this.consoleDiv.nativeElement.scroll({
          top: this.consoleDiv.nativeElement.scrollHeight,
          bottom: 0,
          left: 0,
          behavior: 'smooth'
        });
      }, 100);
    }
  }

}
