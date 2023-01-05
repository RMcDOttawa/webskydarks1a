import { Injectable } from '@angular/core';

//  Service to manage the actual acquisition of frames.  It spawns the web worker subtask, and provides
//  input and output feedback to the main session tab

@Injectable({
  providedIn: 'root'
})
export class AcquisitionService {

  constructor() { }

  //  Is the web worker task currently running?
  isRunning() {
    // console.log('AcquisitionService/isRunning stub');
    return false;
  }
}
