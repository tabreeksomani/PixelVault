import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PhotoService} from "../../Services/photo.service";


@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
              private photoService: PhotoService, @Inject(MAT_DIALOG_DATA) public data: { id: string }) {
  }

  deletePhoto() {
    this.photoService.deletePhoto(this.data.id).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
