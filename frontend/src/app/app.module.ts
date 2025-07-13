import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HistoryComponent } from './components/history/history.component';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { NgChartsModule } from 'ng2-charts';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';
import { EditEntryComponent } from './components/edit-entry/edit-entry.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CategoriesComponent } from './components/settings/categories/categories.component';
import { ExportComponent } from './components/settings/export/export.component';
import { ProfileComponent } from './components/settings/profile/profile.component';
import { EditCategoryComponent} from './components/settings/edit-category/edit-category.component';

@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent,
    AddEntryComponent,
    StatisticsComponent,
    SettingsComponent,
    WelcomeComponent,
    MainLayoutComponent,
    HistoryDetailComponent,
    EditEntryComponent,
    ConfirmDialogComponent,
    CategoriesComponent,
    ExportComponent,
    ProfileComponent,
    EditCategoryComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // <-- HIER HINZUFÜGEN

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
