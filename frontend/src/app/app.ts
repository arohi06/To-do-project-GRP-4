
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AdminService,
  AdminOverview,
  AdminUser,
  AdminTask
} from './services/admin.service';

import {
  TaskService,
  Task,
  TaskStatus,
  TaskPriority
} from './services/task.service';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
    host: {
    '[class.dark-theme]': 'isDarkMode()'
  }
})
export class App implements OnInit {

  // AUTHENTICATION
  loginEmail = '';
  loginPassword = '';

  authMode = signal<'login' | 'register'>('login');
  registerName = '';
  registerEmail = '';
  registerPassword = '';
  confirmPassword = '';

  isAuthenticating = signal(false);
  isCheckingSession = signal(true);
  authError = signal('');

  // APPLICATION NAVIGATION
  activeView = signal<'dashboard' | 'tasks' | 'admin'>('dashboard');

  // TASK DATA AND UI STATE
  tasks = signal<Task[]>([]);
  isDarkMode = signal<boolean>(false);
  filterStatus = signal<'all' | TaskStatus>('all');
  filterPriority = signal<'all' | TaskPriority>('all');
  searchQuery = signal('');

  isModalOpen = signal(false);
  editingTaskId = signal<string | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');

  // ADMIN DASHBOARD STATE
  adminOverview = signal<AdminOverview | null>(null);
  adminUsers = signal<AdminUser[]>([]);
  adminTasks = signal<AdminTask[]>([]);
  isAdminLoading = signal(false);
  adminError = signal('');

  // ADMIN USER-WISE TASK VIEW
  selectedAdminUserId = signal<string | null>(null);

  adminUserSummaries = computed(() =>
    this.adminUsers().map(user => {
      const userTasks = this.adminTasks().filter(
        task => task.user_id === user.id
      );

      return {
        ...user,
        totalTasks: userTasks.length,
        completedTasks: userTasks.filter(
          task => task.status === 'completed'
        ).length,
        pendingTasks: userTasks.filter(
          task => task.status === 'pending'
        ).length
      };
    })
  );

  selectedAdminUserTasks = computed(() => {
    const userId = this.selectedAdminUserId();

    if (!userId) return [];

    return this.adminTasks().filter(
      task => task.user_id === userId
    );
  });

  selectedAdminUser = computed(() =>
    this.adminUsers().find(
      user => user.id === this.selectedAdminUserId()
    ) ?? null
  );

  // TASK FORM
  taskForm: Task = this.createEmptyTask();

  // USER DASHBOARD STATISTICS
  totalTasks = computed(() => this.tasks().length);

  pendingTasks = computed(
    () => this.tasks().filter(task => task.status === 'pending').length
  );

  completedTasks = computed(
    () => this.tasks().filter(task => task.status === 'completed').length
  );

  highPriorityTasks = computed(
    () => this.tasks().filter(task => task.priority === 'high').length
  );

  completionRate = computed(() => {
    const total = this.totalTasks();

    return total === 0
      ? 0
      : Math.round((this.completedTasks() / total) * 100);
  });

  // SEARCH AND FILTER TASKS
  filteredTasks = computed(() => {
    const status = this.filterStatus();
    const priority = this.filterPriority();
    const query = this.searchQuery().trim().toLowerCase();

    return this.tasks().filter(task => {
      const matchesStatus =
        status === 'all' || task.status === status;

      const matchesPriority =
        priority === 'all' || task.priority === priority;

      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description || '').toLowerCase().includes(query);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  });

  // SERVICES
  constructor(
    public authService: AuthService,
    private taskService: TaskService,
    private adminService: AdminService
  ) { }

  // INITIALIZE APPLICATION
  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode.set(savedTheme === 'dark');

    if (!this.authService.getToken()) {
      this.isCheckingSession.set(false);
      return;
    }

    this.authService.getCurrentUser().subscribe({
      next: () => {
        this.isCheckingSession.set(false);
        this.loadTasks();
      },
      error: () => {
        this.authService.logout();
        this.isCheckingSession.set(false);
      }
    });
  }
  toggleTheme(): void {
    const nextMode = !this.isDarkMode();
    this.isDarkMode.set(nextMode);
    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
  }
  // LOGIN
  login(): void {
    if (!this.loginEmail.trim() || !this.loginPassword) {
      this.authError.set('Please enter your email and password.');
      return;
    }

    this.authError.set('');
    this.isAuthenticating.set(true);

    this.authService.login(
      this.loginEmail.trim(),
      this.loginPassword
    ).subscribe({
      next: () => {
        this.isAuthenticating.set(false);
        this.loginPassword = '';
        this.activeView.set('dashboard');
        this.loadTasks();
      },
      error: error => {
        this.isAuthenticating.set(false);
        this.authError.set(
          error.error?.message || 'Login failed. Please try again.'
        );
      }
    });
  }

