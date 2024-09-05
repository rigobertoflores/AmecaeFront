import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ReactiveFormsModule } from '@angular/forms';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { informeexpediente } from '../interface/informexpediente';
import { informeoperatorio } from '../interface/informeoperatorio';
import { LoadingComponent } from '../loading/loading.component';
import Swal from 'sweetalert2';
import { catchError, finalize, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testeditorinformeso',
  standalone: true,
  imports: [
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './testeditorinformeso.component.html',
  styleUrl: './testeditorinformeso.component.css',
})
export class TesteditorinformesoComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() parametro: string = '';
  listainforme: informeoperatorio[];
  informe: informeoperatorio[];
  informeeleccionada: number = 0;
  his: informeoperatorio;
  informeexpediente: informeexpediente;
  showLoading: boolean = false;
  private cd: ChangeDetectorRef;

  constructor(private Service: Service, private router: Router) {}

  ngOnInit(): void {
    this.cargarinformeexpedientePaciente(this.parametro);
    this.cargarListaHistoria();
    this.informeexpediente = {
      clave: parseInt(this.parametro),
      informe: '',
      id: 0,
      informeid: '',
    };
  }

  ngAfterViewInit(): void {
    this.ajustarAltura(
      document.getElementById('nombreinputtexthistoria') as HTMLTextAreaElement
    );
  }

  ajustarAltura(elemento: HTMLTextAreaElement): void {
    elemento.style.height = 'auto'; // Resetea la altura para calcular correctamente
    elemento.style.height = elemento.scrollHeight + 'px'; // Ajusta la altura al contenido
  }
  cargarListaHistoria() {
    this.Service.getUnico('GetAllInformeo').subscribe(
      (data: informeoperatorio[]) => {
        if (data != null) {
          this.informe = data;
        }
      }
    );
  }

  guardarinformeexpediente() {
    if (this.informeeleccionada == 0) {
      return;
    } else {
      const histo = this.informe.find(
        (historia) => historia.id == this.informeeleccionada
      );
      if (histo && histo.informe !== null) {
        this.informeexpediente.informe += histo.informe; // Agregar el contenido de histo.hc al final de this.data
        this.informeexpediente.informeid = this.informeeleccionada.toString();
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

  subcribeinformeexpediente() {}

  cargarinformeexpedientePaciente(parametrourl: any) {
    this.Service.getUnicoParams('GetInforme', parametrourl).subscribe(
      (data: informeexpediente) => {
        if (data != null) {
          this.informeexpediente = {
            clave: data.clave,
            informe: data.informe || '',
            id: data.id,
            informeid: data.informeid,
          };
        }
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
    );
  }

  guardarinformedentroexpediente() {
    this.showLoading = true;
    let informeexpedienteresult: informeexpediente;
    informeexpedienteresult = this.informeexpediente;

    this.Service.postData(
      'PostInformeExpediente',
      informeexpedienteresult
    ).subscribe((result) => {
      this.informeexpediente = {
        clave: result.clave,
        informe: result.informe || '',
        id: result.id,
        informeid: result.informeid,
      };
      setTimeout(
        () =>
          this.ajustarAltura(
            document.getElementById(
              'nombreinputtexthistoria'
            ) as HTMLTextAreaElement
          ),
        0
      );
      this.showLoading = false;
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se ha guardado correctamente el informe',
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
        this.Service.DeleteE('DeleteExpedientes', this.informeexpediente.clave)
          .pipe(
            catchError((error) => {
              console.error('Error al eliminar el tratamiento:', error);
              return of(null); // Continúa el flujo incluso con error
            }),
            finalize(() => {
              this.cd.detectChanges(); // Forzar detección de cambios en finalize
            })
          )
          .subscribe((result) => {
            console.log(result);
            setTimeout(
              () =>
                this.ajustarAltura(
                  document.getElementById(
                    'nombreinputtexthistoria'
                  ) as HTMLTextAreaElement
                ),
              0
            );
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
