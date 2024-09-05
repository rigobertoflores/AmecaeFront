import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const textarea = document.getElementById(
      'nombreinputtexthistoria'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const lines = textarea.value.substr(0, cursorPosition).split('\n');
    const currentLineIndex = lines.length - 1;
    const currentLine = lines[currentLineIndex];

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveCursorUp(textarea, currentLineIndex, cursorPosition, lines);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.moveCursorDown(
        textarea,
        currentLineIndex,
        cursorPosition,
        lines,
        currentLine.length
      );
    }
  }

  private moveCursorUp(
    textarea: HTMLTextAreaElement,
    currentLineIndex: number,
    cursorPosition: number,
    lines: string[]
  ) {
    if (currentLineIndex === 0) return; // Ya está en la primera línea

    const previousLineLength = lines[currentLineIndex - 1].length;
    const newCursorPosition =
      cursorPosition - lines[currentLineIndex].length - 1;

    // Asegurar que la nueva posición no sea negativa
    const adjustedPosition = newCursorPosition >= 0 ? newCursorPosition : 0;
    textarea.setSelectionRange(adjustedPosition, adjustedPosition);
  }

  private moveCursorDown(
    textarea: HTMLTextAreaElement,
    currentLineIndex: number,
    cursorPosition: number,
    lines: string[],
    currentLineLength: number
  ) {
    const nextLines = textarea.value.substr(cursorPosition).split('\n');
    if (nextLines.length <= 1) return; // Ya está en la última línea

    const newCursorPosition = cursorPosition + currentLineLength + 1;

    // Asegurar que la nueva posición no exceda la longitud del valor del textarea
    const adjustedPosition =
      newCursorPosition <= textarea.value.length
        ? newCursorPosition
        : textarea.value.length;
    textarea.setSelectionRange(adjustedPosition, adjustedPosition);
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
}
