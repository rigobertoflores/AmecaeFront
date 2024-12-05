import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
} from '@angular/fire/auth';
import { error } from 'jquery';
import { catchError, from, map, Observable, tap, throwError } from 'rxjs';
import { UrlsAuth, UrlsBackend } from '../enums/urls_back';
import { Service } from './../Services/Service';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$: Observable<any>;

  constructor(private auth: Auth, private Service: Service) {
    this.user$ = authState(this.auth);
  }

  // register(email :string , password : string){
  //   return createUserWithEmailAndPassword(this.auth, email,password);
  //  }

  register(email: string, password: string) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      catchError((error) =>
        throwError(() => new Error(this.handleError(error)))
      )
    );
  }

  private handleError(error: any): string {
    if (error.code === 'auth/email-already-in-use') {
      return 'Este correo electrónico ya está registrado. Por favor, intenta iniciar sesión.';
    } else {
      return 'Ha ocurrido un error al registrarte. Por favor, intenta de nuevo más tarde.';
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      // Guarda solamente la información necesaria del usuario en el almacenamiento local
      const user = {
        uid: result.user.uid,
        email: result.user.email,
        // cualquier otra información relevante que quieras almacenar
      };
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Usuario logueado con Firebase', result);
      return true;
    } catch (error: any) {
      console.error('Error en el logging', error);

      // Manejo de errores y mensajes
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found'
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: 'El usuario o la contraseña son incorrectos. Por favor, verifique e intente nuevamente.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: 'Ocurrió un error al intentar acceder. Por favor, comuníquese con el administrador.',
        });
      }

      return false;
    }
  }

  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      let data = false;
      localStorage.setItem('user', JSON.stringify(result.user));
      if (result.user.email != null) {
        let params = new HttpParams().set('email', result.user.email);
        data = await this.Service.getUsers(
          UrlsBackend.ApiAuth,
          UrlsAuth.GetUsersPermitidos,
          result.user.email
        ).toPromise(); // Convertir el observable en promesa
        console.log('usuario logueado con google', data);
      }
      return data;
    } catch (error) {
      console.error('Error logging in with Google', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }

  // Método para enviar un correo de recuperación de contraseña
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Correo de recuperación enviado.');
    } catch (error) {
      console.error('Error enviando el correo de recuperación', error);
    }
  }
  // async changePassword(newPassword: string): Promise<void> {
  //   const user = this.auth.currentUser;
  //   if (user) {
  //     try {
  //       await updatePassword(user, newPassword);
  //       console.log('Contraseña actualizada con éxito.');
  //     } catch (error) {
  //       console.error('Error al actualizar la contraseña', error);
  //       throw error;
  //     }
  //   } else {
  //     console.error('No hay usuario logueado para cambiar la contraseña');
  //     throw new Error('No user logged in');
  //   }
  // }

  changePassword(newPassword: string): Observable<void> {
    const user = this.auth.currentUser;
    if (user) {
      return from(updatePassword(user, newPassword)).pipe(
        tap(() => console.log('Contraseña actualizada con éxito.')),
        catchError((error) => {
          console.error('Error al actualizar la contraseña', error);
          return throwError(() => new Error(error)); // Re-throw the error as an observable
        })
      );
    } else {
      console.error('No hay usuario logueado para cambiar la contraseña');
      return throwError(() => new Error('No user logged in'));
    }
  }

  logout() {
    return from(
      signOut(this.auth).then(() => {
        localStorage.removeItem('user');
      })
    );
  }

  async obtenerImagenPerfil() {
    const user = this.auth.currentUser;
    if (user) {
      console.log('Imagen del perfil:', user.photoURL);
      return user.photoURL; // URL de la imagen del perfil del usuario
    } else {
      console.log('No hay usuario logueado.');
      return null;
    }
  }

  isGoogleUser(): Observable<boolean> {
    return authState(this.auth).pipe(
      map((user) => {
        if (!user) return false; // No user logged in
        const providerId = user.providerData[0]?.providerId; // Get provider ID
        return providerId === 'google.com'; // Check if the provider is Google
      })
    );
  }
}
