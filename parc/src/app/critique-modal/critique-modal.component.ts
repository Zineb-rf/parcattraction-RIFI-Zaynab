import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CritiqueService } from '../Service/critique.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-critique-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './critique-modal.component.html',
  styleUrls: ['./critique-modal.component.scss']
})
export class CritiqueModalComponent {
  critiqueForm: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedRating: number = 0;

  constructor(
    private fb: FormBuilder,
    private critiqueService: CritiqueService,
    private dialogRef: MatDialogRef<CritiqueModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { attractionId: number, attractionNom: string }
  ) {
    this.critiqueForm = this.fb.group({
      texte: ['', [Validators.required, Validators.minLength(10)]],
      note: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      prenom: [''],
      nom: [''],
      anonyme: [false]
    });

    // Observer les changements du checkbox anonyme
    this.critiqueForm.get('anonyme')?.valueChanges.subscribe(anonyme => {
      if (anonyme) {
        this.critiqueForm.patchValue({ prenom: '', nom: '' });
        this.critiqueForm.get('prenom')?.disable();
        this.critiqueForm.get('nom')?.disable();
      } else {
        this.critiqueForm.get('prenom')?.enable();
        this.critiqueForm.get('nom')?.enable();
      }
    });
  }

  selectRating(rating: number): void {
    this.selectedRating = rating;
    this.critiqueForm.patchValue({ note: rating });
  }

  onSubmit(): void {
    if (this.critiqueForm.valid) {
      const formValue = this.critiqueForm.getRawValue();
      const critique = {
        attraction_id: this.data.attractionId,
        texte: formValue.texte,
        note: formValue.note,
        prenom: formValue.anonyme ? '' : formValue.prenom,
        nom: formValue.anonyme ? '' : formValue.nom,
        anonyme: formValue.anonyme
      };

      this.critiqueService.addCritique(this.data.attractionId, critique).subscribe({
        next: (response) => {
          this.snackBar.open('Critique ajoutée avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de l\'ajout de la critique', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}