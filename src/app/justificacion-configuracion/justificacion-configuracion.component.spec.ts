import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustificacionConfiguracionComponent } from './justificacion-configuracion.component';

describe('JustificacionConfiguracionComponent', () => {
  let component: JustificacionConfiguracionComponent;
  let fixture: ComponentFixture<JustificacionConfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustificacionConfiguracionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JustificacionConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
