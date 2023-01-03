import {Injectable} from '@angular/core';
import {SettingsService} from "../settings/settings.service";
import {ServerCoordinates} from "../../types";
import axios from "axios";

const defaultAddress = 'localhost';
const defaultPort = 3000;

@Injectable({
  providedIn: 'root'
})
export class ServerCommunicationService {

  constructor(private settingsService: SettingsService) {
  }

  //  Test if we can communicate with the relay server.  Return a promise that
  //  will resolve to simple boolean on the success
  async testRelay(): Promise<boolean> {
    let success = false;
    const {address, port} = this.getServerCoordinates();
    const url = `http://${address}:${port}/api/testrelay`;

    return new Promise<boolean>((resolve, reject) => {
      axios.get(url)
        .then((response) => {
          resolve(response.data === 'Relay Success');
        })
        .catch((error) => {
          resolve(false);
        });
    });
  }

  //  Test if we can communicate with theSkyX (via the relay).  Return a promise that
  //  will resolve to simple boolean on the success
  async testTheSkyX(): Promise<boolean> {
    let success = false;
    const {address, port} = this.getServerCoordinates();
    const url = `http://${address}:${port}/api/testtsx`;

    return new Promise<boolean>((resolve, reject) => {
      axios.get(url)
        .then((response) => {
          resolve(response.data === 'TSX Success');
        })
        .catch((error) => {
          resolve(false);
        });
    });
  }

  getServerCoordinates(): ServerCoordinates {
    let response: ServerCoordinates = {address: defaultAddress, port: defaultPort};
    const savedCoordinates = this.settingsService.getServerAddressAndPort();
    if (savedCoordinates) {
      response.address = savedCoordinates.address;
      response.port = savedCoordinates.port;
    }
    return response;
  }
}
