export enum UrlsBackend {
  ApiPacientes = 'https://apiamecae-h7fverbshphnbycs.eastus2-01.azurewebsites.net/CliniaOv/CliniaOvController/',
  ApiTratamientos = 'https://apiamecae-h7fverbshphnbycs.eastus2-01.azurewebsites.net/api/Tratamientos/TratamientosController/',
  ApiNotificacion = 'https://apiamecae-h7fverbshphnbycs.eastus2-01.azurewebsites.net/api/NotificationEmail/NotificationEmailController/',
  ApiAuth = 'https://apiamecae-h7fverbshphnbycs.eastus2-01.azurewebsites.net/api/Authentication/AuthenticationController/',
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
