import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'clinicaolivera';
  isSidebarCollapsed = false;

 
  ngOnInit(): void {
    // O puedes hacerlo en ngOnInit para un control más fino
    this.toggleSidebar();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    document.body.classList.toggle('sidebar-collapse', this.isSidebarCollapsed);
  }
}
