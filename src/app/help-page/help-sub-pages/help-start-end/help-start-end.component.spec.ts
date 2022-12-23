import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpStartEndComponent } from './help-start-end.component';

describe('HelpStartEndComponent', () => {
  let component: HelpStartEndComponent;
  let fixture: ComponentFixture<HelpStartEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpStartEndComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpStartEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
