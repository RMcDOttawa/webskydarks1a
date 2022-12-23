import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDeveloperComponent } from './help-developer.component';

describe('HelpDeveloperComponent', () => {
  let component: HelpDeveloperComponent;
  let fixture: ComponentFixture<HelpDeveloperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpDeveloperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
