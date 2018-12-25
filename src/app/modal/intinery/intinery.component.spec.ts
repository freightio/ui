import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntineryComponent } from './intinery.component';

describe('IntineryComponent', () => {
  let component: IntineryComponent;
  let fixture: ComponentFixture<IntineryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntineryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntineryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
