import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Task {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getDueTasks() {
    return this.http.get<{
      success: boolean;
      total: number;
      overdueCount: number;
      dueTodayCount: number;
      data: { id: number; title: string }[];
    }>(`${this.apiUrl}/api/tasks/due`);
  }
}