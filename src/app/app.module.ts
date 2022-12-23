//  Angular
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  App business logic

//  Material
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import { AppToolbarComponent } from './app-toolbar/app-toolbar.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AppToolbarComponent,
    HelpPageComponent,
    MainPageComponent
  ],
  imports: [
    //  Angular
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    //  Material
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
