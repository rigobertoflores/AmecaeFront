import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarNotificacionesComponent } from './consultar-notificaciones.component';

describe('ConsultarNotificacionesComponent', () => {
  let component: ConsultarNotificacionesComponent;
  let fixture: ComponentFixture<ConsultarNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarNotificacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultarNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
