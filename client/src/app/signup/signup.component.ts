import {Component} from '@angular/core';
import {UserService} from "../Services/user.service";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  formError: any;
  signUpForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    confirmpass: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),

  });

  constructor(private userService: UserService, private router: Router) {
    if (userService.isLoggedIn()) {
      router.navigate(['/gallery']);
    }
  }

  register() {
    let form = this.signUpForm.value;
    if (form.password !== form.confirmpass) {
      this.formError = "Passwords don't match";
      return;
    }

    if (form.username && form.username.length < 5) {
      this.formError = "Username must be greater than 5 characters"
      return;
    }

    if (form.username && form.password && form.firstName && form.lastName && form.email) {
      return this.userService.registerUser(form.username, form.password, form.email, form.firstName, form.lastName).subscribe({
          next: () => {
            this.router.navigate(['/login']);

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
