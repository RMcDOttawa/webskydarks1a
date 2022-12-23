import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSpecsComponent } from './server-specs.component';

describe('ServerSpecsComponent', () => {
  let component: ServerSpecsComponent;
  let fixture: ComponentFixture<ServerSpecsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerSpecsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
