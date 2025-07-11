import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone : false, 
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(private router: Router) {}

  goTo(path: string) {
    this.router.navigate(['/settings', path]);
  }
}