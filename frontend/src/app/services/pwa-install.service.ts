// src/app/services/pwa-install.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  private deferredPrompt: any = null;

  canInstall = signal(false);
  isStandalone = signal(
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari
    (navigator as any).standalone === true
  );

  constructor() {
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('[PWA] beforeinstallprompt fired');
      event.preventDefault();
      this.deferredPrompt = event;
      this.canInstall.set(true);
    });

    window.addEventListener('appinstalled', () => {
      console.log('[PWA] appinstalled');
      this.canInstall.set(false);
      this.deferredPrompt = null;
      this.isStandalone.set(true);
    });
  }

  async install() {
    if (!this.deferredPrompt) {
      console.warn('[PWA] No deferred prompt available');
      return;
    }
    this.deferredPrompt.prompt();
    const result = await this.deferredPrompt.userChoice.catch(() => null);
    console.log('[PWA] userChoice:', result);
    this.deferredPrompt = null;
    this.canInstall.set(false);
  }
}
