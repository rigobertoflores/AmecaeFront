import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { LoadingComponent } from '../../loading/loading.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent,  CommonModule, MatTooltip
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user : string;
  email: string;
  isGoogleUser$: Observable<boolean>;

  

  constructor(private authService: UserService,private router: Router) {
    if (this.authService.isAuthenticated()){     
      const userJson = localStorage.getItem('user');
      if(userJson){
    this.user = JSON.parse(userJson).email.split('@')[0] ;  
    this.email = JSON.parse(userJson).email ;  
  }
    }

  }
  ngOnInit(): void {
    this.isGoogleUser$ = this.authService.isGoogleUser();
  }
  
   changePass(){
  this.router.navigate(['/changePass']); 
  }


}
