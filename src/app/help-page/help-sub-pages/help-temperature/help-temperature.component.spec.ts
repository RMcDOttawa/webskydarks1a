import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpTemperatureComponent } from './help-temperature.component';

describe('HelpTemperatureComponent', () => {
  let component: HelpTemperatureComponent;
  let fixture: ComponentFixture<HelpTemperatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpTemperatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
