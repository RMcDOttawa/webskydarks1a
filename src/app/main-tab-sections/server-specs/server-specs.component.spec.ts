import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSpecsComponent } from './server-specs.component';
import {MockComponent, MockDirective} from "ng-mocks";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatFormField} from "@angular/material/form-field";
import {MatRadioButton} from "@angular/material/radio";

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
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
