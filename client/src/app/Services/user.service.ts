import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

interface Token {
  token: string,
  user: {
    username: string,
    firstName: string,
    isPublic: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {
  }

  registerUser(username: string, password: string, email: string, firstName: string, lastName: string) {
    let body = {
      "username": username,
      "password": password,
      "email": email,
      "firstName": firstName,
      "lastName": lastName
    }
    return this.http.post(this.apiUrl + '/register', body);
  }


  authenticateUser(username: string, password: string) {
    let body = {
      "username": username,
      "password": password
    }
    return this.http.post<Token>(this.apiUrl + '/login', body);

  }


  updatePrivacy(isPublic: boolean, jwt: string) {
    return this.http.put(this.apiUrl + '/' + isPublic, null, {
      headers: new HttpHeaders({"x-access-token": jwt})
    }).subscribe();
  }


}
