import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSpecsComponent } from './server-specs.component';
import {MockComponent, MockDirective} from "ng-mocks";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatFormField} from "@angular/material/form-field";
import {MatRadioButton} from "@angular/material/radio";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('ServerSpecsComponent', () => {
  let component: ServerSpecsComponent;
  let fixture: ComponentFixture<ServerSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ServerSpecsComponent,
        MockDirective(MatCardContent),
        MockDirective(MatCardActions),
      ],
      imports: [
        MockComponent(MatCard),
        MockComponent(MatFormField),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*

    //  Get the "number of frames" field and set it to a non-zero number
    const numFramesControl = biasFormGroup.get('numFramesControl');
    numFramesControl?.setValue(arbitraryNumberOfFrames);

    //  Get the 4 checkboxes and set each of them to false
    biasFormGroup.get('binningControl1')?.setValue(false);
    biasFormGroup.get('binningControl2')?.setValue(false);
    biasFormGroup.get('binningControl3')?.setValue(false);
    biasFormGroup.get('binningControl4')?.setValue(false);

    expect(biasFormGroup.valid).toBeFalsy();

   */

  //  *****  Validators for host name

  const validOneWordHostName = 'localhost';
  const validFullyQualifiedDomainName = 'theskyserver.ewho.com';
  const invalidDomainName = 'almost-but.not.quite(';
  const validIPAddress = '127.0.0.1';
  const invalidIPAddress = '123.456';
  const validPortNumber = '3040';
  const invalidPortNumber = '3040burp';
  const outOfRangePortNumber = '65599';

  it('Should invalidate form if host name is empty', () => {
    //  Get the "host name" field and set it to empty
    const formGroup = component.formGroup;
    const addressControl = formGroup.get('addressControl')!;
    addressControl?.setValue('');
    expect(formGroup.valid).toBeFalsy();
    expect(addressControl.hasError('required')).toBeTruthy();
  });

  it('Should validate form if host name is a single word', () => {
    //  Get the "host name" field and set it to a word
    const formGroup = component.formGroup;
    const addressControl = formGroup.get('addressControl')!;
    addressControl?.setValue(validOneWordHostName);
    expect(formGroup.valid).toBeTruthy();
  });

  it('Should validate form if host name is a valid full domain name', () => {
    //  Get the "host name" field and set it to a valid string
    const formGroup = component.formGroup;
    const addressControl = formGroup.get('addressControl')!;
    addressControl?.setValue(validFullyQualifiedDomainName);
    expect(formGroup.valid).toBeTruthy();
  });

  it('Should invalidate form if host name is an invalid domain name', () => {
    //  Get the "host name" field and set it to a valid string
    const formGroup = component.formGroup;
    const addressControl = formGroup.get('addressControl')!;
    addressControl?.setValue(invalidDomainName);
    expect(formGroup.valid).toBeFalsy();
    expect(addressControl.hasError('invalidServerHost')).toBeTruthy();
  });

  it('Should validate form if host name is a valid IP address', () => {
    //  Get the "host name" field and set it to a valid string
    const formGroup = component.formGroup;
    const addressControl = formGroup.get('addressControl')!;
    addressControl?.setValue(validIPAddress);
    expect(formGroup.valid).toBeTruthy();
  });

  it('Should invalidate form if host name is an invalid IP address', () => {
    //  Get the "host name" field and set it to a valid string
    const formGroup = component.formGroup;
    const addressControl = formGroup.get('addressControl')!;
    addressControl?.setValue(invalidIPAddress);
    expect(formGroup.valid).toBeFalsy();
    expect(addressControl.hasError('invalidServerHost')).toBeTruthy();
  });

  it('Should invalidate form if port number is empty', () => {
    //  Get the "host name" field and set it to empty
    const formGroup = component.formGroup;
    const portNumberControl = formGroup.get('portNumberControl')!;
    portNumberControl?.setValue('');
    expect(formGroup.valid).toBeFalsy();
    expect(portNumberControl.hasError('required')).toBeTruthy();
  });

  it('Should invalidate form if port number is not an integer', () => {
    //  Get the "host name" field and set it to empty
    const formGroup = component.formGroup;
    const portNumberControl = formGroup.get('portNumberControl')!;
    portNumberControl?.setValue(invalidPortNumber);
    expect(formGroup.valid).toBeFalsy();
    expect(portNumberControl.hasError('pattern')).toBeTruthy();
  });

  it('Should validate form if port number is valid', () => {
    //  Get the "host name" field and set it to empty
    const formGroup = component.formGroup;
    const portNumberControl = formGroup.get('portNumberControl')!;
    portNumberControl?.setValue(validPortNumber);
    expect(formGroup.valid).toBeTruthy();
  });

  it('Should invalidate form if port number is outside valid range', () => {
    //  Get the "host name" field and set it to empty
    const formGroup = component.formGroup;
    const portNumberControl = formGroup.get('portNumberControl')!;
    portNumberControl?.setValue(outOfRangePortNumber);
    expect(formGroup.valid).toBeFalsy();
    expect(portNumberControl.hasError('max')).toBeTruthy();
  });

});
