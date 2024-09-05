import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillasCorreosComponent } from './plantillas-correos.component';

describe('PlantillasCorreosComponent', () => {
  let component: PlantillasCorreosComponent;
  let fixture: ComponentFixture<PlantillasCorreosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantillasCorreosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlantillasCorreosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
