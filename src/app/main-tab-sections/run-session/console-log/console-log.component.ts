import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-console-log',
  templateUrl: './console-log.component.html',
  styleUrls: ['./console-log.component.css']
})
export class ConsoleLogComponent implements OnInit {

  @Input() consoleText: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   // console.log('  ConsoleLogComponent/ngOnChanges fired: ', changes);
  // }

}
