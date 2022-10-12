import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ContactService} from "../../../contact.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ToastComponent} from "../../../toast/toast.component";

export interface CreateChannelData {
  group: string;
}

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.css']
})
export class CreateChannelComponent implements OnInit {
  form = {
    name: ''
  }

  createForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [
      Validators.required
    ])
  })

  get name() {
    return this.createForm.get('name');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateChannelData,
    private contactService: ContactService,
    private toast: MatSnackBar,
    private dialog: MatDialogRef<CreateChannelComponent>
  ) { }

  ngOnInit(): void {
  }

  handleCreate() {
    this.contactService
      .createChannel(this.form.name, this.data.group)
      .subscribe(() => {
        this.contactService.fetchContacts();
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            message: "Create successfully!",
            type: "success"
          },
          verticalPosition: "top"
        });
      }, err => {
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            message: err.error,
            type: "error"
          },
          verticalPosition: "top"
        });
      }, () => {
        this.dialog.close();
      })
  }

}
