import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Photo} from "../app.component";

export function getJwt() {
  const storageToken = localStorage.getItem("jwt");
  if (storageToken !== null)
    return storageToken;
  return "";
}

@Injectable({
  providedIn: 'root'
})

export class PhotoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {
  }

  getGallery() {
    return this.http.get<Photo[]>(this.apiUrl + '/photos', {
      headers: new HttpHeaders({"x-access-token": getJwt()})
    });
  }

  uploadPhoto(formData: FormData) {
    return this.http.post<HttpResponse<Response>>(this.apiUrl + '/photos', formData, {
      headers: new HttpHeaders({"x-access-token": getJwt()})
    });
  }

  deletePhoto(photoId: string) {
    return this.http.delete((this.apiUrl + "/photos/" + photoId), {
      headers: new HttpHeaders({"x-access-token": getJwt()})
    });
  }

  getUserGallery(userId: string) {
    return this.http.get<Photo[]>(this.apiUrl + '/users/' + userId + "/photos", {
      headers: new HttpHeaders({"x-access-token": getJwt()})
    });

  }


}
