import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-export',
  standalone: false,
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  exportData() {
    const data = {
      activities: ['Arbeit', 'Sport'],
      moods: ['Gut', 'Okay'],
      entries: [] // hier später deine Einträge hinzufügen
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}