import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomotoresEdit } from './automotores-edit';

describe('AutomotoresEdit', () => {
  let component: AutomotoresEdit;
  let fixture: ComponentFixture<AutomotoresEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomotoresEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomotoresEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
