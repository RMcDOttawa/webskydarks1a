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
    // const {address, port} = this.getServerCoordinates();
    // const url = `https://${address}:${port}/api/testrelay`;
    const url = this.makeUrl('api/testrelay');

    return new Promise<boolean>((resolve) => {
      console.log('testRelay: Sending ', url);
      axios.get(url)
        .then((response) => {
          resolve(response.data === relayTestSuccessString);
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Server responded with error code');
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log('No response received');
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Config Error', error.message);
          }
          console.log(error.config);
          resolve(false);
        });
    });
  }

  //  Do a relay test, but force the use of https or http depending on the given parameter
  async testRelayWithHttps(useHttps: boolean): Promise<boolean> {
    console.log('testRelayWithHttps, useHttps: ', useHttps);
    const {address, port} = this.getServerCoordinates();
    const protocol = useHttps ? 'https' : 'http';
    const url = `${protocol}://${address}:${port}/api/testrelay`;

    return new Promise<boolean>((resolve) => {
      console.log('testRelayWithHttps Sending ', url);
      axios.get(url)
        .then((response) => {
          resolve(response.data === relayTestSuccessString);
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Server responded with error code');
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log('No response received');
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Config Error', error.message);
          }
          console.log(error.config);
          resolve(false);
        });
    });
  }

  //  Test if we can communicate with theSkyX (via the relay).  Return a promise that
  //  will resolve to simple boolean on the success
  async testTheSkyX(): Promise<boolean> {
    // const {address, port} = this.getServerCoordinates();
    // const url = `https://${address}:${port}/api/testtsx`;
    const url = this.makeUrl('api/testtsx');
    console.log('testTheSkyX Sending ', url);

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
    // const {address, port} = this.getServerCoordinates();
    // const url = `https://${address}:${port}/api/getautosavepath`;
    const url = this.makeUrl('api/getautosavepath');
    console.log('getAutosavePath Sending ', url);

    return new Promise<string>((resolve, reject) => {
      axios.get(url)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  }

  //  Time how long it takes to download a file of the given binning value
  async timeDownload(binning: number): Promise<number> {
    // console.log('ServerCommunicationService/timeDownload: ', binning);
    // const {address, port} = this.getServerCoordinates();
    // const url = `https://${address}:${port}/api/timedownload/${binning}`;
    const url = this.makeUrl(`api/timedownload/${binning}`);
    console.log('timeDownload Sending ', url);

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

  //  Send the given command through to theSkyX and pass back any response received

  async sendAndReceive(commandToSend: string): Promise<string> {
    // const {address, port} = this.getServerCoordinates();
    // const url = `https://${address}:${port}/api/sendtext`;
    const url = this.makeUrl(`api/sendtext`);
    console.log('sendAndReceive Sending ', url);

    return new Promise<string>((resolve) => {
      axios.post(url,
        {message: commandToSend})
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          resolve(err);
        });
    });

  }

  async startImageAcquisition(frameType: DarkFrameType, exposure: number, binning: number): Promise<void> {
    // const {address, port} = this.getServerCoordinates();
    let url = '';
    if (frameType === DarkFrameType.biasFrame) {
      url = this.makeUrl(`api/acquire/bias/${binning}`);
    } else {
      url = this.makeUrl(`api/acquire/dark/${binning}/${exposure}`);
    }
    console.log(`startImageAcquisition(${frameType},${exposure},${binning}): `, url);
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
    // const {address, port} = this.getServerCoordinates();
    // const url = `https://${address}:${port}/api/exposing`;
    const url = this.makeUrl(`api/exposing`);
    console.log('isExposureComplete Sending ', url);

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
    // const {address, port} = this.getServerCoordinates();
    // const url = `https://${address}:${port}/api/abortexposure`;
    const url = this.makeUrl(`api/abortexposure`);
    console.log('abortExposure Sending ', url);
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


  getServerCoordinates(): ServerCoordinates {
    let response: ServerCoordinates = {address: defaultAddress, port: defaultPort};
    const savedCoordinates = this.settingsService.getServerAddressAndPort();
    if (savedCoordinates) {
      response.address = savedCoordinates.address;
      response.port = savedCoordinates.port;
    }
    return response;
  }

  //  Make an appropriate URL for the given endpoint. It will be one of:
  //    http://<address>:<port>/endpoint
  //    https://<address>:<port>/endpoint

  private makeUrl(endpoint: string): string {
    const {address, port} = this.getServerCoordinates();
    const protocol = this.settingsService.getServerHttps() ? 'https' : 'http';
    // console.log(`MakeUrl(${endpoint}) returns ${url}`);
    return `${protocol}://${address}:${port}/${endpoint}`;
  }

}
