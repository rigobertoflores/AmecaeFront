import {
  ApplicationConfig,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ChangeDetectorRef,
  Renderer2,
} from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from './../Services/Service';
import { Paciente } from '../interface/Paciente';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StandaloneGalleryComponent } from '../standalone-gallery/standalone-gallery.component';
import { MatDialog } from '@angular/material/dialog';
import { ImagenPaciente } from '../interface/ImagenPaciente';
import { TesteditorComponent } from '../testeditor/testeditor.component';
import { Expediente } from '../interface/Expediente';
import { RecetaxPaciente } from '../interface/RecetaxPaciente';
import { event } from 'jquery';
import { TesteditorHistoriaComponent } from '../testeditor-historia/testeditor-historia.component';
import { NotasComponent } from '../notas/notas.component';
import { nota } from '../interface/nota';
import { FotoPaciente } from '../interface/FotoPaciente';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { provideLottieOptions } from 'ngx-lottie';
import { TesteditorinformesoComponent } from '../testeditorinformeso/testeditorinformeso.component';
import { LoadingComponent } from '../loading/loading.component';
import { catchError, finalize, of } from 'rxjs';
import Swal from 'sweetalert2';
import { ComplementariosComponent } from '../complementarios/complementarios.component';
import { CalculadoraIMCComponent } from '../calculadora-imc/calculadora-imc.component';
import { UrlsBackend, UrlsPacientes } from '../enums/urls_back';

export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
  ],
};

@Component({
  selector: 'app-expediente-paciente',
  standalone: true,
  templateUrl: './expediente-paciente.component.html',
  styleUrl: './expediente-paciente.component.css',
  imports: [
    MenuComponent,
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    StandaloneGalleryComponent,
    TesteditorComponent,
    TesteditorHistoriaComponent,
    NotasComponent,
    LoadingComponent,
    LottieComponent,
    TesteditorinformesoComponent,
    ComplementariosComponent,
    CalculadoraIMCComponent,
  ],
})
export class ExpedientePacienteComponent implements OnInit {
  parametro: string | null = null;
  pacientedatos: Paciente;
  PacienteFormulario: FormGroup;
  images: { src: string; alt: string; id: number }[];
  imagenperfil: { src: string };
  imagenesPaciente: ImagenPaciente[];
  expediente: Expediente;
  historia: string;
  fechaActual: Date = new Date();
  dia: any = this.fechaActual.getDate();
  mes: any = this.fechaActual.getMonth() + 1; // Los meses empiezan en 0
  año: number = this.fechaActual.getFullYear();
  fechaFormateada: string;
  @ViewChild(TesteditorComponent, { static: true })
  hijoComponent: TesteditorComponent;
  @ViewChild(NotasComponent, { static: true })
  hijonotaComponent: NotasComponent;
  datareceta: void;
  recetas: RecetaxPaciente[];
  editreceta: number | null;
  selectedFile: any;
  notas: nota[];
  showLoading: boolean = false;
  fechaconsultaactual: string;
  isLoading = false;
  maxDate: string;
  minDate: string;
  @ViewChildren('input') inputs!: QueryList<ElementRef>; // Asume que todos los campos de entrada tienen la referencia #input
  imprimirExpCompleto: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private Service: Service,
    public dialog: MatDialog,
    private router: Router,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    const currentDate = new Date();
    const maxDateNac = new Date();
    const minDateNac = new Date();
    minDateNac.setFullYear(currentDate.getFullYear() - 130);

