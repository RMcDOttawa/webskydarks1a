import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowEditCardComponent } from './row-edit-card.component';

describe('RowEditCardComponent', () => {
  let component: RowEditCardComponent;
  let fixture: ComponentFixture<RowEditCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowEditCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowEditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
