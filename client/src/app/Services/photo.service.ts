import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Photo} from "../app.component";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {
  }

  getGallery(jwt: string) {
    return this.http.get<Photo[]>(this.apiUrl + '/photos', {
      headers: new HttpHeaders({"x-access-token": jwt})
    });
  }

  uploadPhoto(formData: FormData, jwt: string) {
    return this.http.post(this.apiUrl + '/photos', formData, {
      headers: new HttpHeaders({"x-access-token": jwt})
    });
  }

  deletePhoto(photoId: string, jwt: string) {
    return this.http.delete((this.apiUrl + "/photos/" + photoId), {
      headers: new HttpHeaders({"x-access-token": jwt})
    });
  }

  getUserGallery(userId: string, jwt: string) {
    return this.http.get<Photo[]>(this.apiUrl + '/users/' + userId + "/photos", {
      headers: new HttpHeaders({"x-access-token": jwt})
    });

  }


}
