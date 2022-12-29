import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageComponent } from './main-page.component';
import {SettingsService} from "../services/settings/settings.service";
import {MatTab, MatTabGroup, MatTabHeader} from "@angular/material/tabs";
import {StartEndSpecsComponent} from "../main-tab-sections/start-end-specs/start-end-specs.component";
import {TemperatureSpecsComponent} from "../main-tab-sections/temperature-specs/temperature-specs.component";
import {ServerSpecsComponent} from "../main-tab-sections/server-specs/server-specs.component";
import {FramesPlanComponent} from "../main-tab-sections/frames-plan/frames-plan.component";
import {MatDialog} from "@angular/material/dialog";
import {AppComponent} from "../app.component";

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        // MainPageComponent,
        // MatTab,
        // MatTabGroup,
        // StartEndSpecsComponent,
        // TemperatureSpecsComponent,
        // ServerSpecsComponent,
        // FramesPlanComponent,
        // MatTabHeader,
      ],
      providers: [
        // {
        //   provide: SettingsService,
        //   useValue: jasmine.createSpyObj('SettingsService',
        //     ['constructor', 'getSelectedMainTab', 'getFramePlan']),
        // },
        // {
        //   provide: MatDialog,
        //   useValue: jasmine.createSpyObj('MatDialog',
        //     ['constructor']),
        // }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('null test', () => {
    // expect(component).toBeTruthy();
  });


  //  Displays tab bar
});
