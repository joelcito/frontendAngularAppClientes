import { Region } from './region';

/*Aqui podemos poner nombres por defecto en los formularos */
export class Cliente {
  id: number;
  nombre: string;
  apellido: string;
  createAt: string;
  email: string;
  foto: string;
  region: Region;
}
