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

  //  Connect button has been clicked.  Ask Server service to establish connection.
  connectClicked() {
    const serverSettings = this.settingsService.getServerAddressAndPort();
    // if (serverSettings) {
    //   this.serverCommunication.openConnection(serverSettings.address, serverSettings.port);
    // }
  }

  //  Send the text in the input area to the comms service to encapsulate and send, retrieve the response it
  //  receives, and display that in the response field.
  sendClicked() {
    const commandToSend = this.formGroup.get('toSendControl')!.value;
    // this.serverCommunication.sendAndResponse(commandToSend, (response) => {
    //   this.formGroup.get('responseControl')!.setValue(response);
    // });
  }

  //  Have the comms service disconnect the socket
  disconnectClicked() {
    // this.serverCommunication.closeConnection();
  }

  isConnected(): boolean {
    return false;
  }
}
