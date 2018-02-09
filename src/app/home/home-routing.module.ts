import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Route, extract } from '@app/core';
import { HomeComponent } from './home.component';

const routes: Routes = Route.withShell([
  { path: '', redirectTo: '/play', pathMatch: 'full' },
  { path: 'play', component: HomeComponent, data: { title: extract('Play Game') } }
]);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule { }
