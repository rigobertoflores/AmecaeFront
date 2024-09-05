import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Service } from '../Services/Service';
import { UrlsBackend, UrlsPlantillas } from '../enums/urls_back';
import Swal from 'sweetalert2';
import { NotificacionStatus, PacientesPlantillas } from '../interface/Plantilla';

@Component({
  selector: 'app-consultar-notificaciones',
  standalone: true,
  imports: [
    MenuComponent,
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    LoadingComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './consultar-notificaciones.component.html',
  styleUrl: './consultar-notificaciones.component.css',
})
export class ConsultarNotificacionesComponent implements OnInit {
  showLoading: boolean = false;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'fechaUltActualizacion',
    'nombrePaciente',
    'nombrePlantilla',
    'status',
  ];

  ngOnInit(): void {
    this.obetenerStatusCorreos();
  }

  constructor(private Service: Service) {}

  applyFilter(event: any) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }

  }

  announceSortChange(data: any) {}

  obetenerStatusCorreos() {
    this.showLoading = true;
    this.Service.GetData(
      UrlsBackend.ApiNotificacion,
      UrlsPlantillas.ObtenerStatusCorreos,
      ''
    ).subscribe({
      next: (result: NotificacionStatus[]) => {
        console.log('getplan', result);

        this.dataSource = new MatTableDataSource<NotificacionStatus>(result);
        console.log('this.dataSource', this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.showLoading = false;
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
}
