import { OpcionesSidebar } from "../enums/sidebar";


export class Utils {
static  getRouteForOption(option: OpcionesSidebar): string | null {
    const routesMap: Record<OpcionesSidebar, string> = {
      [OpcionesSidebar.Home]: '/inicio',
      [OpcionesSidebar.Profile]: '/profile',
      [OpcionesSidebar.Tratamientos]: '/tratamientos',
      [OpcionesSidebar.AgregarPaciente]: '/expediente_paciente',
      [OpcionesSidebar.ConfigHistorias]: '/configuracion_historias',
      [OpcionesSidebar.NuevoUsuario]: '/register',
      [OpcionesSidebar.Plantillas]: '/plantillas_correos',
      [OpcionesSidebar.EnviarNotificaciones]: '/enviar_notificaciones',
      [OpcionesSidebar.ConsultarNotificaciones]: '/consultar_notificaciones',
      [OpcionesSidebar.Impresion]: '/configuracion_impresion',
      [OpcionesSidebar.ConfiguracionInforme]:
        '/configuracion_informesoperatorios',
      [OpcionesSidebar.IMC]: '/imc',
      [OpcionesSidebar.ConfigurarJustificaciones]: '/configurar_justificaciones',
    };

    return routesMap[option] || null;
  }
}