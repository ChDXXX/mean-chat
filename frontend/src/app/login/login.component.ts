import { Component, OnInit } from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validator, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ToastComponent, ToastData} from "../toast/toast.component";

export interface LoginForm {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: LoginForm = {
    email: '',
    password: ''
  };

  loginForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new UntypedFormControl('', [
      Validators.required
    ])
  })

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
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
    const {email, password} = this.form;
    this.authService.login(email, password)
      .subscribe((res) => {
        this.authService.saveToken(res.token);
        this.authService.saveUserId(res._id);
        this.authService.refreshRoles();
        this.router.navigate(['/'], {replaceUrl: true});
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            message: 'Welcome!',
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
