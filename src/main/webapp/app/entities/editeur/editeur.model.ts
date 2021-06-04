import { IJeu } from 'app/entities/jeu/jeu.model';

export interface IEditeur {
  id?: number;
  nom?: string | null;
  jeu?: IJeu | null;
}

export class Editeur implements IEditeur {
  constructor(public id?: number, public nom?: string | null, public jeu?: IJeu | null) {}
}

export function getEditeurIdentifier(editeur: IEditeur): number | undefined {
  return editeur.id;
}
