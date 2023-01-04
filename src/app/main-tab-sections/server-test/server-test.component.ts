import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ServerCommunicationService} from "../../services/server-communication/server-communication.service";
import {SettingsService} from "../../services/settings/settings.service";

@Component({
  selector: 'app-server-test',
  templateUrl: './server-test.component.html',
  styleUrls: ['./server-test.component.css']
})
export class ServerTestComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private serverCommunication: ServerCommunicationService,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      toSendControl: new FormControl('', [
        Validators.required,    //  Field is required
      ]),
      responseControl: new FormControl(''),
    });
  }


  //  Send the text in the input area to the comms service to encapsulate and send, retrieve the response it
  //  receives, and display that in the response field.
  async sendClicked() {
    const commandToSend = this.formGroup.get('toSendControl')!.value;
    console.log(`ServerTestComponent/sendClicked: ${commandToSend}`);
    const response = await this.serverCommunication.sendAndReceive(commandToSend);
    console.log('  Response received: ', response);
  }

}
