import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { MenuComponent } from "../components/menu/menu.component";
import { ReactiveFormsModule } from '@angular/forms';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { informeoperatorio } from '../interface/informeoperatorio';
import { LoadingComponent } from '../loading/loading.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informeso-configuracion',
  standalone: true,
  templateUrl: './informeso-configuracion.component.html',
  styleUrl: './informeso-configuracion.component.css',
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
export class InformesoConfiguracionComponent implements OnInit {
  listainforme: informeoperatorio[];
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() data: string = '';
  informeform: FormGroup;
  informe: informeoperatorio[];
  informeeleccionada: number = 0;
  his: informeoperatorio;
  showLoading: boolean = false;
  fechaFormateada: string;
  fechaActual: Date = new Date();
  dia: any = this.fechaActual.getDate();
  mes: any = this.fechaActual.getMonth() + 1; // Los meses empiezan en 0
  año: number = this.fechaActual.getFullYear();
  public mostrarBotonEliminar: boolean = false;

  ajustarAltura(elemento: HTMLTextAreaElement): void {
    elemento.style.height = 'auto'; // Resetea la altura para calcular correctamente
    elemento.style.height = elemento.scrollHeight + 'px'; // Ajusta la altura al contenido
  }

  constructor(private Service: Service) {}

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
    if (!this.informeform.invalid) {
      const infor: informeoperatorio = {
        id: this.informeform.get('id')?.value || 0,
        informe: this.informeform?.get('informe')?.value,
        nombre: this.informeform.get('nombre')?.value,
      };
      this.Service.postData('PostInformeo', infor).subscribe(
        (result: informeoperatorio[]) => {
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
            title: 'Se ha agregado correctamente el informe',
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

  cargarFormulario(his: informeoperatorio) {
    this.informeform = new FormGroup({
      informe: new FormControl('', Validators.required),
      id: new FormControl(),
      nombre: new FormControl('', Validators.required),
    });
  }

  cargarListaInformeform() {
    this.Service.getUnico('GetAllInformeo').subscribe(
      (data: informeoperatorio[]) => {
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
        this.informeform.get('informe')?.setValue(inf.informe); // Contenido de la historia
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
          const infor: informeoperatorio = {
            id: this.informeform.get('id')?.value || 0,
            informe: this.informeform?.get('informe')?.value,
            nombre: this.informeform.get('nombre')?.value,
          };

          this.Service.postData('DeleteInforme', infor).subscribe(
            (result: informeoperatorio[]) => {
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
            }
          );
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

