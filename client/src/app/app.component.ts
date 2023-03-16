import {Component} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';

import {Buffer} from 'buffer';
import {UserService} from "./Services/user.service";


export interface Photo {
  _id: string;
  created: Date;
  img: {
    data: Buffer;
    contentType: string;
  };
}


export interface Thumbnail {
  id: string,
  src: SafeUrl
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  constructor(private userService: UserService) {
  }

  LoggedIn() {
    return this.userService.isLoggedIn();
  }
}
