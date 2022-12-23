import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpRunSessionComponent } from './help-run-session.component';

describe('HelpRunSessionComponent', () => {
  let component: HelpRunSessionComponent;
  let fixture: ComponentFixture<HelpRunSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpRunSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpRunSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
