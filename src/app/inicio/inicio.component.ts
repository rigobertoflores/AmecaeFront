import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { Service } from './../Services/Service';
import { CommonModule } from '@angular/common';
import { Paciente } from './../interface/Paciente';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FotoPaciente } from '../interface/FotoPaciente';
import { ImagenPaciente } from '../interface/ImagenPaciente';
import { UserService } from '../Services/user.service';
import { LoadingComponent } from '../loading/loading.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent,
    HttpClientModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    LoadingComponent,
    DatePipe,
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit, AfterViewInit {
  fechaActual: Date = new Date();
  dia: any = this.fechaActual.getDate();
  mes: any = this.fechaActual.getMonth() + 1; // Los meses empiezan en 0
  año: number = this.fechaActual.getFullYear();
  fechadenacimiento: Date | null;
  telefono: string;
  email: string | null;
  fecha_ultimaconsulta: any | null;
  dataSource = new MatTableDataSource<Paciente>();
  title = 'expedientes-medicos-cancun';
  contenido: string = '';
  fechaFormateada: string;
  nombre: string;
  edad: number = -1;
  listaPacientes: Paciente[];
  displayedColumns: string[] = [
    'fecha_proximaconsulta',
    'nombre',
    'sexo',
    'editar',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  images: { src: string; alt: string } = {
    src: 'assets/user.png',
    alt: 'no hay imagen',
  };
  clave: number;
  showLoading: boolean = false;
  datePipe: DatePipe;
  filter: string = ' ';

  constructor(
    private Service: Service,
    private authService: UserService,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router
  ) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.showLoading = true;
    this.formatearfecha();
    this.loadPatients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.paginator.page.subscribe(() => {
      this.loadPatients();
    });
  }

  loadPatients() {
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : 10;

    this.Service.getListPagination(
      'GetPacientes',
      pageIndex,
      pageSize,
      this.filter
    ).subscribe((data) => {
      if (data.items[0]) {
        this.nombre = data.items[0].nombre;

        if (data.items[0].fechaDeNacimiento != undefined) {
          const fechaNacimientoDate = new Date(data.items[0].fechaDeNacimiento);
          const hoy = new Date();

          let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();

          // Ajustar la edad si el cumpleaños aún no ha ocurrido este año
          const haCumplidoAnios =
            hoy.getMonth() > fechaNacimientoDate.getMonth() ||
            (hoy.getMonth() === fechaNacimientoDate.getMonth() &&
              hoy.getDate() >= fechaNacimientoDate.getDate());

          if (!haCumplidoAnios) {
            edad--;
          }

          this.edad = edad;
        }
        let fechaUC = this.formatDate(data.items[0].fechaUltimaConsulta);
        this.fecha_ultimaconsulta = fechaUC != null ? fechaUC : '';
        this.telefono = data.items[0].telefono;
        this.email = data.items[0].email;
        this.clave = data.items[0].clave;
        this.cargarFotoPaciente(this.clave);
      }
      this.dataSource = new MatTableDataSource<Paciente>(data.items);
      this.paginator.length = data.totalCount;
      this.dataSource.sort = this.sort;
      this.showLoading = false;
    });
  }

  formatearfecha() {
    this.fechaFormateada = `${this.dia < 10 ? '0' + this.dia : this.dia}/${
      this.mes < 10 ? '0' + this.mes : this.mes
    }/${this.año}`;
  }

  

  cargarListadodePacientes() {
    this.Service.getList('GetPacientes').subscribe((data: Paciente[]) => {
      if (data[0]) {
        this.nombre = data[0].nombre;
        let anoNacimiento: Date = new Date(data[0].fechaDeNacimiento);
        this.edad = this.año - anoNacimiento.getFullYear();
        (this.fecha_ultimaconsulta = null), (this.telefono = data[0].telefono);
        this.email = data[0].email;
        this.clave = data[0].clave;
        this.cargarFotoPaciente(this.clave);
      }
      this.dataSource = new MatTableDataSource<Paciente>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.showLoading = false;
    });
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    this.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.paginator.pageIndex = 0; // Reset page index to 0 when applying filter
    this.loadPatients();
  }

  editarElemento(id: number) {
    this.router.navigate(['/expediente_paciente', id]);
    // new File([blobs], "Download.png", { type: "image/jpg" })
    console.log('Editar elemento:', id);
    // Aquí puedes implementar la lógica para editar el elemento
    // Por ejemplo, abrir un diálogo de edición o navegar a una ruta de edición con el ID del elemento
  }

  cargarFotoPaciente(id: number) {
    this.Service.getUnicoParams('GetFotoPaciente', id).subscribe(
      (data: FotoPaciente) => {
        if (data != null) {
          console.log('Pinta imagen de usuario');
          this.images = {
            src: `data:image/jpeg;base64,${data.blobData}`,
            alt: 'no hay imagen',
          };
        } else {
          console.log('Pinta imagen de usuario por defecto');
          this.images = {
            src: 'assets/paciente.png',
            alt: 'imagen de usuario',
          };
        }
      }
    );
  }

  agregarPaciente() {
    this.router.navigate(['/expediente_paciente', 0]);
  }
  formatDate(dateString: string): string {
    const fecha = new Date(dateString);
    return fecha.toISOString().split('T')[0];
  }
}
