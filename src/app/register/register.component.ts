import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../Services/user.service';
import { error } from 'jquery';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { LoadingComponent } from '../loading/loading.component';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MenuComponent,
    SidebarComponent,
    LoadingComponent,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  userService: any;
  registerform: any;
  showLoading: boolean = false;

  constructor(private authService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.registerform = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
      repeatPassword: new FormControl(''),
    });
  }

  // registerUser() {
  //   this.showLoading = true;
  //   let pass: string = this.registerform.get('password')?.value;
  //   let repeatPass: string = this.registerform.get('repeatPassword')?.value;
  //   if (pass === repeatPass) {
  //     this.authService
  //       .register(
  //         this.registerform.get('email')?.value,
  //         this.registerform.get('password')?.value
  //       )
  //       .then(() => {
  //         console.log('Registro exitoso');
  //         this.showLoading = false;
  //         Swal.fire({
  //           title: 'Éxito!',
  //           text: 'Ha creado un nuevo usuario correctamente.',
  //           icon: 'success',
  //           showConfirmButton: false,
  //           timer: 2000,
  //         });
  //         // this.router.navigate(['/login']);
  //       })
  //       .catch((error: any) => {
  //         this.showLoading = false;
  //         console.error('Error en el registro:', error);

  //         // if (error.          includes('auth/email-already-in-use')) {
  //         //   Swal.fire({
  //         //     title: 'Información!',
  //         //     text: 'Ya existe este usuario.',
  //         //     icon: 'info',
  //         //     showConfirmButton: false,
  //         //     timer: 2000,
  //         //   });
  //         // }
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Oops...',
  //           text: 'Ocurrió un error al agregar un nuevo usuario',
  //           // footer: '<a href="#">Why do I have this issue?</a>'
  //         });
  //         // Manejo de errores de registro
  //       });
  //   } else {
  //     console.error('Contraseñas no coinciden:', error);
  //   }
  // }

  registerUser() {
    this.showLoading = true;
    let pass: string = this.registerform.get('password')?.value;
    let repeatPass: string = this.registerform.get('repeatPassword')?.value;
    if (pass === repeatPass) {
      this.authService
        .register(
          this.registerform.get('email')?.value,
          this.registerform.get('password')?.value
        )
        .subscribe({
          next: (result) => {
            console.log('Registro exitoso');
            this.showLoading = false;
            this.cleanForm();
            Swal.fire({
              title: 'Éxito!',
              text: 'Ha creado un nuevo usuario correctamente.',
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            });
          },
          error: (error) => {
            this.showLoading = false;
            this.cleanForm();
            console.error('Error en el registro:', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message,
            });
          },
        });
    } else {
      console.error('Contraseñas no coinciden:', error);
    }
  }
  cleanForm() {
    this.registerform.patchValue({
      email: '',
      password: '',
      repeatPassword: '',
    });
  }
  // regresaAlogin() {
  //   this.router.navigate(['/login']);
  // }
}
