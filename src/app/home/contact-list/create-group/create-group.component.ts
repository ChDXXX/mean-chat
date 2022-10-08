import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ContactService} from "../../../contact.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ToastComponent} from "../../../toast/toast.component";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {
  form = {
    name: ''
  }

  createForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ])
  })

  constructor(
    private contactService: ContactService,
    private toast: MatSnackBar,
    private dialog: MatDialogRef<CreateGroupComponent>
  ) { }

  ngOnInit(): void {
  }

  get name() {
    return this.createForm.get('name');
  }

  handleCreate() {
    this.contactService
      .createGroup(this.form.name)
      .subscribe(() => {
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            message: "Create successfully!",
            type: "success"
          },
          verticalPosition: "top"
        });
        this.contactService.fetchContacts();
      }, err => {
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            message: err.error,
            type: "error"
          },
          verticalPosition: "top"
        })
      }, () => {
        this.dialog.close();
      })
  }



}
