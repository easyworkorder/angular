import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitInformationComponent } from './remit-information.component';

describe('RemitInformationComponent', () => {
  let component: RemitInformationComponent;
  let fixture: ComponentFixture<RemitInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
