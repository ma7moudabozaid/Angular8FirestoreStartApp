import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../../environments/environment';

import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { ItemsComponent } from './items/items.component';
import { DetailsComponent } from './details/details.component';


const homeRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        children: [
          { path: '', component: MainComponent },
          // { path: 'main', component: MainComponent },
          { path: 'items', component: ItemsComponent },
          { path: 'details/:id', component: DetailsComponent },
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [HomeComponent, MainComponent, ItemsComponent, DetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
  ]
})
export class HomeModule { }
