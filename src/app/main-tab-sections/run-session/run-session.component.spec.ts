import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunSessionComponent } from './run-session.component';

describe('RunSessionComponent', () => {
  let component: RunSessionComponent;
  let fixture: ComponentFixture<RunSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
