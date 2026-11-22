
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id?: string;
  user_id?: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at?: string;
  updated_at?: string;
  user_name?: string | null;
  user_email?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  // GET tasks from PostgreSQL through the backend
  getTasks(): Observable<Task[]> {
    return this.http
      .get<ApiResponse<Task[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  // CREATE a task
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http
      .post<ApiResponse<Task>>(this.apiUrl, task)
      .pipe(map(response => response.data));
  }

  // UPDATE a task
  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http
      .put<ApiResponse<Task>>(`${this.apiUrl}/${id}`, task)
      .pipe(map(response => response.data));
  }

  // DELETE a task
  deleteTask(id: string): Observable<Task> {
    return this.http
      .delete<ApiResponse<Task>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }
}
