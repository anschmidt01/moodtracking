//lädt Angular-Funktion um eine Anwendung im Browser zu starten
import { platformBrowser } from '@angular/platform-browser';
//importiert zentrales Modul- gesamte App-Struktur wird dort definiert
//Komponenten, Services, ROuting, Signals, etc.
//Angular startet immer mit Root-Modul (AppModule)
import { AppModule } from './app/app.module';
//importiert externe Web-Komponente, die Emojis auswählbar macht
//es wird global registriert, damit es in HTML verwendet werden kann
//Bsp. emoji-picker in Add-Entry-Fomular
import 'emoji-picker-element';

//Instanz der Browser-Plattform wird erstellt, um Angular Komponenten im DOM auszuführen
//bootstrap startet AppModule

platformBrowser().bootstrapModule(AppModule, {
  //sorgt dafür, dass Angular interne EVents (wie Klicks)
  //bündelt bevor sie Change Detection auslösen
  ngZoneEventCoalescing: true,
})
  //fängt Fehler beim Starten der App ab 
  //gibt Fehler in Browserkonsole aus, statt stilles Abstürzen
  .catch(err => console.error(err));
