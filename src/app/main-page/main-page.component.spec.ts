import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MainPageComponent} from './main-page.component';
import {AppComponent} from "../app.component";
import {SettingsService} from "../services/settings/settings.service";

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  const mockSettingsService = jasmine.createSpyObj("SettingsService",
    ["getSelectedMainTab", "setSelectedMainTab"]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {provide: SettingsService, useValue: mockSettingsService},
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MainPageComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    mockSettingsService.getSelectedMainTab.and.returnValue(2);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  //  Should fetch default tab index from settings on creation
  it('Should fetch default tab index', () => {
    expect(mockSettingsService.getSelectedMainTab).toHaveBeenCalled();
  });

});
