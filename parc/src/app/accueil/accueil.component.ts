import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { AttractionService } from '../Service/attraction.service';
import { AttractionInterface } from '../Interface/attraction.interface';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {

  public attractions: Observable<AttractionInterface[]>;

  constructor(public attractionService: AttractionService) {
    this.attractions = this.attractionService.getAllAttraction();
  }
}
