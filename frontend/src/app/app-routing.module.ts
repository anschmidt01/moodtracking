// Importiert das Angular-Routing-System 
import { NgModule } from '@angular/core';
// 'Routes' beschreibt, welche URL-Pfade zu welchen Komponeten führen
// 'RouterModule' macht diesen Routen im gesamten Projekt verfügbar
import { RouterModule, Routes } from '@angular/router';

import { HistoryComponent } from './components/history/history.component';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';
import { EditEntryComponent } from './components/edit-entry/edit-entry.component';
import { CategoriesComponent } from './components/settings/categories/categories.component';
import { ExportComponent } from './components/settings/export/export.component';
import { ProfileComponent } from './components/settings/profile/profile.component';
import { EditCategoryComponent } from './components/settings/edit-category/edit-category.component';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';

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
  {
    path: 'settings/categories',
    component: CategoriesComponent,
  },  { path :'settings/export', component : ExportComponent},
  { path: 'settings/profile', component : ProfileComponent},
  { path: 'edit-category', component: EditCategoryComponent },
  { path: 'edit-category/:id', component: EditCategoryComponent },
  { path: 'info-dialog', component: InfoDialogComponent}
]
 },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
