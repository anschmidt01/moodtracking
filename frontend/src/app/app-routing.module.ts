import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HistoryComponent } from './components/history/history.component';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: '', component: HistoryComponent },
  { path: 'add', component: AddEntryComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
