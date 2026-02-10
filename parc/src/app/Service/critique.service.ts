import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { CritiqueInterface, CritiqueStatsInterface } from '../Interface/critique.interface';
import { MessageInterface } from '../Interface/message.interface';

@Injectable({
  providedIn: 'root',
})
export class CritiqueService {

  constructor(private dataService: DataService) {}

  /**
   * Ajouter une critique pour une attraction
   */
  public addCritique(attractionId: number, critique: CritiqueInterface): Observable<MessageInterface> {
    const url = `https://api/attraction/${attractionId}/critique`;
    return this.dataService.postData(url, critique) as Observable<MessageInterface>;
  }

  /**
   * Récupérer toutes les critiques d'une attraction
   */
  public getCritiquesByAttraction(attractionId: number): Observable<CritiqueInterface[]> {
    const url = `https://api/attraction/${attractionId}/critique`;
    return this.dataService.getData(url) as Observable<CritiqueInterface[]>;
  }

  /**
   * Récupérer les statistiques des critiques d'une attraction
   */
  public getCritiqueStats(attractionId: number): Observable<CritiqueStatsInterface> {
    const url = `https://api/attraction/${attractionId}/critique/stats`;
    return this.dataService.getData(url) as Observable<CritiqueStatsInterface>;
  }

  /**
   * Récupérer toutes les critiques (admin uniquement)
   */
  public getAllCritiques(): Observable<CritiqueInterface[]> {
    const url = 'https://api/critique';
    return this.dataService.getData(url) as Observable<CritiqueInterface[]>;
  }

  /**
   * Supprimer une critique (admin uniquement)
   */
  public deleteCritique(critiqueId: number): Observable<MessageInterface> {
    const url = `https://api/critique/${critiqueId}`;
    return this.dataService.deleteData(url) as Observable<MessageInterface>;
  }
}