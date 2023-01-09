import {Injectable} from '@angular/core';
import {SettingsService} from "../settings/settings.service";
import {DarkFrameType, ServerCoordinates} from "../../types";
import axios from "axios";

const relayTestSuccessString = 'Relay Success';
const tsxTestSuccessString = 'TSX Success';

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
    const {address, port} = this.getServerCoordinates();
    const url = `http://${address}:${port}/api/testrelay`;

    return new Promise<boolean>((resolve) => {
      axios.get(url)
        .then((response) => {
          resolve(response.data === relayTestSuccessString);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  //  Test if we can communicate with theSkyX (via the relay).  Return a promise that
  //  will resolve to simple boolean on the success
  async testTheSkyX(): Promise<boolean> {
    const {address, port} = this.getServerCoordinates();
    const url = `http://${address}:${port}/api/testtsx`;

    return new Promise<boolean>((resolve) => {
      axios.get(url)
        .then((response) => {
          resolve(response.data === tsxTestSuccessString);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  //  Ask TheSkyX for its image autosave path
  async getAutosavePath(): Promise<string> {
    const {address, port} = this.getServerCoordinates();
    const url = `http://${address}:${port}/api/getautosavepath`;

    return new Promise<string>((resolve, reject) => {
      axios.get(url)
        .then((response) => {
          resolve(response.data);
        })
        .catch(() => {
          reject('');
        });
    });
  }

  //  Time how long it takes to download a file of the given binning value
  async timeDownload(binning: number): Promise<number> {
    // console.log('ServerCommunicationService/timeDownload: ', binning);
    const {address, port} = this.getServerCoordinates();
    const url = `http://${address}:${port}/api/timedownload/${binning}`;

    return new Promise<number>((resolve, reject) => {
      axios.get(url)
        .then((response) => {
          const timeReturned = response.data.time;
          // console.log(`ServerCommunicationService/timeDownload received ${timeReturned}`);
          resolve(timeReturned);
        })
        .catch((error) => {
          reject(error);
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

  //  Send the given command through to theSkyX and pass back any response received

  async sendAndReceive(commandToSend: string): Promise<string> {
    const {address, port} = this.getServerCoordinates();
    const url = `http://${address}:${port}/api/sendtext`;

    return new Promise<string>((resolve) => {
      axios.post(url,
        {message: commandToSend})
        .then((response) => {
          resolve(response.data);
        })
        .catch(() => {
          resolve('');
        });
    });

  }

  async startImageAcquisition(frameType: DarkFrameType, exposure: number, binning: number): Promise<void> {
    const {address, port} = this.getServerCoordinates();
    let url = '';
    if (frameType === DarkFrameType.biasFrame) {
      url = `http://${address}:${port}/api/acquire/bias/${binning}`;
    } else {
      url = `http://${address}:${port}/api/acquire/dark/${binning}/${exposure}`;
    }
    // console.log(`startImageAcquisition(${frameType},${exposure},${binning}): `, url);
    return new Promise<void>((resolve, reject) => {
      axios.get(url)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });

  }

  async isExposureComplete(): Promise<boolean> {
    const {address, port} = this.getServerCoordinates();
    const url = `http://${address}:${port}/api/exposing`;
    // console.log('isExposureComplete: ', url);

    return new Promise<boolean>((resolve, reject) => {
      axios.get(url)
        .then((response) => {
          resolve(!response.data.exposing);
        })
        .catch((err) => {
          reject(err);
        });
    });

  }

  async abortExposure(): Promise<void> {
    const {address, port} = this.getServerCoordinates();
    const url = `http://${address}:${port}/api/abortexposure`;
    return new Promise<void>((resolve, reject) => {
      axios.get(url)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });

  }
}
