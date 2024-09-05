import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '../../Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../../loading/loading.component';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-pass',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent,ReactiveFormsModule,LoadingComponent,
  ],
  templateUrl: './change-pass.component.html',
  styleUrl: './change-pass.component.css'
})
export class ChangePassComponent implements OnInit {
 changeForm: any;
 pass: string;
 confirmPass: string;
 showLoading: boolean = false;



 constructor(private authService: UserService,private router: Router, private route: ActivatedRoute) {}
 
 ngOnInit(): void {
 this.cargarFormulario();
 }


 cargarFormulario() {
   this.changeForm = new FormGroup({
    pass: new FormControl(''),
     confirmPass:new FormControl('')
   });
 }


changePass() {
  const pass = this.changeForm.get('pass').value;
  const confirmPass = this.changeForm.get('confirmPass').value;

  if (pass !== confirmPass) {
    console.log("No coinciden las contraseñas");
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Las contraseñas no coinciden',
      showConfirmButton: false,
      timer: 2000,
    });
    return;
  }

  this.showLoading = true; // Mostrar el componente de carga

  this.authService.changePassword(pass).subscribe({
    next: () => {
      this.changeForm.reset();
      this.showLoading = false; // Ocultar el componente de carga
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha cambiado la contraseña con éxito',
        showConfirmButton: false,
        timer: 2000,
      });
      this.navigateTo(); // Navegar a otra ruta si es necesario
    },
    error: (error: any) => {
      console.log("Error al cambiar la contraseña:", error);
      // this.showLoading = false;
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error al cambiar la contraseña',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  });
}


    navigateTo(){      
        this.router.navigate(['/profile']); 
     
    }
}
