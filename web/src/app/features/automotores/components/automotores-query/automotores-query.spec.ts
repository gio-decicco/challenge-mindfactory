import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomotoresQuery } from './automotores-query';

describe('AutomotoresQuery', () => {
  let component: AutomotoresQuery;
  let fixture: ComponentFixture<AutomotoresQuery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomotoresQuery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomotoresQuery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
