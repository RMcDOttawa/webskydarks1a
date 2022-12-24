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
import { HelpWorkflowComponent } from './help-page/help-sub-pages/help-workflow/help-workflow.component';
import { HelpStartEndComponent } from './help-page/help-sub-pages/help-start-end/help-start-end.component';
import { HelpTemperatureComponent } from './help-page/help-sub-pages/help-temperature/help-temperature.component';
import { HelpServerComponent } from './help-page/help-sub-pages/help-server/help-server.component';
import { HelpFramesPlanComponent } from './help-page/help-sub-pages/help-frames-plan/help-frames-plan.component';
import { HelpRunSessionComponent } from './help-page/help-sub-pages/help-run-session/help-run-session.component';
import { HelpDeveloperComponent } from './help-page/help-sub-pages/help-developer/help-developer.component';

//  Material
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTabsModule} from "@angular/material/tabs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";


@NgModule({
  declarations: [
    //  Angular
    AppComponent,
    AppToolbarComponent,
    //  App content
    FramesPlanComponent,
    HelpDeveloperComponent,
    HelpFramesPlanComponent,
    HelpPageComponent,
    HelpRunSessionComponent,
    HelpServerComponent,
    HelpStartEndComponent,
    HelpTemperatureComponent,
    HelpWorkflowComponent,
    MainPageComponent,
    RunSessionComponent,
    ServerSpecsComponent,
    StartEndSpecsComponent,
    TemperatureSpecsComponent,
  ],
  imports: [
    AppRoutingModule,

    //  Angular
    BrowserAnimationsModule,
    BrowserModule,

    //  Material
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
