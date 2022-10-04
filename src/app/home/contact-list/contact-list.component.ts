import {Component, OnInit} from '@angular/core';
import {Channel, ContactService, Group} from "../../contact.service";
import {AuthService, USER_ID} from "../../auth.service";
import {MemberService, UserRole} from "../../member.service";

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: Group[] = [];
  user_id: string = localStorage.getItem(USER_ID) || '';
  constructor(
    private authService: AuthService,
    private contactService: ContactService,
    private memberService: MemberService
  ) { }

  get groupAdmin() {
    return this.authService.user?.roles.some(role => role.role >= UserRole.GROUP_ADMIN);
  }

  ngOnInit(): void {
    this.fetchContacts();
  }

  handleClickChannel(e: MouseEvent, channel: Channel) {
    const target = e.target as HTMLElement;
    if (target.innerHTML !== 'delete') {
      // clicked channel
      this.memberService.refreshMembers(channel);
    }
  }

  handleRemoveChannel(channel: Channel) {

  }



  fetchContacts() {
    this.contactService.getUserContacts()
      .subscribe(contacts => {
        this.contacts = contacts.map(contact => {
          contact.channels = contact.channels.filter(channel => {
            return channel.admins.includes(this.user_id) || channel.users.includes(this.user_id) || channel.creator === this.user_id;
          })
          return contact;
        });
      })
  }

  isChannelAdmin(channel: Channel) {
    return channel.admins.includes(this.user_id);
  }

  isChannelAdminInGroup(group: Group): Boolean {
    return Boolean(group.channels.find(channel => {
      return channel.admins.includes(this.user_id);
    }));
  }

  isGroupAdmin(group: Group) {
    return group.creator === this.user_id;
  }


}
