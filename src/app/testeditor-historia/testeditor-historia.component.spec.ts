import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteditorHistoriaComponent } from './testeditor-historia.component';

describe('TesteditorHistoriaComponent', () => {
  let component: TesteditorHistoriaComponent;
  let fixture: ComponentFixture<TesteditorHistoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteditorHistoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TesteditorHistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
