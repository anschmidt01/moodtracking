import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from './category.service';

export interface MoodEntry {
  id: number;
  date: string;
  mood: Category;            
  activities: Category[];    
  notes: string;
}

export interface CreateMoodDto {
  mood_id: number;
  activity_ids: number[];
  notes: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private apiUrl = `${environment.apiBaseUrl}/moods`;

  constructor(private http: HttpClient) {}

  // Speichern
  saveMood(entry: CreateMoodDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, entry);
  }

  // Alle Mood-Einträge abrufen
  getMoods(): Observable<MoodEntry[]> {
    return this.http.get<MoodEntry[]>(this.apiUrl);
  }

  // Statistik abrufen
  getStatistics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/statistics`);
  }

  // Einträge (identisch zu getMoods)
  getEntries(): Observable<MoodEntry[]> {
    return this.getMoods();
  }

  // Löschen
  deleteMood(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Aktualisieren
  updateMood(id: number, entry: CreateMoodDto) {
    return this.http.put(`${this.apiUrl}/${id}`, entry);
  }
}
