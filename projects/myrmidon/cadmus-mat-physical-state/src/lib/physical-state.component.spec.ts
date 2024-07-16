import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadmusMatPhysicalStateComponent } from './physical-state.component';

describe('CadmusMatPhysicalStateComponent', () => {
  let component: CadmusMatPhysicalStateComponent;
  let fixture: ComponentFixture<CadmusMatPhysicalStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadmusMatPhysicalStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadmusMatPhysicalStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
