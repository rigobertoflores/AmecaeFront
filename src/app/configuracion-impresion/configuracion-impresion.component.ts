import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { MenuComponent } from '../components/menu/menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { ConfiguracionImpresion } from '../interface/ConfiguracionImpresion';
import { UserService } from '../Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion-impresion',
  standalone: true,
  templateUrl: './configuracion-impresion.component.html',
  styleUrl: './configuracion-impresion.component.css',
  imports: [
    FormsModule,
    SidebarComponent,
    MenuComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class ConfiguracionImpresionComponent implements OnInit {
  configimpresion: FormGroup;
  listaimpre: ConfiguracionImpresion[];
  user: string;
  userseleccionado: number = 0;

  constructor(private authService: UserService, private Service: Service) {}

  ngOnInit(): void {
    this.cargarListaImpresion();
    this.cargarFormulario();
  }

  guardarEditarImpre() {
    if (this.authService.isAuthenticated()) {
      const userJson = localStorage.getItem('user');
      console.log(this.authService, '1');
      if (userJson) {
        this.user = JSON.parse(userJson).email.split('@')[0];
      }
    }
    let userprint: ConfiguracionImpresion | undefined;
    if (this.listaimpre != undefined) {
      userprint = this.listaimpre.find((print) => print.usuario == this.user);
    }
    const id = this.configimpresion.get('id')?.value;
    if ((id == 0 || id == null) && userprint != undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El Doctor ya cuenta con una plantilla de receta',
      });
      this.resetForm();
      return;
    }

    if (!this.configimpresion.invalid) {
      const impresion: ConfiguracionImpresion = {
        id: this.configimpresion.get('id')?.value || 0,
        largo: this.configimpresion?.get('largo')?.value,
        ancho: this.configimpresion.get('ancho')?.value,
        margenDerecho: this.configimpresion?.get('margen_derecho')?.value,
        margenIzquierdo: this.configimpresion.get('margen_izquierdo')?.value,
        margenArriba: this.configimpresion?.get('margen_arriba')?.value,
        margenAbajo: this.configimpresion.get('margen_abajo')?.value,
        encabezado: this.configimpresion.get('encabezado')?.value,
        espacio: this.configimpresion.get('espacio')?.value,
        usuario: this.user,
      };
      this.Service.postData('PostConfiguraImprimir', impresion).subscribe(
        (result: ConfiguracionImpresion[]) => {
          this.listaimpre = result;
          this.userseleccionado = 0;
          this.resetForm();
        }
      );
    }
  }

  cargarFormulario() {
    this.configimpresion = new FormGroup({
      id: new FormControl(),
      largo: new FormControl(),
      ancho: new FormControl(),
      margen_derecho: new FormControl(),
      margen_izquierdo: new FormControl(),
      margen_arriba: new FormControl(),
      margen_abajo: new FormControl(),
      encabezado: new FormControl(),
      usuario: new FormControl(),
      espacio: new FormControl(),
    });
  }

  cargarListaImpresion() {
    this.Service.getUnico('ListaImpresionUsuario').subscribe(
      (data: ConfiguracionImpresion[]) => {
        if (data != null) {
          this.listaimpre = data;
        }
      }
    );
  }

  onUserChange($event: any) {
    if (this.userseleccionado == 0) {
      this.resetForm();
    } else {
      const userprint = this.listaimpre.find(
        (print) => print.id == this.userseleccionado
      );
      if (userprint != null) {
        this.configimpresion.get('id')?.setValue(userprint.id);
        this.configimpresion.get('largo')?.setValue(userprint.largo);
        this.configimpresion.get('ancho')?.setValue(userprint.ancho);
        this.configimpresion
          .get('margen_derecho')
          ?.setValue(userprint.margenDerecho);
        this.configimpresion
          .get('margen_izquierdo')
          ?.setValue(userprint.margenIzquierdo);
        this.configimpresion
          .get('margen_arriba')
          ?.setValue(userprint.margenArriba);
        this.configimpresion
          .get('margen_abajo')
          ?.setValue(userprint.margenAbajo);
        this.configimpresion.get('encabezado')?.setValue(userprint.encabezado);
        this.configimpresion.get('espacio')?.setValue(userprint.espacio);
      }
    }
  }

  resetForm(): void {
    this.configimpresion.get('largo')?.setValue(0);
    this.configimpresion.get('id')?.setValue(0);
    this.configimpresion.get('ancho')?.setValue(0);
    this.configimpresion.get('margen_derecho')?.setValue(0);
    this.configimpresion.get('margen_izquierdo')?.setValue(0);
    this.configimpresion.get('margen_arriba')?.setValue(0);
    this.configimpresion.get('margen_abajo')?.setValue(0);
    this.configimpresion.get('encabezado')?.setValue('');
    this.configimpresion.get('espacio')?.setValue(0);
  }
}
