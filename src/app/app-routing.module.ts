import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartpoleComponent } from './cartpole/cartpole.component';
import { ObjDetectionComponent } from './obj-detection/obj-detection.component';
import { HomeComponent } from './home/home.component';
import { MnistComponent } from './mnist/mnist.component';
import { MnistAComponent } from './mnista/mnista.component';
import { MnistBComponent } from './mnistb/mnistb.component';
import { ClassifyComponent } from './classify/classify.component';
import { NotfoundComponent } from './help/notfound/notfound.component';
import { LandscapeComponent } from './gans/landscape/landscape.component';
import { GanTransferComponent } from './gans/gan-transfer/gan-transfer.component';
import { GanTrainingComponent } from './gans/gan-training/gan-training.component';
import { ImprintComponent } from './help/imprint/imprint.component';
import { TictactoeComponent } from './tictactoe/tictactoe.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cartpole', component: CartpoleComponent },
  { path: 'object', component: ObjDetectionComponent },
  { path: 'mnist', component: MnistComponent },
  { path: 'mnista', component: MnistAComponent },
  { path: 'mnistb', component: MnistBComponent },
  { path: 'classify', component: ClassifyComponent },
  { path: 'gan-landscpe', component: LandscapeComponent },
  { path: 'gan-transfer', component: GanTransferComponent },
  { path: 'gan-training', component: GanTrainingComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'tictactoe', component: TictactoeComponent },
  { path: '404', component: NotfoundComponent },
  // wildcard URL
  { path: '**', redirectTo: '/404' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
