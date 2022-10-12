import {Component, OnInit} from '@angular/core';
import {Channel, ContactService, Group} from "../../contact.service";
import {AuthService, USER_ID} from "../../auth.service";
import {MemberService, UserRole} from "../../member.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateGroupComponent} from "./create-group/create-group.component";
import {CreateChannelComponent} from "./create-channel/create-channel.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ToastComponent} from "../../toast/toast.component";
import {SocketioService} from "../../socketio.service";

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  user_id: string = localStorage.getItem(USER_ID) || '';
  constructor(
    private socketService: SocketioService,
    private toast: MatSnackBar,
    private authService: AuthService,
    public contactService: ContactService,
    private memberService: MemberService,
    private dialog: MatDialog
  ) { }

  get contacts() {
    return this.contactService.contacts.map(contact => {
      contact.channels = contact.channels.filter(channel => {
        return channel.admins.includes(this.user_id) || channel.users.includes(this.user_id) || channel.creator === this.user_id;
      })
      contact.open = this.contactService.openedGroups.includes(contact._id);
      return contact;
    });
  }

  get groupAdmin() {
    return this.authService.user?.roles.some(role => role.role >= UserRole.GROUP_ADMIN);
  }

  ngOnInit(): void {
    this.contactService.fetchContacts();
  }


  handleOpenGroup(group: Group) {
    this.contactService.openGroup(group._id);
    this.memberService.currentGroup = group;
  }

  handleOpenCreateChannel(group: string) {
    this.dialog.open(CreateChannelComponent, {
      width: '600px',
      data: {
        group: group
      }
    })
  }

  handleOpenCreateGroup() {
    this.dialog.open(CreateGroupComponent, {
      width: '600px'
    })
  }

  handleClickChannel(e: MouseEvent, channel: Channel) {
    const target = e.target as HTMLElement;
    if (target.innerHTML !== 'delete') {
      // clicked channel
      this.memberService.refreshMembers(channel);
      this.socketService.switchChannel(channel._id);
    }
  }

  handleRemoveGroup(group: Group) {
    this.contactService.deleteGroup(group._id)
      .subscribe(() => {
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            message: "Delete successfully!",
            type: "success"
          },
          verticalPosition: 'top'
        });
        this.contactService.fetchContacts();
      }, err => {
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            message: err.error,
            type: "error"
          },
          verticalPosition: 'top'
        });
      })
  }

  handleRemoveChannel(channel: Channel) {
    this.contactService.deleteChannel(channel._id)
      .subscribe(() => {
        this.toast.openFromComponent(ToastComponent, {
          duration: 3000,
          data: {
            message: "Delete successfully!",
            type: "success"
          },
          verticalPosition: 'top'
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
        });
      })
  }

  isChannelAdmin(channel: Channel) {
    return channel.admins.includes(this.user_id);
  }

  isChannelAdminInGroup(group: Group): Boolean {
    return group.creator === this.user_id || Boolean(group.channels.find(channel => {
      return channel.admins.includes(this.user_id);
    }));
  }

  isGroupAdmin(group: Group) {
    return group.creator === this.user_id;
  }


}
