import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { MenuComponent } from '../components/menu/menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { plantillaJustificacion } from '../interface/plantillaJustificacion';
import { LoadingComponent } from '../loading/loading.component';
import Swal from 'sweetalert2';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-justificacion-configuracion',
  standalone: true,
  templateUrl: './justificacion-configuracion.component.html',
  styleUrl: './justificacion-configuracion.component.css',
  imports: [
    CKEditorModule,
    FormsModule,
    SidebarComponent,
    MenuComponent,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
  ],
})
export class JustificacionConfiguracionComponent implements OnInit {
  listainforme: plantillaJustificacion[];
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() data: string = '';
  informeform: FormGroup;
  informe: plantillaJustificacion[];
  informeeleccionada: number = 0;
  his: plantillaJustificacion;
  showLoading: boolean = false;
  fechaFormateada: string;
  fechaActual: Date = new Date();
  dia: any = this.fechaActual.getDate();
  mes: any = this.fechaActual.getMonth() + 1; // Los meses empiezan en 0
  año: number = this.fechaActual.getFullYear();
  public mostrarBotonEliminar: boolean = false;
  user: any;

  ajustarAltura(elemento: HTMLTextAreaElement): void {
    elemento.style.height = 'auto'; // Resetea la altura para calcular correctamente
    elemento.style.height = elemento.scrollHeight + 'px'; // Ajusta la altura al contenido
  }

  constructor(private Service: Service, private authService: UserService) {}

  ngOnInit(): void {
    this.cargarListaInformeform();
    this.cargarFormulario(this.his);
    this.formatearfecha();
    this.mostrarBotonEliminar = false;
  }

  formatearfecha() {
    this.fechaFormateada = `${this.dia < 10 ? '0' + this.dia : this.dia}/${
      this.mes < 10 ? '0' + this.mes : this.mes
    }/${this.año}`;
  }
  guardarEditarInforme() {
    if (this.authService.isAuthenticated()) {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.user = JSON.parse(userJson).email.split('@')[0];
      }
    }
    if (!this.informeform.invalid) {
      const infor: plantillaJustificacion = {
        id: this.informeform.get('id')?.value || 0,
        justificacion: this.informeform?.get('informe')?.value,
        nombre: this.informeform.get('nombre')?.value,
        usuario: this.user,
      };
      this.Service.postData('PostJustificacionplantilla', infor).subscribe(
        (result: plantillaJustificacion[]) => {
          this.data = '';
          this.listainforme = result;
          this.informe = result;
          this.informeform.get('informe')?.setValue(''); // Contenido de la historia
          this.informeform.get('id')?.setValue(0); // ID de la historia
          this.informeform.get('nombre')?.setValue(''); // No
          this.informeeleccionada = 0;
          this.mostrarBotonEliminar = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se ha agregado correctamente la justificación',
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
    } else {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Debe rellenar todos los campos para poder guardar',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  cargarFormulario(his: plantillaJustificacion) {
    this.informeform = new FormGroup({
      informe: new FormControl('', Validators.required),
      id: new FormControl(),
      nombre: new FormControl('', Validators.required),
    });
  }

  cargarListaInformeform() {
    this.Service.getUnico('GetAlljustificacion').subscribe(
      (data: plantillaJustificacion[]) => {
        if (data != null) {
          this.informe = data;
        }
      }
    );
  }

  onInformeChange($event: any) {
        if (this.informeeleccionada == 0) {
      this.informeform.get('informe')?.setValue(''); // Contenido de la historia
      this.informeform.get('id')?.setValue(0); // ID de la historia
      this.informeform.get('nombre')?.setValue(''); // No
      this.mostrarBotonEliminar = false; // Cambia este valor para mostrar o no el botón
    } else {
      const inf = this.informe.find(
        (info) => info.id == this.informeeleccionada
      );
      if (inf != null) {
        this.mostrarBotonEliminar = true; // Cambia este valor para mostrar o no el botón
        this.informeform.get('informe')?.setValue(inf.justificacion); // Contenido de la historia
        this.informeform.get('id')?.setValue(inf.id); // ID de la historia
        this.informeform.get('nombre')?.setValue(inf.nombre); // Nombre de la historia
        setTimeout(
          () =>
            this.ajustarAltura(
              document.getElementById(
                'nombreinputtexthistoria'
              ) as HTMLTextAreaElement
            ),
          0
        );
      }
    }
  }

  eliminarInforme() {
    if (!this.informeform.invalid) {
      Swal.fire({
        title: '¿Está seguro de que desea eliminar este informe?',
        text: 'Esta acción no se puede deshacer. Se eliminará el informe.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const infor: plantillaJustificacion = {
            id: this.informeform.get('id')?.value || 0,
            justificacion: this.informeform?.get('informe')?.value,
            nombre: this.informeform.get('nombre')?.value,
            usuario: this.informeform.get('usuario')?.value,
          };

          this.Service.postData(
            'PostJustificacionplantillaDelete',
            infor
          ).subscribe((result: plantillaJustificacion[]) => {
            this.data = '';
            this.listainforme = result;
            this.informe = result;
            this.informeform.get('informe')?.setValue(''); // Limpiar el contenido del informe
            this.informeform.get('id')?.setValue(0); // Limpiar el ID
            this.informeform.get('nombre')?.setValue(''); // Limpiar el nombre
            this.informeeleccionada = 0;
            this.mostrarBotonEliminar = false;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'El informe se ha eliminado correctamente',
              showConfirmButton: false,
              timer: 2000,
            });
          });
        }
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'No se puede eliminar! El formulario no es válido',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
}
