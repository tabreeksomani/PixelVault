import {Component} from '@angular/core';
import {Photo, Thumbnail} from "../app.component";
import {PhotoService} from "../Services/photo.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Buffer} from 'buffer';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  constructor(private photoService: PhotoService, private sanitizer: DomSanitizer) {
    this.getGallery();
  }

  gallery: Thumbnail[] = [];

  getGallery() {
    let updatedGallery: Thumbnail[] = [];
    this.photoService.getGallery().subscribe({
      next: (res) => {
        res.forEach((image: Photo) => {
          let buf = Buffer.from(image.img.data).toString('base64');
          let thumbnail = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + buf);
          updatedGallery.push({id: image._id, src: thumbnail});
          console.log(image._id);
        });
        this.gallery = updatedGallery;
      },
      error: err => {
        alert(err.error);
      }
    })
  }
}
