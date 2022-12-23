//  Angular
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//  App Structure
import { AppToolbarComponent } from './app-toolbar/app-toolbar.component';
import { FramesPlanComponent } from './main-tab-sections/frames-plan/frames-plan.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RunSessionComponent } from './main-tab-sections/run-session/run-session.component';
import { ServerSpecsComponent } from './main-tab-sections/server-specs/server-specs.component';
import { StartEndSpecsComponent } from './main-tab-sections/start-end-specs/start-end-specs.component';
import { TemperatureSpecsComponent } from './main-tab-sections/temperature-specs/temperature-specs.component';

//  Material
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTabsModule} from "@angular/material/tabs";
import {MatToolbarModule} from "@angular/material/toolbar";


@NgModule({
  declarations: [
    AppComponent,
    AppToolbarComponent,
    HelpPageComponent,
    MainPageComponent,
    StartEndSpecsComponent,
    TemperatureSpecsComponent,
    ServerSpecsComponent,
    FramesPlanComponent,
    RunSessionComponent,
  ],
  imports: [
    AppRoutingModule,

    //  Angular
    BrowserAnimationsModule,
    BrowserModule,

    //  Material
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
