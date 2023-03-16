import {Component} from '@angular/core';
import {UserService} from "../Services/user.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = "";
  password: string = "";
  formError: string | null = "";

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private userService: UserService, private router: Router) {
    if (userService.isLoggedIn()) {
      router.navigate(['/gallery']);
    }
  }

  login() {
    this.formError = null;
    localStorage.clear();
    let form = this.loginForm.value;
    if (form.username && form.password) {
      return this.userService.authenticateUser(form.username, form.password).subscribe({
          next: (res) => {
            localStorage.setItem('jwt', res.token);
            localStorage.setItem("User", res.user.username);
            localStorage.setItem("isPublic", res.user.isPublic);
            localStorage.setItem("firstName", res.user.firstName);

            return this.router.navigate(['/gallery']);
          },
          error: (err: any) => {
            this.formError = err.error;
          }
        }
      )

    }
    return;
  }
}
