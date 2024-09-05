import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesoConfiguracionComponent } from './informeso-configuracion.component';

describe('InformesoConfiguracionComponent', () => {
  let component: InformesoConfiguracionComponent;
  let fixture: ComponentFixture<InformesoConfiguracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformesoConfiguracionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformesoConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
