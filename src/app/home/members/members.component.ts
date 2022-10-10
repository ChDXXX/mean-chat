import { Component, OnInit } from '@angular/core';
import {Member, MemberService, UserRole} from "../../member.service";
import {AuthService} from "../../auth.service";
import {MatDialog} from "@angular/material/dialog";
import {AddUserComponent} from "./add-user/add-user.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ToastComponent} from "../../toast/toast.component";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  constructor(
    private toast: MatSnackBar,
    public memberService: MemberService,
    public authService: AuthService,
    public addUserDialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  handleClickUpgradeSuperAdmin(user_id: string) {
    this.memberService.upgradeToSuperAdmin(user_id)
      .subscribe(() => {
        this.memberService.refresh();
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            type: 'success',
            message: "Upgrade successfully!"
          }
        })
      })
  }

  handleClickUpgradeGroupAdmin(user_id: string) {
    this.memberService.upgradeToGroupAdmin(user_id)
      .subscribe(() => {
        this.memberService.refresh();
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            type: 'success',
            message: "Upgrade successfully!"
          }
        })
      })
  }

  handleClickUpgradeChannelAdmin(user_id: string) {
    this.memberService.upgradeToChannelAdmin(this.memberService.currentChannel?._id as string, user_id)
      .subscribe(() => {
        this.memberService.refresh();
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            type: 'success',
            message: "Upgrade successfully!"
          }
        })
      })
  }

  get isSuperAdmin() {
    return this.authService.user?.roles.find(role => role.role === UserRole.SUPER_ADMIN);
  }

  get isGroupAdmin() {
    return this.memberService.currentGroup?.creator === this.authService.getUserId();
  }

  handleRemoveMember(user: Member) {
    this.memberService.removeMember(user._id)
      .subscribe(() => {
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            type: 'success',
            message: 'Remove successfully!'
          },
          verticalPosition: 'top'
        });
        this.memberService.refresh();
      })
  }

  handleClickAddMore() {
    this.addUserDialog.open(AddUserComponent, {
      width: '600px'
    })
  }

}