  // SWITCH AUTHENTICATION MODE
  switchAuthMode(mode: 'login' | 'register'): void {
    this.authMode.set(mode);
    this.authError.set('');
  }

  // REGISTER
  register(): void {
    const name = this.registerName.trim();
    const email = this.registerEmail.trim();

    if (
      !name ||
      !email ||
      !this.registerPassword ||
      !this.confirmPassword
    ) {
      this.authError.set('Please complete all fields.');
      return;
    }

    if (this.registerPassword.length < 8) {
      this.authError.set('Password must be at least 8 characters.');
      return;
    }

    if (this.registerPassword !== this.confirmPassword) {
      this.authError.set('Passwords do not match.');
      return;
    }

    this.authError.set('');
    this.isAuthenticating.set(true);

    this.authService.register(
      name,
      email,
      this.registerPassword
    ).subscribe({
      next: () => {
        this.isAuthenticating.set(false);

        this.registerName = '';
        this.registerEmail = '';
        this.registerPassword = '';
        this.confirmPassword = '';

        this.activeView.set('dashboard');
        this.loadTasks();
      },
      error: error => {
        this.isAuthenticating.set(false);
        this.authError.set(
          error.error?.message || 'Registration failed. Please try again.'
        );
      }
    });
  }

  // LOGOUT
  logout(): void {
    this.authService.logout();

    this.tasks.set([]);
    this.activeView.set('dashboard');

    this.adminOverview.set(null);
    this.adminUsers.set([]);
    this.adminTasks.set([]);
    this.adminError.set('');
    this.selectedAdminUserId.set(null);

    this.errorMessage.set('');
    this.authError.set('');

    this.loginEmail = '';
    this.loginPassword = '';

    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.confirmPassword = '';

    this.authMode.set('login');
  }

  // CREATE EMPTY TASK
  private createEmptyTask(): Task {
    return {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      due_date: null,
      user_id: undefined
    };
  }

  // NAVIGATION
  switchView(view: 'dashboard' | 'tasks' | 'admin'): void {
    if (
      view === 'admin' &&
      this.authService.currentUser()?.role !== 'admin'
    ) {
      this.activeView.set('dashboard');
      return;
    }

    this.activeView.set(view);

    if (view === 'admin') {
      this.loadAdminDashboard();
    }
  }

  openTaskList(): void {
    this.activeView.set('tasks');
    this.filterStatus.set('all');
  }
  // VIEW A SPECIFIC USER'S TASKS
  viewUserTasks(userId: string): void {
    this.selectedAdminUserId.set(userId);
  }

  // RETURN TO ALL USERS
  clearSelectedUser(): void {
    this.selectedAdminUserId.set(null);
  }
  // LOAD USER TASKS

