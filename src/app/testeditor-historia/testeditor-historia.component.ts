import {
  AfterViewInit,
  Component,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Historia } from '../interface/Historia';
import { ReactiveFormsModule } from '@angular/forms';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { Expediente } from '../interface/Expediente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-testeditor-historia',
  standalone: true,
  imports: [CKEditorModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './testeditor-historia.component.html',
  styleUrl: './testeditor-historia.component.css',
})
export class TesteditorHistoriaComponent implements OnInit, AfterViewInit {
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() parametro: string = '';
  listahistorias: Historia[];
  historias: Historia[];
  historiaSeleccionada: number = 0;
  his: Historia;
  expediente: Expediente;

  constructor(private Service: Service) {}

  ngOnInit(): void {
    this.cargarExpedientePaciente(this.parametro);
    this.cargarListaHistoria();
    this.expediente = {
      clave: parseInt(this.parametro),
      expediente1: '',
      id: 0,
      historiaId: '',
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
    this.Service.getUnico('GetAllHistorias').subscribe((data: Historia[]) => {
      if (data != null) {
        this.historias = data;
      }
    });
  }

  guardarHistoriaExpediente() {
    if (this.historiaSeleccionada == 0) {
      return;
    } else {
      const histo = this.historias.find(
        (historia) => historia.id == this.historiaSeleccionada
      );
      if (histo && histo.hc !== null) {
        this.expediente.expediente1 += histo.hc; // Agregar el contenido de histo.hc al final de this.data
        this.expediente.historiaId = this.historiaSeleccionada.toString();
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

  subcribeExpediente() {}

  cargarExpedientePaciente(parametrourl: any) {
    this.Service.getUnicoParams('GetExpediente', parametrourl).subscribe(
      (data: Expediente) => {
        if (data != null) {
          this.expediente = {
            clave: data.clave,
            expediente1: data.expediente1 || '',
            id: data.id,
            historiaId: data.historiaId,
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

  guardarHistoriadentroExpediente() {
    let expedienteresult: Expediente;
    expedienteresult = this.expediente;

    this.Service.postData('PostExpediente', expedienteresult).subscribe(
      (result) => {
        this.expediente = {
          clave: this.expediente.clave,
          expediente1: result.expediente1 || '',
          id: result.id,
          historiaId: result.historiaId,
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
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se actualizó la historia del paciente',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    );

    // else{
    //   const expediente= this.historias.find(historia => historia.id == this.historiaSeleccionada);
    //    expediente={
    //    hc:this.data,
    //    id:

    //    };
    // }
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
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const textarea = document.getElementById(
      'nombreinputtexthistoria'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const lines = textarea.value.split('\n'); // Dividimos todo el texto en líneas
    const currentLineIndex = lines.findIndex(
      (line) =>
        textarea.selectionStart <= textarea.value.indexOf(line) + line.length
    ); // Obtener la línea actual

    // Obtener la posición del primer asterisco en la primera línea
    const firstAsteriskPosition = lines[0].indexOf('*');
    if (firstAsteriskPosition === -1) return; // Si no hay asterisco, no hacemos nada

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveCursorUp(textarea, currentLineIndex, firstAsteriskPosition);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveCursorDown(
        textarea,
        currentLineIndex,
        lines.length,
        firstAsteriskPosition
      );
    }
  }

  private moveCursorUp(
    textarea: HTMLTextAreaElement,
    currentLineIndex: number,
    asteriskPosition: number
  ) {
    if (currentLineIndex === 0) return; // Ya está en la primera línea

    const previousLineStart =
      textarea.value.split('\n').slice(0, currentLineIndex).join('\n').length +
      1; // Longitud de las líneas anteriores para ajustar la posición

    // Posicionar el cursor justo después del asterisco en la línea anterior
    textarea.setSelectionRange(
      previousLineStart + asteriskPosition + 1,
      previousLineStart + asteriskPosition + 1
    );
  }

  private moveCursorDown(
    textarea: HTMLTextAreaElement,
    currentLineIndex: number,
    totalLines: number,
    asteriskPosition: number
  ) {
    if (currentLineIndex >= totalLines - 1) return; // Ya está en la última línea

    const nextLineStart =
      textarea.value
        .split('\n')
        .slice(0, currentLineIndex + 1)
        .join('\n').length + 1; // Longitud de las líneas anteriores para ajustar la posición

    // Posicionar el cursor justo después del asterisco en la línea siguiente
    textarea.setSelectionRange(
      nextLineStart + asteriskPosition + 1,
      nextLineStart + asteriskPosition + 1
    );
  }
}
