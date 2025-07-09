import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HistoryComponent } from './components/history/history.component';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';
import { EditEntryComponent } from './components/edit-entry/edit-entry.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent}, 
  {
    path: '',
    component: MainLayoutComponent, 
    children: [
  { path: 'history', component: HistoryComponent },
  { path: 'add-entry', component: AddEntryComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'history/:id', component: HistoryDetailComponent},
  { path: 'edit/:id', component: EditEntryComponent},
  { path: 'detail/:id', component: HistoryDetailComponent },

]
 },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
