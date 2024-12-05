import { MenuComponent } from './components/menu/menu.component';
import { ExpedientePacienteComponent } from './expediente-paciente/expediente-paciente.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CanActivate } from '@angular/router';
import { AuthGuard } from './Services/AuthGuard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HistoriaConfiguracionComponent } from './historia-configuracion/historia-configuracion.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePassComponent } from './components/change-pass/change-pass.component';
import { TratamientosComponent } from './tratamientos/tratamientos.component';
import { InformesoConfiguracionComponent } from './informeso-configuracion/informeso-configuracion.component';
import { CalculadoraIMCComponent } from './calculadora-imc/calculadora-imc.component';
import { PlantillasCorreosComponent } from './plantillas-correos/plantillas-correos.component';
import { EnviarNotificacionesComponent } from './enviar-notificaciones/enviar-notificaciones.component';
import { ConsultarNotificacionesComponent } from './consultar-notificaciones/consultar-notificaciones.component';
import { ConfiguracionImpresionComponent } from './configuracion-impresion/configuracion-impresion.component';
import { JustificacionesComponent } from './justificaciones/justificaciones.component';
import { JustificacionConfiguracionComponent } from './justificacion-configuracion/justificacion-configuracion.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'resetPass', component: ResetPasswordComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  {
    path: 'expediente_paciente/:id',
    component: ExpedientePacienteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'configuracion_historias',
    component: HistoriaConfiguracionComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'changePass',
    component: ChangePassComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'tratamientos',
    component: TratamientosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'configuracion_informesoperatorios',
    component: InformesoConfiguracionComponent,
    canActivate: [AuthGuard],
  },
  { path: 'imc', component: CalculadoraIMCComponent, canActivate: [AuthGuard] },
  {
    path: 'plantillas_correos',
    component: PlantillasCorreosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'plantillas_correos',
    component: PlantillasCorreosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'plantillas_correos',
    component: PlantillasCorreosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'enviar_notificaciones',
    component: EnviarNotificacionesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'consultar_notificaciones',
    component: ConsultarNotificacionesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'configuracion_impresion',
    component: ConfiguracionImpresionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'configurar_justificaciones',
    component: JustificacionConfiguracionComponent,
    canActivate: [AuthGuard],
  },
];
