import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingPage } from './ongoing.page';

describe('OngoingPage', () => {
  let component: OngoingPage;
  let fixture: ComponentFixture<OngoingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
