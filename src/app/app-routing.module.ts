import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {HelpPageComponent} from "./help-page/help-page.component";
import {HelpWorkflowComponent} from "./help-page/help-sub-pages/help-workflow/help-workflow.component";
import {HelpServerComponent} from "./help-page/help-sub-pages/help-server/help-server.component";
import {HelpFramesPlanComponent} from "./help-page/help-sub-pages/help-frames-plan/help-frames-plan.component";
import {HelpRunSessionComponent} from "./help-page/help-sub-pages/help-run-session/help-run-session.component";
import {HelpStartEndComponent} from "./help-page/help-sub-pages/help-start-end/help-start-end.component";
import {HelpTemperatureComponent} from "./help-page/help-sub-pages/help-temperature/help-temperature.component";
import {HelpDeveloperComponent} from "./help-page/help-sub-pages/help-developer/help-developer.component";

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent
  },
  {
    path: 'help',
    component: HelpPageComponent
  },
  {
    path: 'help/workflow',
    component: HelpWorkflowComponent
  },
  {
    path: 'help/server',
    component: HelpServerComponent
  },
  {
    path: 'help/framesplan',
    component: HelpFramesPlanComponent
  },
  {
    path: 'help/runsession',
    component: HelpRunSessionComponent
  },
  {
    path: 'help/startend',
    component: HelpStartEndComponent
  },
  {
    path: 'help/temperature',
    component: HelpTemperatureComponent
  },
  {
    path: 'help/developer',
    component: HelpDeveloperComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
