import { Component } from '@angular/core';

@Component({
  selector: 'app-export',
  standalone: false,
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {
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
}