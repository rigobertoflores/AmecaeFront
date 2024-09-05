export interface Plantilla {
  id: number;
  nombre: string;
  asunto: string;
  cuerpoEmail: string;
  fechaEnvio: string;
  adjunto: string;
}


export interface PacientesPlantillas {
  pacientesActivos: { pacientesActivos: NotificacionPacientes };
  pacientesInactivos: { pacientesInactivos: NotificacionPacientes };
  }

export interface NotificacionPacientes {
  id: string;
  email: string;
  fechaConsulta: string;
  nombre: string;
}

export interface NotificacionStatus {
  id: number;
  pacienteId: string;
  plantillaId: string;
  nombrePaciente: string;
  nombrePlantilla: string;
  fechaCreacion: string;
  fechaUltActualizacion: string;
  status: string;
}
