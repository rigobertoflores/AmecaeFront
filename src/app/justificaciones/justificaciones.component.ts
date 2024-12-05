import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import Swal from 'sweetalert2';
import { catchError, finalize, of } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { MenuComponent } from '../components/menu/menu.component';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { plantillaJustificacion } from '../interface/plantillaJustificacion';
import { justificacion } from '../interface/justificacion';

@Component({
  selector: 'app-justificaciones',
  standalone: true,
  templateUrl: './justificaciones.component.html',
  styleUrl: './justificaciones.component.css',
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
export class JustificacionesComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() parametro: string = '';
  listainforme: plantillaJustificacion[];
  informe: plantillaJustificacion[];
  plantillaSeleccionada: number = 0;
  his: plantillaJustificacion;
  justificacionEnExpediente: justificacion;
  showLoading: boolean = false;
  private cd: ChangeDetectorRef;
  user: any;

  constructor(
    private Service: Service,
    private router: Router,
    private authService: UserService
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.cargarJustificacionXExpediente(this.parametro);
    this.cargarListaPlantillas();
    this.justificacionEnExpediente = {
      clave: parseInt(this.parametro),
      justificacion1: '',
      id: 0,
      justificacionid: '',
    };
  }

  cargarListaPlantillas() {
    if (this.authService.isAuthenticated()) {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        this.user = JSON.parse(userJson).email.split('@')[0];
      }
    }
    this.Service.getUnico('GetAlljustificacion').subscribe(
      (data: plantillaJustificacion[]) => {
        if (data != null) {
          this.informe = data.filter(
            (informe) => informe.usuario === this.user
          );
        }
      }
    );
  }

  MostrarPlantillaSeleccionada() {
    if (this.plantillaSeleccionada == 0) {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Para agregar una plantilla primero debe seleccionar una',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    } else {
      const histo = this.informe.find(
        (historia) => historia.id == this.plantillaSeleccionada
      );
      if (histo && histo.justificacion !== null) {
        this.justificacionEnExpediente.justificacion1 += histo.justificacion; // Agregar el contenido de histo.hc al final de this.data
        this.justificacionEnExpediente.justificacionid =
          this.plantillaSeleccionada.toString();
        console.log('histo', histo.justificacion);
      }
    }
  }

  subcribeinformeexpediente() {}

  cargarJustificacionXExpediente(parametrourl: any) {
    this.Service.getUnicoParams('GetJustificacion', parametrourl).subscribe(
      (data: justificacion) => {
        if (data != null) {
          this.justificacionEnExpediente = {
            clave: data.clave,
            justificacion1: data.justificacion1 || '',
            id: data.id,
            justificacionid: data.justificacionid,
          };
        }
      }
    );
  }

  guardarinformedentroexpediente() {
    this.showLoading = true;
    let informeexpedienteresult: justificacion;
    informeexpedienteresult = this.justificacionEnExpediente;

    this.Service.postData(
      'PostJustificacion',
      informeexpedienteresult
    ).subscribe((result) => {
      this.justificacionEnExpediente = {
        clave: result.clave,
        justificacion1: result.justificacion1 || '',
        id: result.id,
        justificacionid: result.informeid,
      };
      this.showLoading = false;
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha guardado correctamente la justificacion',
        showConfirmButton: false,
        timer: 3000,
      });
    });
  }

  printContent(content: string) {
    let contenidoHTML = content.replace(/\n/g, '<br>');
    let printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow!.document.write('<html><head><title>Print</title>');
    printWindow!.document.write('<link rel="stylesheet" href="style.css">'); // Si tienes un archivo CSS externo
    printWindow!.document.write('<style>');
    printWindow!.document.write(
      'body { font-family: Arial, sans-serif; margin: 20px; }'
    );
    printWindow!.document.write(
      'h1, h2 { color: darkblue; margin-bottom: 0.5em; }'
    );
    printWindow!.document.write(
      'p { font-size: 16px; line-height: 1.5; text-align: justify; margin-top: 0.5em; }'
    );
    printWindow!.document.write('</style>');
    printWindow!.document.write('</head><body>');
    printWindow!.document.write(contenidoHTML);
    printWindow!.document.write('</body></html>');
    printWindow!.document.close(); // Necesario para que la ventana maneje correctamente los recursos
    printWindow!.focus(); // Foco en la ventana de impresión para el usuario

    // Espera a que el contenido se cargue completamente antes de imprimir
    setTimeout(() => {
      printWindow!!.print();
      printWindow!!.close();
    }, 1000); // Espera 1 segundo para asegurarse de que todo se carga correctamente
  }

  BorrarExpediente() {
    Swal.fire({
      title: '¿Seguro desea eliminar este expediente?',
      text: 'Se eliminará el expediente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.DeleteE(
          'DeleteExpedientes',
          this.justificacionEnExpediente.clave
        )
          .pipe(
            catchError((error) => {
              console.error('Error al eliminar el informe:', error);
              return of(null); // Continúa el flujo incluso con error
            }),
            finalize(() => {
              this.cd.detectChanges(); // Forzar detección de cambios en finalize
            })
          )
          .subscribe((result) => {
            console.log(result);
            this.showLoading = false;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Se elimino el expediente',
              showConfirmButton: false,
              timer: 3000,
            });
            this.router.navigate(['/inicio']);
          });
      }
    });
  }
}
