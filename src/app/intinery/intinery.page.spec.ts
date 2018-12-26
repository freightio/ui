import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntineryPage } from './intinery.page';

describe('IntineryPage', () => {
  let component: IntineryPage;
  let fixture: ComponentFixture<IntineryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntineryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntineryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
