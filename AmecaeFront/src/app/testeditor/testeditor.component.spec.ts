import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteditorComponent } from './testeditor.component';

describe('TesteditorComponent', () => {
  let component: TesteditorComponent;
  let fixture: ComponentFixture<TesteditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TesteditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
