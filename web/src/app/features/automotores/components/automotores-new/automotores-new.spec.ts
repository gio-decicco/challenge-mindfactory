import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomotoresNew } from './automotores-new';

describe('AutomotoresNew', () => {
  let component: AutomotoresNew;
  let fixture: ComponentFixture<AutomotoresNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomotoresNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomotoresNew);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
