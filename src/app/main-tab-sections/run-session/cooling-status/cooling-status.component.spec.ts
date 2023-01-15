import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoolingStatusComponent } from './cooling-status.component';

describe('CoolingStatusComponent', () => {
  let component: CoolingStatusComponent;
  let fixture: ComponentFixture<CoolingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoolingStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoolingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
