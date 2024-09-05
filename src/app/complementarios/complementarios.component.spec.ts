import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementariosComponent } from './complementarios.component';

describe('ComplementariosComponent', () => {
  let component: ComplementariosComponent;
  let fixture: ComponentFixture<ComplementariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplementariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComplementariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
