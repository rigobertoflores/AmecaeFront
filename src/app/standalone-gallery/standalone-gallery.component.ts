import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-standalone-gallery',
  standalone: true,
  imports: [],
  templateUrl: './standalone-gallery.component.html',
  styleUrl: './standalone-gallery.component.css'
})
export class StandaloneGalleryComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { img: string }) {}
}
