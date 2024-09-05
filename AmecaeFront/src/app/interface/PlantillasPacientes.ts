export interface AsociacionPlantillaPaciente {
  PlantillaId: string;
  PacienteId: string;
  NombrePlantilla: string;
  NombrePaciente: string;
}

export interface RelacionPlantilllaPaciente {
  id: number;
  plantillaId: number;
  pacienteId: number;
  status: string;
  fechaUltActualizacion: Date | null;
  fechaCreacion: Date | null;
  nombrePlantilla: string | null;
  nombrePaciente: string | null;
}
