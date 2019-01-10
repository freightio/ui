import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrabPage } from './grab.page';

describe('GrabPage', () => {
  let component: GrabPage;
  let fixture: ComponentFixture<GrabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
