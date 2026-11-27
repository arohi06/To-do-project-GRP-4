
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AdminOverview {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at?: string;
}

export interface AdminTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at?: string;
  user_name?: string;
  user_email?: string;
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
export class AdminService {
  private readonly apiUrl = 'http://localhost:5000/api/admin';

  constructor(private http: HttpClient) {}

  getOverview(): Observable<ApiResponse<AdminOverview>> {
    return this.http.get<ApiResponse<AdminOverview>>(
      `${this.apiUrl}/overview`
    );
  }

  getUsers(): Observable<ApiResponse<AdminUser[]>> {
    return this.http.get<ApiResponse<AdminUser[]>>(
      `${this.apiUrl}/users`
    );
  }

  getTasks(): Observable<ApiResponse<AdminTask[]>> {
    return this.http.get<ApiResponse<AdminTask[]>>(
      `${this.apiUrl}/tasks`
    );
  }

  updateUserStatus(
    id: string,
    is_active: boolean
  ): Observable<ApiResponse<AdminUser>> {
    return this.http.patch<ApiResponse<AdminUser>>(
      `${this.apiUrl}/users/${id}/status`,
      { is_active }
    );
  }
}
