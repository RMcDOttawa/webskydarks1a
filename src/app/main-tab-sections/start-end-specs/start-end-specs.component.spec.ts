import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartEndSpecsComponent } from './start-end-specs.component';

describe('StartEndSpecsComponent', () => {
  let component: StartEndSpecsComponent;
  let fixture: ComponentFixture<StartEndSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartEndSpecsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartEndSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
