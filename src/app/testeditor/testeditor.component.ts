import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  NgModule,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { RecetaxPaciente } from '../interface/RecetaxPaciente';
import { CommonModule } from '@angular/common';
import { Service } from './../Services/Service';
import { Tratamiento } from '../interface/Tratamiento';
import Swal from 'sweetalert2';
import { PrintText } from '../interface/PrintText';
import { UserService } from '../Services/user.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-testeditor',
  standalone: true,
  imports: [
    CKEditorModule,
    FormsModule,
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './testeditor.component.html',
  styleUrl: './testeditor.component.css',
})
export class TesteditorComponent implements OnInit {
  Loading: boolean;
  allTreatments: Tratamiento[];
  treatments: Tratamiento[];
  showLoading: boolean = false;

  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() recetas: RecetaxPaciente[];
  @Input() clave: string;
  @Input() fechaActual: string;
  @Input() paciente: FormGroup;

  public model = {
    editorData: '<p>Hello, world!</p>',
  };
  data: string = '';
  tratamientos: any;
  tratamientoSeleccionado: number = 0;
  user: string;
  url: Blob;

  constructor(
    private el: ElementRef,
    private Service: Service,
    private authService: UserService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getTreatments();
  }

  saveText() {
    // const datos = { id: this.id, data: this.data };
    // this.datosDisponibles.emit(datos);
  }

  onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    // const dataactualiza={id:this.id,data:data}
    // this.testeditordata.emit("sdfsdfsdfsdf");
  }

  guardarEditarreceta(data: [id: number, data: string]) {
    this.showLoading = true;
    if (data[1] != null) {
      const receta: RecetaxPaciente = {
        clave: this.clave || '0',
        receta: data[1],
        fecha: this.fechaActual,
        id: data[0],
      };
      this.Service.postData('PostReceta', receta).subscribe(
        (result: RecetaxPaciente[]) => {
          this.showLoading = false;
          this.data = '';
          this.recetas = result;
          console.log(result);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se ha guardado correctamente la receta',
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
    }
  }

  borrarreceta(data: [id: number, data: string]) {
    this.showLoading = true;
    if (data[1] != null) {
      const receta: RecetaxPaciente = {
        clave: this.clave || '0',
        receta: data[1],
        fecha: this.fechaActual,
        id: data[0],
      };
      this.Service.postData('PostDeleteReceta', receta).subscribe(
        (result: RecetaxPaciente[]) => {
          this.data = '';
          this.recetas = result;
          console.log(result);
          this.showLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se ha eliminado correctamente la receta',
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
    }
  }

  printContent(notas: any) {
    if (notas != null) {
      if (this.authService.isAuthenticated()) {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          this.user = JSON.parse(userJson).email.split('@')[0];
        }
      }

      const printext: PrintText = {
        text: notas,
        user: this.user,
        nombrepaciente: this.paciente.get('nombre')?.value,
      };
      this.Service.postData('Print', printext).subscribe(
        (pdfBlob: any) => {
          if (pdfBlob.fileContents) {
            // Decodificar el contenido del PDF desde base64
            const binaryString = window.atob(pdfBlob.fileContents);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            this.url = new Blob([bytes], { type: pdfBlob.contentType });
            const url = window.URL.createObjectURL(this.url);
            window.open(url, '_blank');
          } else {
            console.error('No data received or invalid blob');
          }
        },
        (error) => {
          console.error('Error downloading the PDF:', error);
        }
      );
    }
  }

  getTreatments() {
     if (this.authService.isAuthenticated()) {
       const userJson = localStorage.getItem('user');
       if (userJson) {
         this.user = JSON.parse(userJson).email.split('@')[0];
       }
     }
    this.Loading = true; // Iniciar carga
    this.Service.GetTratamiento().subscribe({
      next: (result: Tratamiento[]) => {
        // Procesar cada tratamiento para convertir los saltos de línea en <br>
        this.allTreatments = result
          .filter((tratamiento) => tratamiento.usuario === this.user)
          .map((tratamiento) => {
            return {
              ...tratamiento,
              descripcion: tratamiento.tratamiento.replace(/\n/g, '<br>'),
            };
          })
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        this.treatments = this.allTreatments;
      },
      error: (error) => {
        // Manejar error aquí
      },
      complete: () => {
        this.Loading = false; // Finalizar carga
      },
    });
  }
  confirmartratamiento(data: [id: number, data: string]) {
    if (this.tratamientoSeleccionado != 0) {
      const trat = this.allTreatments.find(
        (tratamiento) => tratamiento.id == this.tratamientoSeleccionado
      );
      Swal.fire({
        title: 'Seguro desea agregar el tratamiento: ' + trat?.nombre,
        heightAuto: true,
        width: 'auto',
        padding: '1em',
        text: 'Tratamiento : ' + trat?.tratamiento,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Agregar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.guardarTratamientoReceta(data);
        } else this.tratamientoSeleccionado = 0;
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Debe seleccionar un tratamiento',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  guardarTratamientoReceta(data: [id: number, data: string]) {
    if (this.tratamientoSeleccionado == 0 && data[1] != null) {
      return;
    } else {
      const trat = this.allTreatments.find(
        (tratamiento) => tratamiento.id == this.tratamientoSeleccionado
      );
      const receta = this.recetas.find((receta) => receta.id == data[0]);
      if (receta != null && trat && trat.tratamiento !== null) {
        receta.receta += '<p>' + trat.tratamiento;
        +'</p>';
      } else {
        if (trat && trat.tratamiento !== null) {
          this.data += '<p>' + trat.tratamiento.replace(/\n/g, '<br>');
          +'</p>'; // Agregar el contenido de histo.hc al final de this.data
        }
      }
    }
    this.tratamientoSeleccionado = 0;
  }
}
