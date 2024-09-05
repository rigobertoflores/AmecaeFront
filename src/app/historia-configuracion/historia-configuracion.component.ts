import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { MenuComponent } from "../components/menu/menu.component";
import { Historia } from '../interface/Historia';
import { ReactiveFormsModule } from '@angular/forms';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-historia-configuracion',
  standalone: true,
  templateUrl: './historia-configuracion.component.html',
  styleUrl: './historia-configuracion.component.css',
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
export class HistoriaConfiguracionComponent implements OnInit {
  listahistorias: Historia[];
  public Editor = ClassicEditor;
  fullScreenMode = false;
  @Input() data: string = '';
  historiaform: FormGroup;
  historias: Historia[];
  historiaSeleccionada: number = 0;
  his: Historia;
  showLoading: boolean = false;
  fechaFormateada: string;
  fechaActual: Date = new Date();
  dia: any = this.fechaActual.getDate();
  mes: any = this.fechaActual.getMonth() + 1; // Los meses empiezan en 0
  año: number = this.fechaActual.getFullYear();

  ajustarAltura(elemento: HTMLTextAreaElement): void {
    elemento.style.height = 'auto'; // Resetea la altura para calcular correctamente
    elemento.style.height = elemento.scrollHeight + 'px'; // Ajusta la altura al contenido
  }

  constructor(private Service: Service) {}

  ngOnInit(): void {
    this.cargarListaHistoria();
    this.cargarFormulario(this.his);
    this.formatearfecha();
  }
  formatearfecha() {
    this.fechaFormateada = `${this.dia < 10 ? '0' + this.dia : this.dia}/${
      this.mes < 10 ? '0' + this.mes : this.mes
    }/${this.año}`;
  }
  guardarEditarHistoria() {
    this.showLoading = true;
    if (!this.historiaform.invalid) {
      const historia: Historia = {
        id: this.historiaform.get('id')?.value || 0,
        hc: this.historiaform?.get('hc')?.value,
        nombre: this.historiaform.get('nombre')?.value,
      };
      this.Service.postData('PostHistoria', historia).subscribe(
        (result: Historia[]) => {
          this.data = '';
          this.listahistorias = result;
          this.historias = result;
          this.historiaform.get('hc')?.setValue(''); // Contenido de la historia
          this.historiaform.get('id')?.setValue(0); // ID de la historia
          this.historiaform.get('nombre')?.setValue(''); // No
          this.historiaSeleccionada = 0;
          this.showLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se han guardado la historia correctamente',
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
    } else {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Debe agregar datos para poder guardar',
        showConfirmButton: false,
        timer: 2000,
      });
       this.showLoading = false;
    }
  }

  cargarFormulario(his: Historia) {
    this.historiaform = new FormGroup({
      hc: new FormControl(),
      id: new FormControl(),
      nombre: new FormControl('', Validators.required),
    });
  }

  cargarListaHistoria() {
    this.Service.getUnico('GetAllHistorias').subscribe((data: Historia[]) => {
      if (data != null) {
        this.historias = data;
      }
    });
  }

  onHistoriaChange($event: any) {
    if (this.historiaSeleccionada == 0) {
      this.historiaform.get('hc')?.setValue(''); // Contenido de la historia
      this.historiaform.get('id')?.setValue(0); // ID de la historia
      this.historiaform.get('nombre')?.setValue(''); // No
    } else {
      const histo = this.historias.find(
        (historia) => historia.id == this.historiaSeleccionada
      );
      if (histo != null) {
        this.historiaform.get('hc')?.setValue(histo.hc); // Contenido de la historia
        this.historiaform.get('id')?.setValue(histo.id); // ID de la historia
        this.historiaform.get('nombre')?.setValue(histo.nombre); // Nombre de la historia
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
}

