import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import 'emoji-picker-element';

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
