import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ObjDetectionComponent } from './obj-detection/obj-detection.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartpoleComponent } from './cartpole/cartpole.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfigurationComponent } from './cartpole/configuration/configuration.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { CreateModelComponent } from './cartpole/create-model/create-model.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HelpButtonComponent } from './help/help-button/help-button.component';
import { HomeHelpComponent } from './home/home-help/home-help.component';
import { MnistComponent } from './mnist/mnist.component';
import { DrawDigitComponent } from './mnist/draw-digit/draw-digit.component';
import { ClassifyComponent } from './classify/classify.component';
import { MazeComponent } from './classify/maze/maze.component';
import { ChartsModule } from 'ng2-charts';
import { TutorialComponent } from './mnist/tutorial/tutorial.component';
import { VarDirective } from './cartpole/configuration/var.directive';
import { ClassifyHelpComponent } from './classify/classify-help/classify-help.component';
import { CartpoleHelpComponent } from './cartpole/cartpole-help/cartpole-help.component';
import { NotfoundComponent } from './help/notfound/notfound.component';
import { GanComponent } from './gan/gan.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ObjDetectionComponent,
    CartpoleComponent,
    ConfigurationComponent,
    NavbarComponent,
    HomeComponent,
    CreateModelComponent,
    HelpButtonComponent,
    HomeHelpComponent,
    MnistComponent,
    DrawDigitComponent,
    ClassifyComponent,
    MazeComponent,
    TutorialComponent,
    VarDirective,
    ClassifyHelpComponent,
    CartpoleHelpComponent,
    NotfoundComponent,
    GanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ChartsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
