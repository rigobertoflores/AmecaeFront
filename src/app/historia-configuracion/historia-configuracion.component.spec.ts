import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaConfiguracionComponent } from './historia-configuracion.component';

describe('HistoriaConfiguracionComponent', () => {
  let component: HistoriaConfiguracionComponent;
  let fixture: ComponentFixture<HistoriaConfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaConfiguracionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriaConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
