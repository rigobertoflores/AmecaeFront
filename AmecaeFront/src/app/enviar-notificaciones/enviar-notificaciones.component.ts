import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import { Service } from '../Services/Service';
import { UrlsBackend, UrlsPacientes, UrlsPlantillas } from '../enums/urls_back';
import { Plantilla } from '../interface/Plantilla';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enviar-notificaciones',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './enviar-notificaciones.component.html',
  styleUrl: './enviar-notificaciones.component.css',
})
export class EnviarNotificacionesComponent implements OnInit, OnDestroy {
  showLoading: boolean = false;
  plantillaOptions: any[];
  plantillas: Plantilla[];
  datosPlantillaSelected: Plantilla = {
    id: 0,
    nombre: '',
    asunto: '',
    cuerpoEmail: '',
    fechaEnvio: '',
    adjunto: '',
  };
  mostrarDatosPlantillaSelected: boolean = false;
  mostrarPacientesdeFechaSelected: boolean = false;
  mostrarDatosPlantillaFelicitacionesSelected: boolean = false;
  FechaEnvioForm: any;
  pacientesConcita: any = [];
  pacientesVinculadosAPlantilla: any = [];
  cantidadCorreosEnviar: number = 0;

  ngOnInit(): void {
    this.getPlantillas();
    this.cargarFormulario();
  }

  constructor(private Service: Service) {}

  ngOnDestroy(): void {
    this.mostrarPacientesdeFechaSelected = false;
    this.mostrarDatosPlantillaSelected = false;
  }

  cargarFormulario() {
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    console.log('formattedDate', formattedDate);
    this.FechaEnvioForm = new FormGroup({
      fecha: new FormControl(formattedDate),
    });
  }

  getPlantillas() {
    this.showLoading = true;
    this.Service.GetData(
      UrlsBackend.ApiNotificacion,
      UrlsPlantillas.Get,
      ''
    ).subscribe({
      next: (result: Plantilla[]) => {
        console.log('getplan', result);
        this.plantillaOptions = result;
        console.log('this.plantillaOptions', this.plantillaOptions);
        this.plantillas = result;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un error al obtener los pacientes con citas para la fecha seleccionada',
        });
      },
      complete: () => {
        this.showLoading = false; // Finalizar carga
      },
    });
  }

  seleccionarPlantilla(plantillaSelectedID: any) {
    console.log('plantillaSelected', plantillaSelectedID);
    if (plantillaSelectedID > 0) {
      this.datosPlantillaSelected = this.plantillas.filter(
        (p) => p.id == plantillaSelectedID
      )[0];
      console.log('this.datosPlantillaSelected', this.datosPlantillaSelected);
      this.mostrarDatosPlantillaSelected = true;
      const today = new Date();
      const formattedDate = today.toISOString().substring(0, 10);
      this.obtenerPacientesConCitasPorFecha(formattedDate);
      this.mostrarPacientesdeFechaSelected = true;
    }
  }

  onFechaChange(event: any): void {
    const selectedDate: string = event.target.value;
    const formattedDate: string = new Date(selectedDate)
      .toISOString()
      .substring(0, 10);
    this.obtenerPacientesConCitasPorFecha(formattedDate);
  }
  obtenerPacientesConCitasPorFecha(date: string) {
    this.showLoading = true;
    this.Service.GetData(
      UrlsBackend.ApiPacientes,
      `${UrlsPacientes.GetCitasPorFecha}/${date}`,
      ''
    ).subscribe({
      next: (result: any) => {
        this.pacientesConcita = result;
        this.cantidadCorreosEnviar = result.length;
        console.log('result', result);
        console.log('this.pacientesConcita', this.pacientesConcita);
        this.showLoading = false;
      },
      error: (error) => {
        this.showLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un error al obtener los pacientes con citas para la fecha seleccionada',
        });
      },
      complete: () => {
        this.showLoading = false; // Finalizar carga
      },
    });
  }

  enviarNotificaciones() {
    this.showLoading = true;
    const data = {
      fecha: this.FechaEnvioForm.get('fecha')?.value,
      plantilla: this.datosPlantillaSelected,
    };
    console.log(data);
    this.Service.PostData(
      UrlsBackend.ApiNotificacion,
      UrlsPlantillas.SendEmail,
      data
    ).subscribe({
      next: (response) => {
        this.showLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se han enviado correctamente los correos',
          showConfirmButton: false,
          timer: 2000,
        });
      },
      error: (error) => {
        this.showLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un error al enviar los correos',
        });
      },
      complete: () => {
        this.showLoading = false; // Finalizar carga
      },
    });
  }

  seleccionarPlantillaFelicitaciones(plantillaSelectedID: any) {
    console.log('plantillaSelected', plantillaSelectedID);
    if (plantillaSelectedID > 0) {
      this.datosPlantillaSelected = this.plantillas.filter(
        (p) => p.id == plantillaSelectedID
      )[0];
      console.log('this.datosPlantillaSelected', this.datosPlantillaSelected);
      this.mostrarDatosPlantillaFelicitacionesSelected = true;

      this.obtenerPacientesVinculadosAPlantillaCorreo(plantillaSelectedID);
    }
  }

  obtenerPacientesVinculadosAPlantillaCorreo(plantillaId: any) {
    console.log('11', plantillaId), (this.showLoading = true);
    this.Service.GetData(
      UrlsBackend.ApiNotificacion,
      `${UrlsPlantillas.GetPacientesVinculadosPP}/${plantillaId}`,
      plantillaId
    ).subscribe({
      next: (result: any) => {
        console.log('pacientesVinculados', result);
        this.pacientesVinculadosAPlantilla = result;
        this.cantidadCorreosEnviar = result.length;
        this.showLoading = false;
      },
      error: (error: string) => {
        this.showLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un error al obtener los pacientes ' + error,
        });
      },
      complete: () => {
        this.showLoading = false;
      },
    });
  }

  enviarFelicitaciones() {
    this.showLoading = true;
    console.log(this.datosPlantillaSelected);
    this.Service.PostData(
      UrlsBackend.ApiNotificacion,
      UrlsPlantillas.SendEmailFelicitaciones,
      this.datosPlantillaSelected
    ).subscribe({
      next: (response) => {
        if (response.length == this.pacientesConcita.length)
          this.showLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se han enviado correctamente los correos',
          showConfirmButton: false,
          timer: 2000,
        });
      },
      error: (error) => {
        this.showLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un error al enviar los correos',
        });
      },
      complete: () => {
        this.showLoading = false; // Finalizar carga
      },
    });
  }
}
