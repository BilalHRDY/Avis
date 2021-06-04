import * as dayjs from 'dayjs';
import { IAvis } from 'app/entities/avis/avis.model';

export interface IJoueur {
  id?: number;
  pseudo?: string | null;
  motDePasse?: string | null;
  dateInscription?: dayjs.Dayjs | null;
  estAdministrateur?: boolean | null;
  avis?: IAvis | null;
}

export class Joueur implements IJoueur {
  constructor(
    public id?: number,
    public pseudo?: string | null,
    public motDePasse?: string | null,
    public dateInscription?: dayjs.Dayjs | null,
    public estAdministrateur?: boolean | null,
    public avis?: IAvis | null
  ) {
    this.estAdministrateur = this.estAdministrateur ?? false;
  }
}

export function getJoueurIdentifier(joueur: IJoueur): number | undefined {
  return joueur.id;
}
