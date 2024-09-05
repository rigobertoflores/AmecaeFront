import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Service } from './../Services/Service';
import { catchError, finalize, of } from 'rxjs';
import { Complementos } from '../interface/Complementos';
import { StandaloneGalleryComponent } from '../standalone-gallery/standalone-gallery.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complementarios',
  standalone: true,
  templateUrl: './complementarios.component.html',
  styleUrl: './complementarios.component.css',
  imports: [
    MenuComponent,
    SidebarComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    StandaloneGalleryComponent,
  ],
})
export class ComplementariosComponent implements OnInit {
  selectedFile: any;
  parametro: any;
  documentos: { src: string; alt: string; ext: string; id: number }[];
  showLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private Service: Service,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.parametro = this.route.snapshot.paramMap.get('id');
    this.cargarComplementariosPaciente(this.parametro);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0] as File; // Afirmación de tipo aquí
    }
  }

  upload(): void {
    this.showLoading = true;
    this.cd.detectChanges(); // Forzar la detección de cambios aquí

    if (!this.selectedFile) {
      // Use SweetAlert2 to display the alert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, selecciona un archivo primero.',
      }).then(() => {
        this.cd.detectChanges(); // Forzar la detección de cambios después de actualizar showLoading
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ha guardado el archivo correctamente',
          showConfirmButton: false,
          timer: 2000,
        });
      });
      this.showLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('documento', this.selectedFile, this.selectedFile.name);
    formData.append('id', this.parametro || '');
    this.Service.postData('PostPdf', formData)
      .pipe(
        finalize(() => {
          this.cd.detectChanges(); // Forzar la detección de cambios en finalize
          this.showLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se ha subido correctamente el archivo',
            showConfirmButton: false,
            timer: 2000,
          });
        }),
        catchError((error) => {
          console.error('Error uploading image:', error);
          this.showLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrió un error al subir el archivo',
          });
          return of([]); // Maneja el error y continúa el flujo
        })
      )
      .subscribe((data: Complementos[]) => {
        this.documentos = data.map((documento) => ({
          src: `data:image/jpeg;base64,${documento.blobData}`,
          alt: documento.nombre,
          ext: documento.ext,
          id: documento.id,
        }));
        this.cd.detectChanges();
      });
  }

  openDialog(imageUrl: string): void {
    this.dialog.open(StandaloneGalleryComponent, {
      data: {
        img: imageUrl,
      },
      panelClass: 'custom-dialog-container', // Opcional: para estilos personalizados3
    });
  }

  cargarComplementariosPaciente(parametrourl: any) {
    if (parametrourl != '0') {
      this.Service.getListParams(
        'GetComplementariosPaciente',
        parametrourl
      ).subscribe((data: Complementos[]) => {
        if (data != null)
          this.documentos = data.map((documento) => ({
            src: `data:image/jpeg;base64,${documento.blobData}`,
            alt: documento.nombre,
            ext: documento.ext,
            id: documento.id,
          }));
      });
    }
  }

  // deleteComplementario(id: number) {
  //   this.Service.postData('DeleteComplementario', id)
  //     .pipe(
  //       catchError((error) => {
  //         console.error('Error uploading profile image:', error);
  //         return of(null); // Continúa el flujo incluso con error
  //       }),
  //       finalize(() => {
  //         this.cd.detectChanges(); // Forzar detección de cambios en finalize
  //       })
  //     )
  //     .subscribe((data: Complementos[]) => {
  //       this.documentos = data.map((documento) => ({
  //         src: `data:image/jpeg;base64,${documento.blobData}`,
  //         alt: documento.nombre,
  //         ext: documento.ext,
  //         id: documento.id,
  //       }));
  //       this.cd.detectChanges(); // Opcional, si es necesario después de cambiar 'images'
  //     });
  // }

  deleteComplementario(id: number) {
    Swal.fire({
      title: '¿Seguro desea eliminar este archivo?',
      text: 'Se eliminará el complementario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.postData('DeleteComplementario', id)
          .pipe(
            catchError((error) => {
              console.error('Error al eliminar el tratamiento:', error);
              return of(null); // Continúa el flujo incluso con error
            }),
            finalize(() => {
              this.cd.detectChanges(); // Forzar detección de cambios en finalize
            })
          )
          .subscribe((data: Complementos[]) => {
            if (data) {
              this.documentos = data.map((documento) => ({
                src: `data:image/jpeg;base64,${documento.blobData}`,
                alt: documento.nombre,
                ext: documento.ext,
                id: documento.id,
              }));
              this.cd.detectChanges(); // Opcional, si es necesario después de cambiar 'images'
              Swal.fire({
                title: 'Eliminado!',
                text: 'El archivo complementario ha sido eliminado.',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
              });
            }
          });
      }
    });
  }
}
