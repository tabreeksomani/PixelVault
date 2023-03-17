import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Photo, Thumbnail} from "../../app.component";
import {PhotoService} from "../../Services/photo.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Buffer} from 'buffer';

@Component({
  selector: 'app-user-gallery',
  templateUrl: './user-gallery.component.html',
  styleUrls: ['./user-gallery.component.css']
})
export class UserGalleryComponent {
  userId: string = "";
  thumbnails: Thumbnail[] = [];

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private photoService: PhotoService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    this.getPhotos();
  }

  getPhotos() {
    let thumbnails: Thumbnail[] = [];
    return this.photoService.getUserGallery(this.userId).subscribe({
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

