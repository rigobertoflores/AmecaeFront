import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarNotificacionesComponent } from './enviar-notificaciones.component';

describe('EnviarNotificacionesComponent', () => {
  let component: EnviarNotificacionesComponent;
  let fixture: ComponentFixture<EnviarNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnviarNotificacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnviarNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
