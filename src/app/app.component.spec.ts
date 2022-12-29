import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {AppToolbarComponent} from "./app-toolbar/app-toolbar.component";
import {MockComponent, MockInstance} from 'ng-mocks';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        //  The following uses a mock to simulate the toolbar component
        MockComponent(AppToolbarComponent),
      ],
      //  Alternative to mock: the following tells the test to ignore the missing components
      // schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        AppComponent,
      ],
      providers: [
      ],
    }).compileComponents();
    //  Set up a spy on the mock toolbar

  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Web SkyDarks'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Web SkyDarks');
  });

  //  Includes the top toolbar in the rendered page
  it(`should render top toolbar`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const {debugElement} = fixture;
    const toolbar = debugElement.query(By.css('app-app-toolbar'));
    expect(toolbar).toBeTruthy();
  });

});
