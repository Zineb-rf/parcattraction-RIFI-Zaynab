import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';

import { AttractionInterface } from '../Interface/attraction.interface';
import { AttractionService } from '../Service/attraction.service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  public formulaireAttractions: FormGroup[] = [];

  public attractions: Observable<AttractionInterface[]> =
    this.attractionService.getAllAttraction().pipe(
      tap((attractions: AttractionInterface[]) => {
        attractions.forEach(attraction => {
          this.formulaireAttractions.push(
            new FormGroup({
              attraction_id: new FormControl(attraction.attraction_id),
              nom: new FormControl(attraction.nom, [Validators.required]),
              description: new FormControl(attraction.description, [Validators.required]),
              difficulte: new FormControl(attraction.difficulte),
              visible: new FormControl(attraction.visible)
            })
          );
        });
      })
    );

  constructor(
    public attractionService: AttractionService,
    public formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  public onSubmit(attractionFormulaire: FormGroup): void {
    this.attractionService
      .postAttraction(attractionFormulaire.getRawValue())
      .subscribe(result => {
        attractionFormulaire.patchValue({ attraction_id: result.result });
        this._snackBar.open(result.message, undefined, {
          duration: 1000
        });
      });
  }

  public addAttraction(): void {
    this.formulaireAttractions.push(
      new FormGroup({
        attraction_id: new FormControl(),
        nom: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        difficulte: new FormControl(),
        visible: new FormControl(true)
      })
    );
  }
}