  // LOAD PERSONAL TASKS
  loadTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.taskService.getTasks('personal').subscribe({
      next: data => {
        this.tasks.set(data);
        this.isLoading.set(false);
      },
      error: error => {
        this.errorMessage.set(
          error.error?.message ||
          'Unable to load tasks. Please check the backend connection.'
        );
        this.isLoading.set(false);
      }
    });
  }

  // LOAD ADMIN DASHBOARD
  loadAdminDashboard(): void {
    if (this.authService.currentUser()?.role !== 'admin') {
      this.activeView.set('dashboard');
      return;
    }

    this.isAdminLoading.set(true);
    this.adminError.set('');

    let completedRequests = 0;

    const finishRequest = () => {
      completedRequests++;

      if (completedRequests === 3) {
        this.isAdminLoading.set(false);
      }
    };

    // Load statistics
    this.adminService.getOverview().subscribe({
      next: response => {
        this.adminOverview.set(response.data);
        finishRequest();
      },
      error: error => {
        this.adminError.set(
          error.error?.message || 'Unable to load admin statistics.'
        );
        finishRequest();
      }
    });

    // Load users
    this.adminService.getUsers().subscribe({
      next: response => {
        this.adminUsers.set(response.data);
        finishRequest();
      },
      error: error => {
        this.adminError.set(
          error.error?.message || 'Unable to load users.'
        );
        finishRequest();
      }
    });

    // Load all tasks
    this.adminService.getTasks().subscribe({
      next: response => {
        this.adminTasks.set(response.data);
        finishRequest();
      },
      error: error => {
        this.adminError.set(
          error.error?.message || 'Unable to load all tasks.'
        );
        finishRequest();
      }
    });
  }

  // ACTIVATE / DEACTIVATE USER
  toggleUserStatus(user: AdminUser): void {
    if (
      user.role === 'admin' ||
      user.id === this.authService.currentUser()?.id
    ) {
      return;
    }

    const newStatus = !user.is_active;

    this.adminError.set('');

    this.adminService.updateUserStatus(
      user.id,
      newStatus
    ).subscribe({
      next: response => {
        this.adminUsers.update(users =>
          users.map(item =>
            item.id === user.id ? response.data : item
          )
        );
      },
      error: error => {
        this.adminError.set(
          error.error?.message || 'Unable to update user status.'
        );
      }
    });
  }

  // OPEN CREATE TASK MODAL
  openCreateModal(): void {
    this.resetForm();

    if (this.authService.currentUser()?.role === 'admin') {
      this.adminService.getUsers().subscribe({
        next: response => {
          this.adminUsers.set(response.data);
        },
        error: error => {
          this.errorMessage.set(
            error.error?.message || 'Unable to load users for task assignment.'
          );
        }
      });
    }

    this.isModalOpen.set(true);
  }

  // CREATE OR UPDATE TASK
  onSubmit(): void {
    if (!this.taskForm.title.trim()) {
      this.errorMessage.set('Please enter a task title.');
      return;
    }

    this.errorMessage.set('');
    this.isSaving.set(true);

    const payload: Partial<Task> = {
      title: this.taskForm.title.trim(),
      description: this.taskForm.description?.trim() || null,
      status: this.taskForm.status,
      priority: this.taskForm.priority,
      due_date: this.taskForm.due_date
        ? `${this.taskForm.due_date.slice(0, 10)}T00:00:00.000Z`
        : null,
      ...(this.authService.currentUser()?.role === 'admin'
        ? { user_id: this.taskForm.user_id || this.authService.currentUser()?.id }
        : {})
    };

    const editId = this.editingTaskId();

    if (editId) {
      this.taskService.updateTask(editId, payload).subscribe({
        next: updated => {
          this.loadTasks();

          if (this.authService.currentUser()?.role === 'admin') {
            this.loadAdminDashboard();
          }

          this.isSaving.set(false);
          this.closeModal();
        },
        error: error => {
          this.isSaving.set(false);
          this.errorMessage.set(
            error.error?.message || 'Unable to update task.'
          );
        }
      });
    } else {
      this.taskService.createTask(payload).subscribe({
        next: created => {
          this.loadTasks();

          if (this.authService.currentUser()?.role === 'admin') {
            this.loadAdminDashboard();
          }

          this.isSaving.set(false);
          this.closeModal();
        },
        error: error => {
          this.isSaving.set(false);
          this.errorMessage.set(
            error.error?.message || 'Unable to create task.'
          );
        }
      });
    }
  }

  // EDIT TASK
  editTask(task: Task): void {
    this.editingTaskId.set(task.id ?? null);

    this.taskForm = {
      ...task,
      due_date: task.due_date
        ? task.due_date.slice(0, 10)
        : null
    };

    this.errorMessage.set('');
    this.isModalOpen.set(true);
  }

  // TOGGLE TASK STATUS
  toggleStatus(task: Task): void {
    if (!task.id) return;

    const updatedStatus: TaskStatus =
      task.status === 'pending' ? 'completed' : 'pending';

    this.taskService.updateTask(task.id, {
      status: updatedStatus
    }).subscribe({
      next: updated => {
        this.tasks.update(list =>
          list.map(item => item.id === task.id ? updated : item)
        );
      },
      error: error => {
        this.errorMessage.set(
          error.error?.message || 'Unable to update task status.'
        );
      }
    });
  }

  // DELETE TASK
  deleteTask(id?: string): void {
    if (!id) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();

        this.adminTasks.update(list =>
          list.filter(task => task.id !== id)
        );

        if (this.authService.currentUser()?.role === 'admin') {
          this.loadAdminDashboard();
        }

        if (this.editingTaskId() === id) {
          this.closeModal();
        }
      },
      error: error => {
        this.errorMessage.set(
          error.error?.message || 'Unable to delete task.'
        );
      }
    });
  }

  // CLOSE MODAL
  closeModal(): void {
    this.isModalOpen.set(false);
    this.resetForm();
  }

  // RESET TASK FORM
  resetForm(): void {
    this.editingTaskId.set(null);
    this.taskForm = this.createEmptyTask();
    this.errorMessage.set('');
  }
}
