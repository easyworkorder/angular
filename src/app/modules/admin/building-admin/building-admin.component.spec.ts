import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingAdminComponent } from './building-admin.component';

describe('BuildingAdminComponent', () => {
  let component: BuildingAdminComponent;
  let fixture: ComponentFixture<BuildingAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
