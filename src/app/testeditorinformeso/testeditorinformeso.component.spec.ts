import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteditorinformesoComponent } from './testeditorinformeso.component';

describe('TesteditorinformesoComponent', () => {
  let component: TesteditorinformesoComponent;
  let fixture: ComponentFixture<TesteditorinformesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteditorinformesoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TesteditorinformesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
