export enum UrlsBackend {
  ApiPacientes = 'https://clinicaolivera.azurewebsites.net/CliniaOv/CliniaOvController/',
  ApiTratamientos = 'https://clinicaolivera.azurewebsites.net/api/Tratamientos/TratamientosController/',
  ApiNotificacion = 'https://clinicaolivera.azurewebsites.net/api/NotificationEmail/NotificationEmailController/',
  ApiAuth = 'https://clinicaolivera.azurewebsites.net/api/Authentication/AuthenticationController/',
}

export enum UrlsTratamientos {
  Get = 'GetTratamientos',
  GetById = 'GetTratamientoId',
  Insert = 'PostInsertTratamientos',
  Edit = 'EditTratamiento',
  Delete = 'DeleteTratamiento',
}

export enum UrlsPlantillas {
  Get = 'GetPlantilla',
  GetById = 'GetPlantillaId',
  Post = 'PostPlantillas',
  Delete = 'DeletePlantilla',
  GetPacientesVinculadosPP = 'PacientesVinculadosPP',
  PostAgregarVinculo = 'AgregarVinculoPlantillasPacientes',
  DeleteEliminarVinculo = 'EliminarVinculoPlantillasPacientes',
  SendEmail = 'SendEmail',
  ObtenerStatusCorreos = 'ObtenerStatusCorreos',
  SendEmailFelicitaciones = 'SendEmailFelicitaciones',
}

export enum UrlsPacientes {
  GetPacientesNotificaciones = 'GetPacientesNotificacionesCitas',
  GetCitasPorFecha = 'GetCitasPorFecha',
}

export enum UrlsAuth {
  GetUsersPermitidos = 'GetUsersPermitidos',
}
