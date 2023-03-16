import {Component} from '@angular/core';
import {PhotoService} from "../../Services/photo.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Photo, Thumbnail} from "../../app.component";
import {Buffer} from 'buffer';
import {MatDialog} from "@angular/material/dialog";
import {Location} from '@angular/common';
import {ConfirmDeleteComponent} from "../confirm-delete/confirm-delete.component";

@Component({
  selector: 'app-myphotos',
  templateUrl: './myphotos.component.html',
  styleUrls: ['./myphotos.component.css']
})
export class MyphotosComponent {
  thumbnails: Thumbnail[] = [];
  username: string = "";
  showDeleteIcon: boolean = false;

  constructor(private photoService: PhotoService, private location: Location, private dialog: MatDialog, private sanitizer: DomSanitizer) {
    this.myPhotos();
    this.getUser();

  }

  refresh() {
    this.location.go(this.location.path());
    window.location.reload();
  }

  openModal(photoId: string) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {id: photoId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }

  getUser() {
    let user = localStorage.getItem("User");
    this.username = (user === null) ? "" : user;
    return this.username;
  }


  myPhotos() {
    let thumbnails: Thumbnail[] = [];
    this.photoService.getUserGallery(this.getUser()).subscribe({
      next: (res) => {
        res.forEach((image: Photo) => {
          let buf = Buffer.from(image.img.data).toString('base64');
          let thumbnail = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + buf);
          thumbnails.push({id: image._id, src: thumbnail});
        });
        this.thumbnails = thumbnails;
      }
    })
  }
}
