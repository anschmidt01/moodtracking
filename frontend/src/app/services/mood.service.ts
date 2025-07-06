import { Injectable } from '@angular/core';

export interface MoodEntry {
  date: string;
  mood: string;
  activities: string[];
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private moods: MoodEntry[] = [];

  getMoods(): MoodEntry[] {
    return this.moods;
  }

  addMood(entry: MoodEntry) {
    this.moods.push(entry);
  }
}
