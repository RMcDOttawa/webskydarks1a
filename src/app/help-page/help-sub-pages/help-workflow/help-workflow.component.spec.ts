import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpWorkflowComponent } from './help-workflow.component';

describe('HelpWorkflowComponent', () => {
  let component: HelpWorkflowComponent;
  let fixture: ComponentFixture<HelpWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpWorkflowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
