import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppToolbarComponent } from './app-toolbar.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('AppToolbarComponent', () => {
  let component: AppToolbarComponent;
  let fixture: ComponentFixture<AppToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppToolbarComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
