import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ToastComponent} from "../toast/toast.component";
import {LoginForm} from "../login/login.component";

export interface RegisterForm extends LoginForm {
  username: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: RegisterForm = {
    email: '',
    password: '',
    username: ''
  };

  registerForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [
      Validators.required,
      Validators.email
    ]),
    username: new UntypedFormControl('', [
      Validators.required
    ]),
    password: new UntypedFormControl('', [
      Validators.required
    ])
  })

  get email() {
    return this.registerForm.get('email')
  }

  get username() {
    return this.registerForm.get('username')
  }

  get password() {
    return this.registerForm.get('password')
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: MatSnackBar
  ) {

  }

  ngOnInit(): void {
  }

  handleSubmit() {
    const {email, password, username} = this.form;
    this.authService.register(email, username, password)
      .subscribe((res) => {
        this.router.navigate(['/login'], {replaceUrl: true});
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            message: 'Register successfully! Please Login',
            type: 'success'
          },
          verticalPosition: 'top'
        })
      }, err => {
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            message: err.error,
            type: 'error'
          },
          verticalPosition: 'top'
        })
      })
  }

}
