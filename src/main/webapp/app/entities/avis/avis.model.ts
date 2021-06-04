import * as dayjs from 'dayjs';
import { IJoueur } from 'app/entities/joueur/joueur.model';
import { IJeu } from 'app/entities/jeu/jeu.model';

export interface IAvis {
  id?: number;
  note?: number | null;
  description?: string | null;
  dateEnvoi?: dayjs.Dayjs | null;
  joueurs?: IJoueur[] | null;
  jeus?: IJeu[] | null;
}

export class Avis implements IAvis {
  constructor(
    public id?: number,
    public note?: number | null,
    public description?: string | null,
    public dateEnvoi?: dayjs.Dayjs | null,
    public joueurs?: IJoueur[] | null,
    public jeus?: IJeu[] | null
  ) {}
}

export function getAvisIdentifier(avis: IAvis): number | undefined {
  return avis.id;
}
