import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandaloneGalleryComponent } from './standalone-gallery.component';

describe('StandaloneGalleryComponent', () => {
  let component: StandaloneGalleryComponent;
  let fixture: ComponentFixture<StandaloneGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandaloneGalleryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StandaloneGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
