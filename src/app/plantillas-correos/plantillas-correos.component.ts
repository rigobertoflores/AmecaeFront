import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Service } from '../Services/Service';
import {
  NotificacionPacientes,
  PacientesPlantillas,
  Plantilla,
} from '../interface/Plantilla';
import { UrlsBackend, UrlsPacientes, UrlsPlantillas } from '../enums/urls_back';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import {
  AsociacionPlantillaPaciente,
  RelacionPlantilllaPaciente,
} from '../interface/PlantillasPacientes';
import { firstValueFrom } from 'rxjs';
import { contains } from 'jquery';

@Component({
  selector: 'app-plantillas-correos',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
  ],
  templateUrl: './plantillas-correos.component.html',
  styleUrl: './plantillas-correos.component.css',
})
export class PlantillasCorreosComponent implements OnInit, OnDestroy {
  agregarPForm: FormGroup;
  RelacionPlantillaPacienteForm: FormGroup;
  // buscarPlantillaForm: FormGroup;
  mostrarPlantillaForm: FormGroup;
  showLoading: boolean = false;
  allPlantillas: Plantilla[] = [];
  plantillas: Plantilla[] = [];
  plantillaSelected: boolean = false;
  currentPlantillaId: any;
  pacientesActivos: any;
  pacientesInactivos: any;
  modalAgregarPacientes: boolean = false;
  allPacientes: any;
  headerPacientes: any;
  iconoHeaderPacientes: any;
  pacientesAInsertar: Array<NotificacionPacientes> =
    new Array<NotificacionPacientes>();
  pacientesVinculados: any = [];
  pacientesADesvincular: NotificacionPacientes[] = [];
  valfiltro: any;
  isButtonDisabled: boolean = true;
  isButtonAgregarDisabled: boolean = true;

  ngOnInit(): void {
    this.getPlantillas();
    this.cargarFormulario();
    this.getPacientes();
    console.log('this.getPlantillas()', this.getPlantillas());
    console.log('plantillas', this.plantillas);
    console.log('allPlantillas', this.allPlantillas);
      this.isButtonAgregarDisabled = true;
    if (
      this.pacientesAInsertar.length == 0 &&
      this.pacientesVinculados.length == 0
    ) {
      this.isButtonDisabled = true;
    }

    this.updateAllPacientes(
      this.RelacionPlantillaPacienteForm.get('pacientesTipo')?.value
    );
  }

  constructor(private Service: Service) {}
  ngOnDestroy(): void {
    this.pacientesADesvincular = [];
    this.pacientesAInsertar = [];
  }

  cargarFormulario() {
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    this.agregarPForm = new FormGroup({
      name: new FormControl('', Validators.required),
      fecha: new FormControl(formattedDate),
      asunto: new FormControl('', Validators.required),
      cuerpo: new FormControl('', Validators.required),
    });

    this.mostrarPlantillaForm = new FormGroup({
      idSelected: new FormControl(''),
      nameSelected: new FormControl(''),
      fechaSelected: new FormControl(''),
      asuntoSelected: new FormControl(''),
      cuerpoSelected: new FormControl(''),
    });

    this.RelacionPlantillaPacienteForm = new FormGroup({
      idPlantPac: new FormControl(''),
      asuntoPlantPac: new FormControl(''),
      fechaPlantPac: new FormControl(''),
      cuerpoPlantPac: new FormControl(''),
      pacientesTipo: new FormControl('activos'),
    });
    this.RelacionPlantillaPacienteForm.get(
      'pacientesTipo'
    )?.valueChanges.subscribe((value: string) => {
      this.updateAllPacientes(value);
    });
    this.agregarPForm.valueChanges.subscribe(() => {
      this.HabilitarBotonAgregar();
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
        this.allPlantillas = result;
        // this.allPlantillas = result.sort((a, b) =>
        //   a.Nombre.localeCompare(b.Nombre)
        // );
        this.plantillas = this.allPlantillas;
      },
      error: (error) => {
        // Manejar error aquí
      },
      complete: () => {
        this.showLoading = false; // Finalizar carga
      },
    });
  }

  HabilitarBotonAgregar() {
    if (this.agregarPForm.valid) {
      this.isButtonAgregarDisabled = false;
    } else this.isButtonAgregarDisabled = true;
  }

  addNew() {
    this.showLoading = true;
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    const plantillaNew: Plantilla = {
      id: 0,
      nombre: this.agregarPForm.get('name')?.value,
      fechaEnvio:  formattedDate,
      asunto: this.agregarPForm.get('asunto')?.value,
      cuerpoEmail: this.agregarPForm.get('cuerpo')?.value,
      adjunto: '',
    };

    if (!this.agregarPForm.invalid) {
      console.log(this.agregarPForm.value);
      this.Service.PostData(
        UrlsBackend.ApiNotificacion,
        UrlsPlantillas.Post,
        plantillaNew
      ).subscribe((result) => {
        this.agregarPForm.patchValue({
          name: '',
          fecha: '',
          asunto: '',
          cuerpo: '',
        });
             this.isButtonAgregarDisabled = true;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ha agregado una nueva plantilla de correo',
          showConfirmButton: false,
          timer: 2000,
        });
        this.getPlantillas();
        console.log(result);
      });
    }
  }

  getPacientes() {
    this.Service.GetData(
      UrlsBackend.ApiPacientes,
      UrlsPacientes.GetPacientesNotificaciones,
      ''
    ).subscribe({
      next: (result: PacientesPlantillas) => {
        console.log('pacientestodos', result);
        this.pacientesActivos = result.pacientesActivos;
        this.pacientesInactivos = result.pacientesInactivos;
        console.log('this.pacientesActivos', this.pacientesActivos);
      },
      error: (error) => {
        // Manejar error aquí
      },
      complete: () => {},
    });
  }

  getPacientesVinculados(plantillaId: any) {
    this.Service.GetData(
      UrlsBackend.ApiNotificacion,
      `${UrlsPlantillas.GetPacientesVinculadosPP}/${plantillaId}`,
      plantillaId
    ).subscribe({
      next: (result: any) => {
        console.log('pacientesVinculados', result);
        this.pacientesVinculados = result;
      },
      error: (error) => {
        // Manejar error aquí
      },
      complete: () => {},
    });
  }

  filtrarPlantillas(val: string) {
    if (!val) {
      this.plantillas = this.allPlantillas;
    } else {
      this.plantillas = this.allPlantillas?.filter((p) =>
        p.nombre?.toLowerCase().includes(val.toLowerCase())
      );
    }
  }

  viewDetails(plantSelected: any) {
    console.log('plantSelected', plantSelected);
    const fecha = new Date(plantSelected.fechaEnvio);
    const formattedDate = fecha.toISOString().substring(0, 10); // Corta el string para obtener solo la fecha
    this.modalAgregarPacientes = false;
    this.plantillaSelected = true;
    this.mostrarPlantillaForm.patchValue({
      idSelected: plantSelected.id,
      nameSelected: plantSelected.nombre,
      fechaSelected: formattedDate,
      asuntoSelected: plantSelected.asunto,
      cuerpoSelected: plantSelected.cuerpoEmail,
    });
    this.currentPlantillaId =
      this.mostrarPlantillaForm.get('idSelected')?.value;
    console.log('currentPlantillaId ID', this.currentPlantillaId);
  }

  update() {
    this.showLoading = true;
    const plantillaEdit: Plantilla = {
      id: this.mostrarPlantillaForm.get('idSelected')?.value,
      nombre: this.mostrarPlantillaForm.get('nameSelected')?.value,
      fechaEnvio: this.mostrarPlantillaForm.get('fechaSelected')?.value,
      asunto: this.mostrarPlantillaForm.get('asuntoSelected')?.value,
      cuerpoEmail: this.mostrarPlantillaForm.get('cuerpoSelected')?.value,
      adjunto: '',
    };
    this.Service.PostData(
      UrlsBackend.ApiNotificacion,
      UrlsPlantillas.Post,
      plantillaEdit
    ).subscribe({
      next: (response) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se ha editado la plantilla',
          showConfirmButton: false,
          timer: 2000,
        });
        this.cleanFormMostrarPlantilla();
        this.getPlantillas();
        this.plantillaSelected = false;
      },
      error: (error) => {
        this.cleanFormMostrarPlantilla();
        this.plantillaSelected = false;
        this.showLoading = false;
      },
    });
  }

  delete() {
    this.showLoading = true;
    const id = this.mostrarPlantillaForm.get('idSelected')?.value;
    Swal.fire({
      title: 'Seguro desea eliminar esta plantilla?',
      text:
        'Se eliminará la plantilla ' +
        this.mostrarPlantillaForm.get('nameSelected')?.value,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.Delete(
          UrlsBackend.ApiNotificacion,
          UrlsPlantillas.Delete,
          id
        ).subscribe({
          next: (response) => {
            this.cleanFormMostrarPlantilla();
            this.getPlantillas();
            this.plantillaSelected = false;
          },
          error: (error) => {
            this.cleanFormMostrarPlantilla();
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error al eliminar la plantilla',
              // footer: '<a href="#">Why do I have this issue?</a>'
            });
            this.plantillaSelected = false;
            this.showLoading = false;
          },
        });
        Swal.fire({
          title: 'Eliminado!',
          text: 'La plantilla ha sido eliminado.',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  }

  cleanFormMostrarPlantilla() {
    this.mostrarPlantillaForm.patchValue({
      idSelected: '',
      nameSelected: '',
      fechaSelected: '',
      asuntoSelected: '',
      cuerpoSelected: '',
    });
  }

  cleanMostrarAgregarPacientes() {
    this.mostrarPlantillaForm.patchValue({
      idPlantPac: '',
      fechaPlantPac: '',
      asuntoPlantPac: '',
      cuerpoPlantPac: '',
    });
  }
  mostrarAgregarPacientes(plantilla: any) {
    this.isButtonDisabled = true;
    this.plantillaSelected = false;
    this.modalAgregarPacientes = true;
    this.cleanMostrarAgregarPacientes();
    const fecha = new Date(plantilla.fechaEnvio);
    const formattedDate = fecha.toISOString().substring(0, 10);
    this.RelacionPlantillaPacienteForm.patchValue({
      idPlantPac: plantilla.id,
      fechaPlantPac: formattedDate,
      asuntoPlantPac: plantilla.asunto,
      cuerpoPlantPac: plantilla.cuerpoEmail,
    });
    this.getPacientesVinculados(
      parseInt(this.RelacionPlantillaPacienteForm.get('idPlantPac')?.value)
    );
    const pacientesTipo =
      this.RelacionPlantillaPacienteForm.get('pacientesTipo')?.value;
    this.updateAllPacientes(pacientesTipo);
  }

  updateAllPacientes(pacientesTipo: string) {
    if (pacientesTipo === 'activos') {
      this.allPacientes = this.pacientesActivos;
      this.headerPacientes = 'Pacientes Activos';
      this.iconoHeaderPacientes = 'fa-solid fa-users-rectangle';
    } else {
      this.allPacientes = this.pacientesInactivos;
      this.headerPacientes = 'Pacientes Inactivos';
      this.iconoHeaderPacientes = 'fa-solid fa-users-slash';
    }
  }

  agregarPaciente(paciente: any) {
    this.isButtonDisabled = true;
    console.log('pacienteaAgregar', paciente);
    if (
      this.pacientesVinculados.filter(
        (x: { [x: string]: any }) => x['pacienteId'] == paciente.id
      ).length == 0
    ) {
      this.pacientesAInsertar.push(paciente);
      const temp = {
        pacienteId: paciente.id,
        email: '',
        fechaConsulta: '',
        nombrePaciente: paciente.nombre,
      };

      this.pacientesVinculados[this.pacientesVinculados.length] = temp;
      this.isButtonDisabled = false;
    } else {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Este paciente ya está vinculado a la plantilla actual',
        showConfirmButton: false,
        timer: 2000,
      });
    }
    console.log('this.pacientesAInsertar', this.pacientesAInsertar);
    console.log('this.pacientesVinculados', this.pacientesVinculados);
    // enviar al backend
  }

  devincularPaciente(paciente: NotificacionPacientes) {
    this.pacientesADesvincular[this.pacientesADesvincular.length] = paciente;
    console.log('this.pacientesADesvincular', this.pacientesADesvincular);
    const index = this.pacientesVinculados.findIndex(
      (pac: { id: any }) => paciente.id === pac.id
    );
    if (index !== -1) {
      this.pacientesVinculados.splice(index, 1);
    }
    this.isButtonDisabled = false;
  }

  async guardarnuevosVinculos() {
    this.showLoading = true;

    try {
      const promises = [];

      if (this.pacientesAInsertar.length > 0) {
        const dataInsertar: RelacionPlantilllaPaciente[] =
          this.pacientesAInsertar.map((paciente) => {
            return {
              id: 0,
              plantillaId: parseInt(
                this.RelacionPlantillaPacienteForm.get('idPlantPac')?.value
              ),
              pacienteId: parseInt(paciente.id),
              nombrePlantilla:
                this.RelacionPlantillaPacienteForm.get(
                  'asuntoPlantPac'
                )?.value.toString(),
              nombrePaciente: paciente.nombre.toString(),
              status: '',
              fechaCreacion: new Date(),
              fechaUltActualizacion: new Date(),
            };
          });
        console.log('this.pacientesAInsertar', this.pacientesAInsertar);

        promises.push(
          firstValueFrom(
            this.Service.PostData(
              UrlsBackend.ApiNotificacion,
              UrlsPlantillas.PostAgregarVinculo,
              dataInsertar
            )
          )
        );
      }

      if (this.pacientesADesvincular.length > 0) {
        console.log('pacientesADesvincular', this.pacientesADesvincular);
        const idsElimanr: string[] = this.pacientesADesvincular.map(
          (pd) => pd.id
        );
        promises.push(
          firstValueFrom(
            this.Service.PostData(
              UrlsBackend.ApiNotificacion,
              UrlsPlantillas.DeleteEliminarVinculo,
              this.pacientesADesvincular
            )
          )
        );
      }

      await Promise.all(promises);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Se han guardado los cambios correctamente',
        showConfirmButton: false,
        timer: 2000,
      });

      // Limpiar las listas después de completar todas las operaciones
      this.pacientesADesvincular = [];
      this.pacientesAInsertar = [];
      this.showLoading = false;

      // Recargar los pacientes vinculados
      this.getPacientesVinculados(
        parseInt(this.RelacionPlantillaPacienteForm.get('idPlantPac')?.value)
      );
    } catch (error) {
      // Manejar errores si es necesario
      console.error('Error:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Se produjo un error al guardar los cambios',
        showConfirmButton: true,
      });
      this.showLoading = false;
      this.pacientesADesvincular = [];
      this.pacientesAInsertar = [];
    }
  }
}
