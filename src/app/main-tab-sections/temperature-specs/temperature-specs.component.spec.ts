import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureSpecsComponent } from './temperature-specs.component';

describe('TemperatureSpecsComponent', () => {
  let component: TemperatureSpecsComponent;
  let fixture: ComponentFixture<TemperatureSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemperatureSpecsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemperatureSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
