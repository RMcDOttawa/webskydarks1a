import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppToolbarComponent } from './app-toolbar.component';
import {MockComponent, MockDirective} from "ng-mocks";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";

describe('AppToolbarComponent', () => {
  let component: AppToolbarComponent;
  let fixture: ComponentFixture<AppToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppToolbarComponent,
        MockDirective(MatToolbarRow),
      ],
      imports: [
        MockComponent(MatToolbar),
        MockComponent(MatIcon),
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

  it('should have expected title and subtitle', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Web SkyDarks');
    expect(compiled.textContent).toContain('by Earwig Haven Observatory');
  })

});
