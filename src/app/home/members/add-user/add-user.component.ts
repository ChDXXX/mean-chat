import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MemberService} from "../../../member.service";
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ToastComponent} from "../../../toast/toast.component";
import {ContactService} from "../../../contact.service";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  form = {
    email: '',
    username: '',
    password: ''
  }

  createForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    username: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  })

  get email() {
    return this.createForm.get('email');
  }

  get username() {
    return this.createForm.get('username');
  }

  get password() {
    return this.createForm.get('password');
  }


  constructor(
    private memberService: MemberService,
    private contactService: ContactService,
    private toast: MatSnackBar,
    private dialogRef: MatDialogRef<AddUserComponent>
  ) { }

  ngOnInit(): void {
  }

  handleCreate() {
    this.memberService.createMember(
      this.form.username,
      this.form.email,
      this.form.password
    ).subscribe(() => {
      this.toast.openFromComponent(ToastComponent, {
        duration: 3000,
        data: {
          type: 'success',
          message: 'Create successfully!'
        },
        verticalPosition: "top"
      });
      this.memberService.refresh();
    }, err => {
      this.toast.openFromComponent(ToastComponent, {
        duration: 3000,
        data: {
          type: 'error',
          message: err.error
        },
        verticalPosition: "top"
      })
    }, () => {
      this.dialogRef.close();
    })
  }

}
