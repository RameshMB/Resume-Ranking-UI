import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UploadComponent } from './upload/upload.component';
import { ShortlistComponent } from './shortlist/shortlist.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { MyCatalogsComponent } from './my-catalogs/my-catalogs.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'shortlist', component: ShortlistComponent },
  { path: 'my-catalogs', component: MyCatalogsComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
