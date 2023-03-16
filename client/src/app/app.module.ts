import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import {Routes, RouterModule} from '@angular/router';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PhotoService} from "./Services/photo.service";
import {UserService} from "./Services/user.service";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';
import {GalleryComponent} from './gallery/gallery.component';
import {MyphotosComponent} from './myphotos/myphotos.component';
import {UserGalleryComponent} from './user-gallery/user-gallery.component';
import {NavbarComponent} from './navbar/navbar.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {MatGridListModule} from '@angular/material/grid-list';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatSlideToggle,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {FileUploadComponent} from './file-upload/file-upload.component';
import {UserformComponent} from './userform/userform.component';
import {ConfirmDeleteComponent} from './confirm-delete/confirm-delete.component';
import {AuthenticatedGuard} from "./auth-guard/authenticated.guard";
import {MatSnackBarModule} from '@angular/material/snack-bar';

const routes: Routes = [
  {path: '', redirectTo: 'gallery', pathMatch: 'full'},
  {path: 'register', component: SignupComponent, pathMatch: 'prefix'},
  {path: 'login', component: LoginComponent},
  {path: 'gallery', component: GalleryComponent, pathMatch: 'full', canActivate: [AuthenticatedGuard]},
  {path: 'myphotos', component: MyphotosComponent, pathMatch: 'full', canActivate: [AuthenticatedGuard]},
  {path: 'gallery/:id', component: UserGalleryComponent, canActivate: [AuthenticatedGuard]},

];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    GalleryComponent,
    MyphotosComponent,
    UserGalleryComponent,
    NavbarComponent,
    FileUploadComponent,
    UserformComponent,
    ConfirmDeleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatBadgeModule,
    MatToolbarModule,
    MatTabsModule,
    MatGridListModule,
    MatMenuModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
  ],
  exports: [RouterModule],
  providers: [UserService, PhotoService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}
