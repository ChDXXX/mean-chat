import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import { ToastComponent } from './toast/toast.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import { ContactListComponent } from './home/contact-list/contact-list.component';
import { MembersComponent } from './home/members/members.component';
import { CreateGroupComponent } from './home/contact-list/create-group/create-group.component';
import {MatDialogModule} from "@angular/material/dialog";
import { CreateChannelComponent } from './home/contact-list/create-channel/create-channel.component';
import { AddUserComponent } from './home/members/add-user/add-user.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { MessagesComponent } from './home/messages/messages.component';
import { ChatToolComponent } from './home/chat-tool/chat-tool.component';
import {SocketioService} from "./socketio.service";
import { MediaDashboardComponent } from './home/chat-tool/media-dashboard/media-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ToastComponent,
    ContactListComponent,
    MembersComponent,
    CreateGroupComponent,
    CreateChannelComponent,
    AddUserComponent,
    MessagesComponent,
    ChatToolComponent,
    MediaDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    FormsModule,
    MatTooltipModule
  ],
  providers: [SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
