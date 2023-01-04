import { Component, OnInit } from '@angular/core';
import {ServerCommunicationService} from "../../../services/server-communication/server-communication.service";

@Component({
  selector: 'app-camera-autosave',
  templateUrl: './camera-autosave.component.html',
  styleUrls: ['./camera-autosave.component.css']
})
export class CameraAutosaveComponent implements OnInit {

  autoSavePath: string | null = null;

  constructor(
    private serverCommunicatonService: ServerCommunicationService
  ) { }

  async ngOnInit(): Promise<void> {
    //  Attempt to get camera autosave path
    try {
      this.autoSavePath = await this.serverCommunicatonService.getAutosavePath();
      // console.log("Retrieved autosave path: ", this.autoSavePath);
    } catch (e) {
      // console.log("unable to get autosave path, setting null. e = ", e);
      this.autoSavePath = null;
    }
  }

}
