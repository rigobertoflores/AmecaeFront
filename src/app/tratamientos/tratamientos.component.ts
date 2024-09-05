import { AfterViewInit, ApplicationConfig, Component, OnInit } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Service } from '../Services/Service';
import { Tratamiento } from '../interface/Tratamiento';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { provideLottieOptions } from 'ngx-lottie';

export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
  ],
};

@Component({
  selector: 'app-tratamientos',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    LottieComponent,
  ],
  templateUrl: './tratamientos.component.html',
  styleUrl: './tratamientos.component.css',
})

export class TratamientosComponent implements OnInit, AfterViewInit {
  tratamientosForm: any;
  mostrarTratamientosForm: any;
  buscarTratamientosForm: any;
  treatments: any;
  allTreatments: Tratamiento[] = [];
  currentTreatmentId: string | null = null;
  tratamientoSeleccionado: boolean = false;
  options: AnimationOptions = {
    path: '/assets/Loading.json',
  };
  Loading = true;
  constructor(private Service: Service) {}
  

  ngOnInit(): void {
    this.Loading=true;
    this.cargarFormulario();
    this.getTreatments();
    this.setupSearch(); 
    console.log(this.getTreatments());
   
  }
  ngAfterViewInit(): void {
  //  this.Loading=false;
  }

  cargarFormulario() {
    this.tratamientosForm = new FormGroup({
      name: new FormControl(''),
      words: new FormControl(''),
      description: new FormControl(''),
      treatments: new FormControl(''),
    });
    this.mostrarTratamientosForm = new FormGroup({
      nameV: new FormControl(''),
      idV: new FormControl(''),
      wordsV: new FormControl(''),
      descriptionV: new FormControl(''),
      treatmentsV: new FormControl(''),
    });
    this.buscarTratamientosForm = new FormGroup({
      buscarTratamiento: new FormControl(''),
    });

    this.buscarTratamientosForm
      .get('buscarTratamiento')
      .valueChanges.subscribe((val: string) => {
        this.filtrarTratamientos(val);
      });
  }

  addNew() {
    this.Loading = true;
    const treatments: Tratamiento = {
      id: 0,
      nombre: this.tratamientosForm.get('name')?.value,
      descripcionEnfermedad: this.tratamientosForm.get('description')?.value,
      tratamiento: this.tratamientosForm.get('treatments')?.value,
      palabrasClaves: this.tratamientosForm.get('words')?.value,
    };

    if (!this.tratamientosForm.invalid) {
      console.log(this.tratamientosForm.value);
      this.Service.InsertTratamiento(
        'PostInsertTratamientos',
        treatments
      ).subscribe((result) => {
        this.tratamientosForm.patchValue({
          name: '',
          description: '',
          treatments: '',
          words: '',
        });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ha agregado un nuevo tratamiento',
          showConfirmButton: false,
          timer: 2000,
        });
        this.getTreatments();
        console.log(result);
      });
    }  
  }

  getTreatments() {
    this.Loading = true; // Iniciar carga
    this.Service.GetTratamiento().subscribe({
      next: (result: Tratamiento[]) => {
        this.allTreatments = result.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.treatments = this.allTreatments;
      },
      error: (error) => {
        // Manejar error aquí
      },
      complete: () => {
        this.Loading = false; // Finalizar carga
      }
    });
  }

  viewDetails(tratamientoSelected: any) {
    console.log('tratamientoSelected', tratamientoSelected);
    this.tratamientoSeleccionado = true;
    this.mostrarTratamientosForm.patchValue({
      idV: tratamientoSelected.id,
      nameV: tratamientoSelected.nombre,
      wordsV: tratamientoSelected.palabrasClaves,
      descriptionV: tratamientoSelected.descripcionEnfermedad,
      treatmentsV: tratamientoSelected.tratamiento,
    });
    this.currentTreatmentId = this.mostrarTratamientosForm.get('idV')?.value;
    console.log('tratamientoSelected ID', this.currentTreatmentId);
  }

  update() {
    this.Loading = true;
    const treatmentsEdit: Tratamiento = {
      id: this.mostrarTratamientosForm.get('idV')?.value,
      nombre: this.mostrarTratamientosForm.get('nameV')?.value,
      descripcionEnfermedad:
        this.mostrarTratamientosForm.get('descriptionV')?.value,
      tratamiento: this.mostrarTratamientosForm.get('treatmentsV')?.value,
      palabrasClaves: this.mostrarTratamientosForm.get('wordsV')?.value,
    };
    this.Service.EditTratamiento(treatmentsEdit).subscribe({
      next: (response) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ha editado el tratamiento',
          showConfirmButton: false,
          timer: 2000,
        });
        this.cleanFormmMostrarTratamientos();
        this.getTreatments();
        this.tratamientoSeleccionado = false;
      },
      error: (error) => {
        this.cleanFormmMostrarTratamientos();
        this.tratamientoSeleccionado = false;
        this.Loading = false;
      },
          });
          // this.Loading = false;
  }

  delete() {
    this.Loading = true;
    const id = this.mostrarTratamientosForm.get('idV')?.value;
    Swal.fire({
      title: 'Seguro desea eliminar este tratamiento?',
      text:
        'Se eliminará el tratamiento ' +
        this.mostrarTratamientosForm.get('nameV')?.value,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.DeleteTratamiento(id).subscribe({
          next: (response) => {
            this.cleanFormmMostrarTratamientos();
            this.getTreatments();
            this.tratamientoSeleccionado = false;
                      },
          error: (error) => {
            this.cleanFormmMostrarTratamientos();
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error al eliminar el tratamiento',
              // footer: '<a href="#">Why do I have this issue?</a>'
            });
            this.tratamientoSeleccionado = false;
          },
        });
        Swal.fire({
          title: 'Eliminado!',
          text: 'El tratamiento ha sido eliminado.',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  }

  cleanFormmMostrarTratamientos() {
    this.mostrarTratamientosForm.patchValue({
      nameV: '',
      idV: '',
      wordsV: '',
      descriptionV: '',
      treatmentsV: '',
    });
  }

  setupSearch() {
    this.buscarTratamientosForm
      .get('buscarTratamiento')
      .valueChanges.subscribe((value: string) => {
        this.filtrarTratamientos(value);
      });
  }

  filtrarTratamientos(buscarTexto: string) {
    if (!buscarTexto) {
      this.treatments = this.allTreatments; // Si no hay texto de búsqueda, muestra todos los tratamientos
    } else {
      this.treatments = this.allTreatments.filter((tratamiento) =>
        tratamiento.nombre.toLowerCase().includes(buscarTexto.toLowerCase())
      );
    }
  }
  
  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
}
