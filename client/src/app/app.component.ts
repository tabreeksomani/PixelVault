import {Component} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

import {Buffer} from 'buffer';
import {UserService} from "./Services/user.service";
import {PhotoService} from "./Services/photo.service";


export interface Photo {
  _id: string;
  created: Date;
  img: {
    data: Buffer;
    contentType: string;
  };
}

interface Thumbnail {
  id: string,
  src: SafeUrl
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  username: string = "";
  password: string = "";
  email: string = "";
  firstName: string = "";
  lastName: string = "";
  jwt: string = "";
  thumbnails: Thumbnail[] = [];
  private loggedIn: boolean = false;
  selectedFile: File | null = null;
  gallery: Thumbnail[] = [];
  isPublic: boolean = false;


  constructor(private userService: UserService, private photoService: PhotoService, private sanitizer: DomSanitizer) {
    this.getJwt();
  }

  getJwt() {
    if (this.jwt.length === 0) {
      const storageToken = localStorage.getItem("jwt");
      if (storageToken !== null)
        this.jwt = storageToken;
    }
    return this.jwt;
  }

  updatePrivacy() {
    this.isPublic = !this.isPublic;
    return this.userService.updatePrivacy(this.isPublic, this.jwt);
  }

  register() {
    return this.userService.registerUser(this.username, this.password, this.email, this.firstName, this.lastName).subscribe({
        next: () => {
          alert("Account created Successful")
        },
        error: (err: any) => {
          alert(err.error);
        }
      }
    )

  }

  login() {
    return this.userService.authenticateUser(this.username, this.password).subscribe({
        next: (res) => {
          this.jwt = res.token;
          this.loggedIn = true;
          localStorage.setItem('jwt', res.token);
          alert("Login Successful")
        },
        error: (err: any) => {
          alert(err.error);
        }
      }
    )

  }

  getGallery() {
    this.gallery = [];
    this.photoService.getGallery(this.jwt).subscribe({
      next: (res) => {
        res.forEach((image: Photo) => {
          let buf = Buffer.from(image.img.data).toString('base64');
          let thumbnail = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + buf);
          this.gallery.push({id: image._id, src: thumbnail});
          console.log(image._id);
        });
      },
      error: err => {
        alert(err.error);
      }
    })
  }

  myPhotos() {
    this.thumbnails = [];
    this.photoService.getUserGallery(this.username, this.jwt).subscribe({
      next: (res) => {
        res.forEach((image: Photo) => {
          let buf = Buffer.from(image.img.data).toString('base64');
          let thumbnail = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + buf);
          this.thumbnails.push({id: image._id, src: thumbnail});
          console.log(image._id);
        });
        // console.log(this.thumbnails);
        alert("Photos Added");

      }
    })

  }

  userGallery(userId: string) {
    this.thumbnails = [];
    this.photoService.getUserGallery(userId, this.jwt).subscribe({
      next: (res) => {
        res.forEach((image: Photo) => {
          let buf = Buffer.from(image.img.data).toString('base64');
          let thumbnail = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + buf);
          this.thumbnails.push({id: image._id, src: thumbnail});
          console.log(image._id);
        });
        // console.log(this.thumbnails);
        alert("Photos Added");

      }
    })

  }

  logout() {
    this.loggedIn = false;
    this.jwt = "";
    localStorage.removeItem("jwt");
  }

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
      console.log("Sending");
      return this.photoService.uploadPhoto(formData, this.jwt).subscribe({
        next: response => {
          alert(response);
        },
        error: err => {
          alert(err.error)
        }
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

  deletePhoto(photo_id: string) {
    this.photoService.deletePhoto(photo_id, this.jwt).subscribe((response) => {
        console.log(response);
        alert("Successfully Deleted");
      }
    );
    this.myPhotos();
  }
}
