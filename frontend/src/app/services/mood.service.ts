import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category.service';
// Für Einträge, die du ABRUFS (GET) bekommst
export interface MoodEntry {
  id: number;
  date: string;
  mood: Category;            // KEIN string mehr!
  activities: Category[];    // KEIN string[]
  notes: string;
}

// Für Einträge, die du SPEICHERST (POST/PUT)
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
  private apiUrl = 'http://localhost:3000/moods'; // dein Backend-Endpunkt

  constructor(private http: HttpClient) {}

  // Speichern
  saveMood(entry: CreateMoodDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, entry);
  }

  // Abrufen
  getMoods(): Observable<MoodEntry[]> {
    return this.http.get<MoodEntry[]>(this.apiUrl);
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
