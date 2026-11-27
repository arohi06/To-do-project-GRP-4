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
  total?: number;
  count?: number;
  data: T;
}

export interface DueTaskItem {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  is_overdue: boolean;
}

// Response of GET /api/tasks/due
export interface DueTasksResponse {
  success: boolean;
  total: number;
  overdueCount: number;
  dueTodayCount: number;
  data: DueTaskItem[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  // GET tasks from PostgreSQL through the backend
  getTasks(scope?: 'personal'): Observable<Task[]> {
    let params = new HttpParams();

    if (scope === 'personal') {
      params = params.set('scope', 'personal');
    }

    return this.http
      .get<ApiResponse<Task[]>>(this.apiUrl, { params })
      .pipe(map(response => response.data ?? []));
  }

  // GET the logged-in user's due and overdue tasks
  getDueTasks(): Observable<DueTasksResponse> {
    return this.http.get<DueTasksResponse>(`${this.apiUrl}/due`);
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
  deleteTask(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<null>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }
}