    this.maxDate = this.formatDateFechaNacimiento(maxDateNac);
    this.minDate = this.formatDateFechaNacimiento(minDateNac);
  }

  ngOnInit(): void {
    this.formatearfecha();
    this.parametro = this.route.snapshot.paramMap.get('id');
    if (Number(this.parametro) > 0) {
      this.imprimirExpCompleto = true;
      this.cargarContenidoPaciente(this.parametro);
      this.cargarImagenPaciente(this.parametro);
      this.cargarRecetasPaciente(this.parametro);
      this.cargarNotasPaciente(this.parametro);
      this.cargarImagenPerfilPaciente(this.parametro);
    } else {
      const pacienteVacio: Paciente = {
        id: 0,
        clave: 0,
        sexo: '',
        fechaDeNacimiento: '', // Considera una fecha predeterminada si es necesario
        nombre: '',
        estadoCivil: 'NoEspecificado',
        ocupacion: '',
        domicilio: '',
        poblacion: '',
        telefono: '',
        email: '',
        nombreDelEsposo: '',
        edadDelEsposo: null,
        ocupacionEsposo: '',
        referencia: '',
        diabetes: 'NoEspecificado',
        hipertension: 'No',
        trombosis: 'NoEspecificado',
        cardiopatias: 'No',
        cancer: '',
        enfermedadesGeneticas: '',
        otraEnfermedad: '',
        inmunizaciones: '',
        alcoholismo: 'NoEspecificado',
        tabaquismo: 'NoEspecificado',
        tabaquismoPasivo: 'NoEspecificado',
        drogasOmedicamentos: '',
        grupoSanguineo: '',
        propiasDeLaInfancia: '',
        rubeola: 'No',
        amigdalitis: 'No',
        bronquitis: '',
        bronconeumonia: 'No',
        hepatitisViralTipo: '',
        parasitosis: 'No',
        toxoplasmosis: 'No',
        citomegalovirus: 'No',
        herpes: '',
        clamydiasis: 'No',
        hiv: 'No',
        sifilis: 'No',
        micosis: 'No',
        eip: 'No',
        diabetesMellitus: 'No',
        otrasEndocrinas: '',
        nefropatias: '',
        digestivas: '',
        neurologicas: '',
        hematologicas: '',
        tumores: '',
        condilomatosis: 'No',
        displasias: '',
        alergia: '',
        fechaConsulta: '',
        fechaUltimaConsulta: '',
        cardiopatiaFamiliar: '',
        hipertensionFamiliar: '',
      };

      this.cargarFormulario(pacienteVacio);
    }
  }
  formatDateFechaNacimiento(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  cargarContenidoPaciente(parametrourl: any) {
    this.showLoading = true;
    this.Service.getUnicoParams('GetPacienteId', parametrourl).subscribe(
      (data: Paciente) => {
        this.cargarFormulario(data);
        this.pacientedatos = data;
        this.fechaconsultaactual = data.fechaConsulta;
      }
    );
  }

  formatearfecha() {
    this.fechaFormateada = `${this.dia < 10 ? '0' + this.dia : this.dia}/${
      this.mes < 10 ? '0' + this.mes : this.mes
    }/${this.año}`;
  }

  cargarFormulario(data: Paciente) {
    console.log(data);
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    console.log(today);
    console.log(formattedDate);
    this.PacienteFormulario = new FormGroup({
      clave: new FormControl(data.clave),
      sexo: new FormControl(
        data.sexo === 'F'
          ? 'Femenino'
          : data.sexo === 'M'
          ? 'Masculino'
          : data.sexo
      ),
      fechaDeNacimiento: new FormControl(
        data.fechaDeNacimiento != ''
          ? this.formatDate(data.fechaDeNacimiento)
          : formattedDate
      ),
      nombre: new FormControl(data.nombre),
      edad: new FormControl(
        data.fechaDeNacimiento != ''
          ? this.CalcularEdad(data.fechaDeNacimiento)
          : 0
      ),
      estadoCivil: new FormControl(
        data.estadoCivil === 'C.' || data.estadoCivil === 'C'
          ? 'Casado'
          : data.estadoCivil === 'S'
          ? 'Soltero'
          : data.estadoCivil == ''
          ? 'NoEspecificado'
          : data.estadoCivil
      ),
      ocupacion: new FormControl(
        data.ocupacion == '' ? 'NoEspecificado' : data.ocupacion
      ),
      domicilio: new FormControl(data.domicilio),
      poblacion: new FormControl(data.poblacion),
      telefono: new FormControl(data.telefono),
      email: new FormControl(data.email),
      nombreDelEsposo: new FormControl(data.nombreDelEsposo),
      edadDelEsposo: new FormControl(data.edadDelEsposo),
      ocupacionEsposo: new FormControl(
        data.ocupacionEsposo == '' ? 'NoEspecificado' : data.ocupacionEsposo
      ),
      referencia: new FormControl(data.referencia),
      diabetes: new FormControl(
        data.diabetes == '' ? 'NoEspecificado' : data.diabetes
      ),
      hipertension: new FormControl(
        data.hipertension == '' ? 'No' : data.hipertension
      ),
      trombosis: new FormControl(
        data.trombosis == '' ? 'NoEspecificado' : data.trombosis
      ),
      cardiopatias: new FormControl(
        data.cardiopatias == '' ? 'NoEspecificado' : data.cardiopatias
      ),
      hipertensionFamiliar: new FormControl(
        data.hipertensionFamiliar == ''
          ? 'NoEspecificado'
          : data.hipertensionFamiliar
      ),
      cardiopatiaFamiliar: new FormControl(
        data.cardiopatiaFamiliar == ''
          ? 'NoEspecificado'
          : data.cardiopatiaFamiliar
      ),
      cancer: new FormControl(data.cancer),
      enfermedadesGeneticas: new FormControl(data.enfermedadesGeneticas),
      otraEnfermedad: new FormControl(data.otraEnfermedad),
      inmunizaciones: new FormControl(data.inmunizaciones),
      alcoholismo: new FormControl(
        data.alcoholismo == '' ? 'NoEspecificado' : data.alcoholismo
      ),
      tabaquismo: new FormControl(data.tabaquismo),
      tabaquismoPasivo: new FormControl(data.tabaquismoPasivo),
      drogasOmedicamentos: new FormControl(data.drogasOmedicamentos),
      grupoSanguineo: new FormControl(
        data.grupoSanguineo == '' ? 'NoEspecificado' : data.grupoSanguineo
      ),
      propiasDeLaInfancia: new FormControl(data.propiasDeLaInfancia),
      rubeola: new FormControl(data.rubeola == '' ? 'No' : data.rubeola),
      amigdalitis: new FormControl(
        data.amigdalitis == '' ? 'No' : data.amigdalitis
      ),
      bronquitis: new FormControl(data.bronquitis),
      bronconeumonia: new FormControl(
        data.bronconeumonia == '' ? 'No' : data.bronconeumonia
      ),
      hepatitisViralTipo: new FormControl(data.hepatitisViralTipo),
      parasitosis: new FormControl(
        data.parasitosis == '' ? 'No' : data.parasitosis
      ),
      toxoplasmosis: new FormControl(data.toxoplasmosis),
      citomegalovirus: new FormControl(data.citomegalovirus),
      herpes: new FormControl(data.herpes),
      clamydiasis: new FormControl(data.clamydiasis),
      hiv: new FormControl(data.hiv == '' ? 'NoEspecificado' : data.hiv),
      sifilis: new FormControl(data.sifilis == '' ? 'No' : data.sifilis),
      micosis: new FormControl(data.micosis == '' ? 'No' : data.micosis),
      eip: new FormControl(data.eip == '' ? 'No' : data.eip),
      diabetesMellitus: new FormControl(data.diabetesMellitus == '' ? 'No' : data.diabetesMellitus),
      otrasEndocrinas: new FormControl(data.otrasEndocrinas),
      nefropatias: new FormControl(data.nefropatias),
      digestivas: new FormControl(data.digestivas),
      neurologicas: new FormControl(data.neurologicas),
      hematologicas: new FormControl(data.hematologicas),
      tumores: new FormControl(data.tumores),
      condilomatosis: new FormControl(data.condilomatosis == '' ? 'No' : data.condilomatosis),
      displasias: new FormControl(data.displasias),
      alergia: new FormControl(data.alergia),
      fechaConsulta: new FormControl(
        data.fechaConsulta != '' ? data.fechaConsulta : formattedDate
      ),
      fechaUltimaConsulta: new FormControl(
        data.fechaUltimaConsulta != ''
          ? data.fechaUltimaConsulta
          : formattedDate
      ),
    });
  }

  onFechaDeNacimientoChange(event: any): void {
    const fechaNacimiento = event.target.value;
    const edadCalculada = this.CalcularEdad(fechaNacimiento);
    this.PacienteFormulario.get('edad')?.setValue(edadCalculada);
  }

  CalcularEdad(fechaNacimiento: string) {
    let edad = 0;
    if (fechaNacimiento != undefined) {
      const fechaNacimientoDate = new Date(fechaNacimiento);
      const hoy = new Date();

      edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();

      // Ajustar la edad si el cumpleaños aún no ha ocurrido este año
      const haCumplidoAnios =
        hoy.getMonth() > fechaNacimientoDate.getMonth() ||
        (hoy.getMonth() === fechaNacimientoDate.getMonth() &&
          hoy.getDate() >= fechaNacimientoDate.getDate());

      if (!haCumplidoAnios) {
        edad--;
      }
    }
    return edad;
  }

  formatDate(dateString: string): string {
    const fecha = new Date(dateString);
    return fecha.toISOString().split('T')[0];
  }

  openDialog(imageUrl: string): void {
    this.dialog.open(StandaloneGalleryComponent, {
      data: {
        img: imageUrl,
      },
      panelClass: 'custom-dialog-container', // Opcional: para estilos personalizados3
    });
  }

  cargarImagenPaciente(parametrourl: any) {
    this.showLoading = true;
    this.Service.getListParams('GetImagenesPaciente', parametrourl).subscribe(
      (data: ImagenPaciente[]) => {
        if (data != null)
          this.images = data.map((img) => ({
            src: `data:image/jpeg;base64,${img.blobData}`,
            alt: img.letra,
            id: img.id,
          }));
      }
    );
  }

  cargarImagenPerfilPaciente(parametrourl: any) {
    this.showLoading = true; // Inicia la carga
    this.Service.getUnicoParams('GetFotoPaciente', parametrourl).subscribe({
      next: (data: FotoPaciente) => {
        // Comprueba si la data no es nula y actualiza la imagen de perfil
        if (data != null) {
          this.imagenperfil = {
            src: `data:image/jpeg;base64,${data.blobData}`,
          };
        }
      },
      error: (error) => {
        this.showLoading = false;
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
        console.error(
          'Error al cargar la imagen del perfil del paciente:',
          error
        );
      },
      complete: () => {
        // Esto se ejecutará después de completar la suscripción, ya sea que haya sido exitosa o no
        this.showLoading = false; // Termina la carga
      },
    });
  }

  formatTextForHtml(inputText: string): string {
    let escapedHtml = inputText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Envuelve el texto formateado en una etiqueta <pre>
    let formattedText = escapedHtml.replace(/\n/g, '<br>');
    return `<pre>${formattedText}</pre>`;
  }

  saveData() {
    if (!this.PacienteFormulario.invalid) {
      this.showLoading = true; // Inicia la carga
      if (
        this.fechaconsultaactual !=
        this.PacienteFormulario.get('fechaConsulta')?.value
      )
        this.PacienteFormulario.get('fechaUltimaConsulta')?.setValue(
          this.fechaconsultaactual
        );
      this.Service.postData(
        'PostPaciente',
        this.PacienteFormulario.value
      ).subscribe({
        next: (result) => {
          // Se llama si la operación es exitosa
          this.cargarFormulario(result);
          this.pacientedatos = result;
          this.pacientedatos.nombre = result.nombre;
          this.fechaconsultaactual =
            this.PacienteFormulario.get('fechaConsulta')?.value;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se han actualizado los datos correctamente',
            showConfirmButton: false,
            timer: 4000,
          });
          // Redirigir a la nueva URL con el ID del paciente
          this.router
            .navigate(['/expediente_paciente', result.clave])
            .then(() => {
              // Opcionalmente recargar la página después de redirigir
              window.location.reload();
            });
        },
        error: (error) => {
          // Se llama en caso de error en la operación
          console.error('Error al guardar los datos del paciente:', error);
          this.showLoading = false;
          // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
        },
        complete: () => {
          // Esto se ejecutará después de completar la suscripción, exitosa o no
          this.showLoading = false; // Termina la carga
        },
      });
    }
  }

  GuardarReceta(receta: any) {
    const r = receta;
    this.hijoComponent.saveText();
  }

  EditarReceta(receta: any) {
    const r = receta;
    this.hijoComponent.saveText();
  }

  GuardarNota(receta: any) {
    const r = receta;
    this.hijonotaComponent.saveText();
  }

  EditarNota(receta: any) {
    const r = receta;
    this.hijonotaComponent.saveText();
  }

  cargarRecetasPaciente(parametrourl: any) {
    this.showLoading = true;
    this.Service.getListParams('GetReceta', parametrourl).subscribe(
      (data: RecetaxPaciente[]) => {
        this.recetas = data;
      }
    );
  }

  cargarNotasPaciente(parametrourl: any) {
    this.showLoading = true;
    this.Service.getListParams('GetNotas', parametrourl).subscribe(
      (data: nota[]) => {
        this.notas = data;
      }
    );
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0] as File; // Afirmación de tipo aquí
    }
  }

  onFileSelectedPerfil(event: any): void {
    const input = event.target as HTMLInputElement;
    const file: File = event.target.files[0];
    if (file) {
      this.resizeImage(file, 128, 128, (resizedImage) => {
        // Haz algo con la imagen redimensionada
        console.log(resizedImage);
        // Por ejemplo, convertirlo a un archivo y prepararlo para ser enviado a un servidor
        this.selectedFile = new File([resizedImage], 'resized-image.jpg', {
          type: 'image/jpeg',
        });
      });
    }
  }

  resizeImage(
    file: File,
    width: number,
    height: number,
    callback: (resizedImage: Blob) => void
  ) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        ctx!.clearRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          callback(blob!);
        }, 'image/jpeg');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
        this.showLoading = false;
        this.cd.detectChanges(); // Forzar la detección de cambios después de actualizar showLoading
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    formData.append('id', this.parametro || '');

    this.Service.postData('PostImagen', formData)
      .pipe(
        finalize(() => {
          this.showLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se ha agregado la imagen correctamente',
            showConfirmButton: false,
            timer: 2000,
          });
          this.cd.detectChanges(); // Forzar la detección de cambios en finalize
        }),
        catchError((error) => {
          this.showLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrió un error al cargar la imagen',
          });
          console.error('Error uploading image:', error);
          return of([]); // Maneja el error y continúa el flujo
        })
      )
      .subscribe((data: ImagenPaciente[]) => {
        this.images = data.map((img) => ({
          src: `data:image/jpeg;base64,${img.blobData}`,
          alt: img.letra,
          id: img.id,
        }));
        this.cd.detectChanges(); // Opcional, si es necesario después de cambiar 'images'
      });
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(key)) {
      event.preventDefault(); // Previene el desplazamiento de la página
      this.navigateFields(key);
    }
  }

  navigateFields(key: string) {
    const currentElement = document.activeElement;
    const inputs = this.inputs.toArray();
    const currentIndex = inputs.findIndex(
      (input) => input.nativeElement === currentElement
    );
    if (currentIndex === -1) return; // Si no encuentra el índice, sale

    let targetIndex = currentIndex; // Inicializa con el índice actual
    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown': // Trata las flechas derecha y abajo de la misma manera
        targetIndex =
          currentIndex < inputs.length - 1 ? currentIndex + 1 : currentIndex;
        break;
      case 'ArrowLeft':
      case 'ArrowUp': // Trata las flechas izquierda y arriba de la misma manera
        targetIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
        break;
    }

    inputs[targetIndex].nativeElement.focus();
  }

  uploadImagenPerfil(): void {
    this.showLoading = true;
    this.cd.detectChanges(); // Forzar detección de cambios aquí para mostrar el loading

    if (!this.selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, selecciona un archivo primero.',
      }).then(() => {
        this.showLoading = false;
        this.cd.detectChanges(); // Forzar detección de cambios después de actualizar showLoading
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    formData.append('id', this.parametro || '');

    this.Service.postData('PostImagenPerfil', formData)
      .pipe(
        catchError((error) => {
          this.showLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ocurrió un error al cargar la imagen',
          });
          console.error('Error uploading profile image:', error);
          return of(null); // Continúa el flujo incluso con error
        }),
        finalize(() => {
          this.showLoading = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se ha agregado la imagen correctamente',
            showConfirmButton: false,
            timer: 2000,
          });
          this.cd.detectChanges(); // Forzar detección de cambios en finalize
        })
      )
      .subscribe((data: FotoPaciente) => {
        if (data != null) {
          this.imagenperfil = {
            src: `data:image/jpeg;base64,${data.blobData}`,
          };
        } else {
          // Opcional: manejo de caso cuando no hay datos
          Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'No se recibió ninguna imagen.',
          });
        }
        this.cd.detectChanges(); // Forzar detección de cambios si es necesario
      });
  }

  // deleteImage(id: number) {
  //   this.Service.postData('DeleteImagenPaciente', id)
  //     .pipe(
  //       catchError((error) => {
  //         console.error('Error uploading profile image:', error);
  //         return of(null); // Continúa el flujo incluso con error
  //       }),
  //       finalize(() => {
  //         this.showLoading = false;
  //         this.cd.detectChanges(); // Forzar detección de cambios en finalize
  //       })
  //     )
  //     .subscribe((data: ImagenPaciente[]) => {
  //       this.images = data.map((img) => ({
  //         src: `data:image/jpeg;base64,${img.blobData}`,
  //         alt: img.letra,
  //         id: img.id,
  //       }));
  //       this.cd.detectChanges(); // Opcional, si es necesario después de cambiar 'images'
  //     });
  // }

  deleteImage(id: number) {
    Swal.fire({
      title: '¿Seguro desea eliminar esta imagen?',
      text: 'Se eliminará la imagen seleccionada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.postData('DeleteImagenPaciente', id)
          .pipe(
            catchError((error) => {
              console.error('Error al eliminar la imagen:', error);
              return of(null); // Continúa el flujo incluso con error
            }),
            finalize(() => {
              this.showLoading = false;
              this.cd.detectChanges(); // Forzar detección de cambios en finalize
            })
          )
          .subscribe((data: ImagenPaciente[]) => {
            if (data) {
              this.images = data.map((img) => ({
                src: `data:image/jpeg;base64,${img.blobData}`,
                alt: img.letra,
                id: img.id,
              }));
              this.cd.detectChanges(); // Opcional, si es necesario después de cambiar 'images'
              Swal.fire({
                title: 'Eliminado!',
                text: 'La imagen ha sido eliminada exitosamente.',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000,
              });
            }
          });
      }
    });
  }

  ///IMPRIMIR TODO EL EXPEDIENTE//////////////

  // sections = [
  //   { id: 'informacionGeneral', name: 'Información General', selected: true },
  //   { id: 'historia', name: 'Historia', selected: true },
  //   //{ id: 'imc', name: 'IMC', selected: true },
  //   { id: 'imagenPerfil', name: 'Imagen de Perfil', selected: true },
  //   { id: 'imagenes', name: 'Imágenes', selected: true },
  //   { id: 'pendientes', name: 'Pendientes', selected: true },
  //   { id: 'recetas', name: 'Recetas', selected: true },
  //   { id: 'complementarios', name: 'Complementarios', selected: true },
  //   {
  //     id: 'justificacionesInformes',
  //     name: 'Justificaciones e Informes',
  //     selected: true,
  //   },
  // ];
  // @ViewChildren('checkbox') checkboxes: QueryList<ElementRef>;
  // onPrint() {
  //   this.showLoading = true;
  //   const requestBody: any = {};

  //   this.sections.forEach((section, index) => {
  //     const checkbox = this.checkboxes.toArray()[index].nativeElement;
  //     requestBody[section.id] = checkbox.checked ? true : false;
  //   });
  //   // Agregar id del paciente
  //   //Agregar validacion solo para pacientes con id

  //   console.log('Objeto a enviar al controlador:', requestBody);
  //   this.Service.PostData(
  //     UrlsBackend.ApiPacientes,
  //     UrlsPacientes.PrintComplete,
  //     requestBody
  //   ).subscribe((result) => {});
  // }

  printPage() {
    // Obtener todos los tab-pane
    const tabPanes = document.querySelectorAll('.tab-pane');
    const collapsibles = document.querySelectorAll('.collapsed-card');
    const textareas = document.querySelectorAll('textarea');
    const originalDisplayValues: string[] = [];
    // Seleccionar todos los botones y selects
    const buttons = document.querySelectorAll('button');
    const selects = document.querySelectorAll('select');
    const containers = document.querySelectorAll(
      '.container-fluid, .row, .col-md-12, .card-body'
    );

    // Mostrar todos los tab-pane temporalmente
    tabPanes.forEach((tabPane) => {
      originalDisplayValues.push(
        tabPane.classList.contains('active') ? 'active' : 'fade'
      );
      tabPane.classList.add('show', 'active');
      tabPane.classList.remove('fade');
    });

    collapsibles.forEach((card) => {
      card.classList.add('expand-card');
      card.classList.remove('collapsed-card');
    });
    // Expandir todos los textarea según su contenido
    textareas.forEach((textarea) => {
      textarea.style.height = 'auto'; // Resetear la altura
      textarea.style.height = textarea.scrollHeight + 'px'; // Ajustar la altura al contenido
    });
    // Seleccionar todos los botones y selects vacíos
    const emptyButtons = document.querySelectorAll('button:empty');
    const emptySelects = document.querySelectorAll('select');

    const elementsToHide: HTMLElement[] = [];

    // Ocultar botones vacíos
    emptyButtons.forEach((button) => {
      if (button.innerHTML.trim() === '') {
        this.renderer.setStyle(button, 'display', 'none');
        elementsToHide.push(button as HTMLElement);
      }
    });

    // Ocultar selects vacíos o con opciones vacías
    emptySelects.forEach((select) => {
      const options = select.querySelectorAll('option');
      let isEmpty = true;
      options.forEach((option) => {
        if (option.value.trim() !== '') {
          isEmpty = false;
        }
      });
      if (isEmpty || options.length === 0) {
        this.renderer.setStyle(select, 'display', 'none');
        elementsToHide.push(select as HTMLElement);
      }
    });

    // Ocultar todos los botones
    buttons.forEach((button) => {
      this.renderer.setStyle(button, 'display', 'none');
      elementsToHide.push(button as HTMLElement);
    });

    // Ocultar todos los selectores
    selects.forEach((select) => {
      this.renderer.setStyle(select, 'display', 'none');
      elementsToHide.push(select as HTMLElement);
    });

    containers.forEach((container) => {
      const styles = getComputedStyle(container);
      if (parseInt(styles.marginBottom) > 20) {
        this.renderer.setStyle(container, 'margin-bottom', '20px'); // Limitar a 2 líneas
      }
      if (parseInt(styles.paddingBottom) > 20) {
        this.renderer.setStyle(container, 'padding-bottom', '20px'); // Limitar a 2 líneas
      }
    });
    // Ejecutar la impresión
    window.print();

    // Restaurar el estado original de los tab-pane
    tabPanes.forEach((tabPane, index) => {
      if (originalDisplayValues[index] === 'fade') {
        tabPane.classList.remove('show', 'active');
        tabPane.classList.add('fade');
      } else {
        tabPane.classList.remove('fade');
        tabPane.classList.add('show', 'active');
      }
    });
    collapsibles.forEach((card) => {
      card.classList.add('collapsed-card');
      card.classList.remove('expand-card');
    });
    textareas.forEach((textarea) => {
      textarea.style.height = ''; // Restaurar a la altura original si es necesario
    });
    // Restaurar la visibilidad después de la impresión
    elementsToHide.forEach((element) => {
      this.renderer.removeStyle(element, 'display');
    });

    containers.forEach((container) => {
      this.renderer.removeStyle(container, 'margin-bottom');
      this.renderer.removeStyle(container, 'padding-bottom');
    });
  }
}
