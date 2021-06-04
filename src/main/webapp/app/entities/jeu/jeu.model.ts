import * as dayjs from 'dayjs';
import { IEditeur } from 'app/entities/editeur/editeur.model';
import { IAvis } from 'app/entities/avis/avis.model';

export interface IJeu {
  id?: number;
  nom?: string | null;
  description?: string | null;
  dateSortie?: dayjs.Dayjs | null;
  editeurs?: IEditeur[] | null;
  avis?: IAvis | null;
}

export class Jeu implements IJeu {
  constructor(
    public id?: number,
    public nom?: string | null,
    public description?: string | null,
    public dateSortie?: dayjs.Dayjs | null,
    public editeurs?: IEditeur[] | null,
    public avis?: IAvis | null
  ) {}
}

export function getJeuIdentifier(jeu: IJeu): number | undefined {
  return jeu.id;
}
