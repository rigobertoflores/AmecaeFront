import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionImpresionComponent } from './configuracion-impresion.component';

describe('ConfiguracionImpresionComponent', () => {
  let component: ConfiguracionImpresionComponent;
  let fixture: ComponentFixture<ConfiguracionImpresionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionImpresionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguracionImpresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
