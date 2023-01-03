import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerTestComponent } from './server-test.component';
import {MockComponent, MockDirective} from "ng-mocks";
import {MatCard, MatCardActions, MatCardContent} from "@angular/material/card";
import {MatFormField} from "@angular/material/form-field";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('ServerTestComponent', () => {
  let component: ServerTestComponent;
  let fixture: ComponentFixture<ServerTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ServerTestComponent,
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

    fixture = TestBed.createComponent(ServerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
