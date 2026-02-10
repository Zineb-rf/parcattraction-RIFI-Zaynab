export interface CritiqueInterface {
    critique_id?: number;
    attraction_id: number;
    texte: string;
    note: number;
    prenom: string;
    nom: string;
    anonyme: boolean;
    date_creation?: string;
}

export interface CritiqueStatsInterface {
    nombre_critiques: number;
    note_moyenne: number;
    note_min: number;
    note_max: number;
}