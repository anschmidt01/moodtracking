import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MoodEntry {
  id?: number; 
  date: string;
  mood: string;
  activities: string[];
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private apiUrl = 'http://localhost:3000/moods'; // dein Backend-Endpunkt

  constructor(private http: HttpClient) {}

  saveMood(entry: MoodEntry): Observable<MoodEntry> {
    return this.http.post<MoodEntry>(this.apiUrl, entry);
  }

  getMoods(): Observable<MoodEntry[]> {
    return this.http.get<MoodEntry[]>(this.apiUrl);
  }
  deleteMood(id: number) {
    return this.http.delete(`http://localhost:3000/moods/${id}`);
  }
  updateMood(id: number, entry: MoodEntry) {
    return this.http.put(`http://localhost:3000/moods/${id}`, entry);
  }
}
