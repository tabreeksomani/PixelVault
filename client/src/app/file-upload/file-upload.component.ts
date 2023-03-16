import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PhotoService} from "../Services/photo.service";


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<FileUploadComponent>,
    private photoService: PhotoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
      console.log("Sending");
      return this.photoService.uploadPhoto(formData).subscribe((response) => {
        this.dialogRef.close();
      })
    }
    return;
  }

  onFileSelected(event: Event) {
    if (this.selectedFile) {
      const fileInput = event.target as HTMLInputElement;
      const fileList: FileList | null = fileInput.files;
      if (fileList && fileList.length > 0) {
        this.selectedFile = fileList[0];
      }
    }
  }
}
