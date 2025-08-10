import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PwaInstallService } from '../../services/pwa-install.service';

@Component({
  selector: 'app-settings',
  standalone : false, 
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private router = inject(Router);
  private pwaService = inject(PwaInstallService);
  pwa = inject(PwaInstallService);

  canInstall = this.pwaService.canInstall;
  isSafari = signal(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));

  ngOnInit() {}

  installPwa() {
    this.pwaService.install();
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}