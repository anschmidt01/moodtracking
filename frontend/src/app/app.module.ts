//NgModule ist zentraler Dekorator in Angular - er definiert welche Bestandteile (Komponenten, Module, etc.) zum Modul gehören
//CUSTOM_ELEMENTS_SCHEMA erlaubt Nutzung eigener WebComponents wie EMoji Picker
//is DevMode prüft ob App sich im Entwicklungsmodus befindet. 
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core';
//notwendiges Grundmodul für Browseranwendungen, stellt grundlegende Angular-Funktionalitäten bereit
import { BrowserModule } from '@angular/platform-browser';
//ermöglicht HTTP-Anfragen, bspw. zur kommunikation mit Datenbank
import { HttpClientModule } from '@angular/common/http';
//aktiviert template-getriebene Formulare bspw. bei EIngabefeldern in Add-Entry oder Edit-Entry
import { FormsModule } from '@angular/forms';
//ermöglicht Animationen und ist erforderlich, um Angular Material Komponenten korrekt zu verwenden
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//importiert angular-material-komponenten: dialogfenster und Buttons
//Nutzung von Bestätigungsdialogen (ConfirmDialogComponent)
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

//AppComponent ist Wurzelkomponente, die bei Start der APp geladen wird
import { AppComponent } from './app.component';
//AppRouting enthält alle Routen der App bspw. /add-entry
import { AppRoutingModule } from './app-routing.module';
//NgCharts für die Diagramme in der Statistik und Verlauf 
import { NgChartsModule } from 'ng2-charts';
//Imports der gesamten Seitenstruktur - jede Komponente steht für einen Bereich der App
import { HistoryComponent } from './components/history/history.component';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';
import { EditEntryComponent } from './components/edit-entry/edit-entry.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CategoriesComponent } from './components/settings/categories/categories.component';
import { ExportComponent } from './components/settings/export/export.component';
import { ProfileComponent } from './components/settings/profile/profile.component';
import { EditCategoryComponent} from './components/settings/edit-category/edit-category.component';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
//ServiceWOrker wichtig für PWA-Offlinefähigkeit
import { ServiceWorkerModule } from '@angular/service-worker';

//deklariert alle Module, die in der App verwendet werden
//ohne Deklaration kann Angular die Komponenten nicht rendern
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
    InfoDialogComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
     //aktiviert den ServiceWorker nur im Produktionsmodus
      enabled: !isDevMode(),
      //registrierung sobald die App läuft oder nach 30 Sekunden
      //es wird sichergestellt, dass die App erst vollständig geladen ist, bevor Service
      //Worker aktiv wird --> stabiler offline support
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  //erlaubt Nutzung eigener Web Components, die Angular nicht kennt
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  

  //hier würden globale Services registriert werden, falls sie nicht per providedIn deklariert sind
  //hier leer, weil Services über Dependency Injection in den Komponenten genutzt werden
  providers: [],
  //Startkomponente, die beim App-Start geladen wird 
  bootstrap: [AppComponent]
})
//exportiert Modul, dass Angular es beim Bootstrapping erkennt
export class AppModule {}
