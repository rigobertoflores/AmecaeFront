import { Component } from '@angular/core';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  userService: any;
  resetform: any;

  constructor(private authService: UserService,private router: Router) {}
  ngOnInit(): void {
    this.cargarFormulario();
    }

    cargarFormulario() {
      this.resetform = new FormGroup({
        email: new FormControl(''),
        
      });
    }

    resetPass(){      
            console.log("Entra a reset");
            if (this.resetform.get('email')?.value) {
              this.authService.sendPasswordResetEmail(this.resetform.get('email')?.value).then(() => {
                console.log("Se ha enviado el correo con la contraseña");
                // Mostrar algún mensaje o realizar alguna acción después de enviar el correo
                this.resetform.patchValue({
                  email: '' 
                });
              });
            }
            else {
        console.log("Debe rellenar el campo de email");
        //      mostrar un mensaje para pedir que rellene el campo del email
            }    }

    backToLogin(){
      this.router.navigate(['/login']);
    }
}
