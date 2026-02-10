import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { AttractionInterface } from '../Interface/attraction.interface';
import { MessageInterface } from '../Interface/message.interface';

@Injectable({
  providedIn: 'root',
})
export class AttractionService {

  constructor(private dataService: DataService) {}

  /**
   * Récupérer toutes les attractions
   * @param isAdmin Si true, récupère toutes les attractions (visible ou non)
   */
  public getAllAttraction(isAdmin: boolean = false): Observable<AttractionInterface[]> {
    const url = isAdmin ? "https://api/attraction?admin=true" : "https://api/attraction";
    return this.dataService.getData(url) as Observable<AttractionInterface[]>;
  }

  /**
   * Récupérer une attraction par son ID
   * @param id ID de l'attraction
   * @param isAdmin Si true, récupère l'attraction même si elle n'est pas visible
   */
  public getAttraction(id: number, isAdmin: boolean = false): Observable<AttractionInterface> {
    const url = isAdmin 
      ? `https://api/attraction/${id}?admin=true` 
      : `https://api/attraction/${id}`;
    return this.dataService.getData(url) as Observable<AttractionInterface>;
  }

  /**
   * Ajouter ou modifier une attraction (admin uniquement)
   */
  public postAttraction(attraction: AttractionInterface): Observable<MessageInterface> {
    const url = "https://api/attraction";
    return this.dataService.postData(url, attraction) as Observable<MessageInterface>;
  }

  /**
   * Supprimer une attraction (admin uniquement)
   */
  public deleteAttraction(id: number): Observable<MessageInterface> {
    const url = `https://api/attraction/${id}`;
    return this.dataService.deleteData(url) as Observable<MessageInterface>;
  }

  /**
   * Basculer la visibilité d'une attraction (admin uniquement)
   */
  public toggleVisibility(id: number): Observable<MessageInterface> {
    const url = `https://api/attraction/${id}/visibility`;
    return this.dataService.patchData(url, {}) as Observable<MessageInterface>;
  }
}