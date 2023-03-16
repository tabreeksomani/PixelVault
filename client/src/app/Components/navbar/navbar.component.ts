import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FileUploadComponent} from "../file-upload/file-upload.component";
import {Location} from '@angular/common';
import {UserService} from "../../Services/user.service";
import {Clipboard} from '@angular/cdk/clipboard';
import {Router} from "@angular/router";
import {MatSnackBar} from '@angular/material/snack-bar';


interface NavLink {
  path: string;
  label: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isPublic: boolean = false;
  privacy: string = "Public"
  name: string = "";
  shareBaseLink: any = 'localhost:4200/gallery/';
  selectedTabIndex: any;
  navLinks: NavLink[] = [
    {path: '/gallery', label: 'Gallery'},
    {path: '/myphotos', label: 'My Photos'}
  ];

  constructor(private clipboard: Clipboard, private userService: UserService, private dialog: MatDialog, private location: Location, private router: Router, private snackBar: MatSnackBar) {
    let isPublicValue = localStorage.getItem("isPublic");
    let nameValue = localStorage.getItem("firstName");

    if (isPublicValue !== null) {
      this.isPublic = JSON.parse(isPublicValue);
      if (!this.isPublic) {
        this.privacy = "Private"
      }
    }
    if (nameValue !== null) {
      this.name = nameValue;
    }
    let userNameValue = localStorage.getItem("User");

    if (userNameValue !== null) {
      this.shareBaseLink += userNameValue;
    }

  }


  refresh() {
    this.location.go(this.location.path());
    window.location.reload();
  }

  openModal() {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '400px',
      data: {} // Optional data to pass to your modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
      }
    });
  }


  updatePrivacy(event: { checked: boolean; }) {
    return this.userService.updatePrivacy(event.checked).subscribe(() => {
      this.isPublic = event.checked;
      this.privacy = this.isPublic ? "Public" : "Private";
      localStorage.setItem("isPublic", this.isPublic.toString());
      this.refresh();
    });

  }

  copyLink() {
    this.clipboard.copy(this.shareBaseLink);
    this.snackBar.open("Copied to clipboard", undefined, {
      duration: 500
    });

  }

  logout() {
    return localStorage.clear();
  }

  redirectToHome() {
    return this.router.navigate(['/gallery']);
  }
}
