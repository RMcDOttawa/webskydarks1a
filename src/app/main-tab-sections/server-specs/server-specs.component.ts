import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {of} from "rxjs";
import {SettingsService} from "../../services/settings/settings.service";
const isValidIP = require("is-valid-ip");
const isValidDomain = require('is-valid-domain')

const defaultServerAddress = 'localhost';
const defaultPortNumber = '3040';

@Component({
  selector: 'app-server-specs',
  templateUrl: './server-specs.component.html',
  styleUrls: ['./server-specs.component.css']
})
export class ServerSpecsComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    //  Get stored values, use defaults if none available
    let serverAddress = defaultServerAddress;
    let serverPort = defaultPortNumber;
    const serverSpecs = this.settingsService.getServerAddressAndPort();
    if (serverSpecs) {
      serverAddress = serverSpecs.address;
      serverPort = serverSpecs.port.toString();
    }

    this.formGroup = new FormGroup({

      addressControl: new FormControl(serverAddress, [
        Validators.required,    //  Field is required
        this.serverAddressValidator()
      ]),
      portNumberControl: new FormControl(serverPort, [
        Validators.required,    //  Field is required
        Validators.pattern('[0-9]+'),    //  Digits only, so integer
        Validators.min(1),
        Validators.max(65535),
      ]),
    });

    this.formGroup.valueChanges.subscribe(() => this.formValuesChanged(this.formGroup));
  }

  //  Listener which is called whenever the formgroup's value changes.
  //  If the form is valid we save it to settings.
  //  For reasons I don't understand, we have to pass the formgrup in from the lambda in the callback setup.
  //  Accessing it directly doesn't work - the callback method is not in the right scope.

  formValuesChanged(formGroup: FormGroup): void {

    if (formGroup.valid) {
      const address: string = formGroup.get('addressControl')!.value;
      const port: number = formGroup.get('portNumberControl')!.value;
      this.settingsService.setServerAddressAndPort(address, port);
    }
  }

  //  User has clicked "reset". Restore the fields' default values
  resetDefaults() {
    this.formGroup.get('addressControl')?.setValue(defaultServerAddress);
    this.formGroup.get('portNumberControl')?.setValue(defaultPortNumber);
  }

  //  Custom validator for the server host. (Creates and returns a validation function)
  //  A valid host is either
  //  a) A valid domain name (name.name.name....)
  //  b) A valid IP address (int.int.int.int)
  private serverAddressValidator() {
    return (control: any) => {
      const group: FormGroup = control as FormGroup;
      const offeredValue: string = group.value;
      let result: ValidationErrors | null = null;
      if (!this.isValidHostName(offeredValue)) {
        if (!this.isValidIpAddress(offeredValue)) {
          result = {invalidServerHost: {}};
        }
      }
      return result;
    }
  }

  //  Check if the given string is a valid domain name
  //  We'll use a built-in library function.  But a domain name is one or more "labels" separated by periods.
  private isValidHostName(offeredValue: string) {
    const valid = this.isValidDomainLabel(offeredValue) || isValidDomain(offeredValue);
    return valid;
  }

  //  Check if the given string is a valid IP address.
  //  4 integers < 256, separated by periods.
  private isValidIpAddress(offeredValue: string) {
    const valid = isValidIP(offeredValue);
    return valid;
  }

  //  The library "valid domain name" function doesn't consider a single name valid.  But for our
  //  purposes it is.  In fact, the single name "localhost" is probably the most common value.
  //  Here we validate a single name
  private isValidDomainLabel(offeredValue: string) {
    const labelRegEx = /^[a-z0-9]+[a-z0-9-_]*$/i;
    const isValid = labelRegEx.test(offeredValue);
    return isValid;
  }
}
