
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task, TaskStatus, TaskPriority } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  tasks = signal<Task[]>([]);
  filterStatus = signal<'all' | TaskStatus>('all');
  editingTaskId = signal<string | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  taskForm: Task = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: null
  };

  totalTasks = computed(() => this.tasks().length);

  pendingTasks = computed(
    () => this.tasks().filter(task => task.status === 'pending').length
  );

  completedTasks = computed(
    () => this.tasks().filter(task => task.status === 'completed').length
  );

  // Kept temporarily for compatibility with the existing dashboard template.
  inProgressTasks = computed(() => 0);

  filteredTasks = computed(() => {
    const status = this.filterStatus();

    if (status === 'all') {
      return this.tasks();
    }

    return this.tasks().filter(task => task.status === status);
  });

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.taskService.getTasks().subscribe({
      next: data => {
        this.tasks.set(data);
        this.isLoading.set(false);
      },
      error: error => {
        this.errorMessage.set(
          error.error?.message || 'Unable to load tasks. Please check the backend connection.'
        );
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (!this.taskForm.title.trim()) {
      this.errorMessage.set('Please enter a task title.');
      return;
    }

    this.errorMessage.set('');

    const payload: Partial<Task> = {
      title: this.taskForm.title.trim(),
      description: this.taskForm.description || null,
      status: this.taskForm.status,
      priority: this.taskForm.priority,
      due_date: this.taskForm.due_date
    };

    const editId = this.editingTaskId();

    if (editId) {
      this.taskService.updateTask(editId, payload).subscribe({
        next: updated => {
          this.tasks.update(list =>
            list.map(task => task.id === editId ? updated : task)
          );
          this.resetForm();
        },
        error: error => {
          this.errorMessage.set(
            error.error?.message || 'Unable to update task.'
          );
        }
      });
    } else {
      this.taskService.createTask(payload).subscribe({
        next: created => {
          this.tasks.update(list => [created, ...list]);
          this.resetForm();
        },
        error: error => {
          this.errorMessage.set(
            error.error?.message || 'Unable to create task.'
          );
        }
      });
    }
  }

  editTask(task: Task): void {
    this.editingTaskId.set(task.id ?? null);
    this.taskForm = { ...task };
    this.errorMessage.set('');
  }

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

  deleteTask(id?: string): void {
    if (!id) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update(list =>
          list.filter(task => task.id !== id)
        );

        if (this.editingTaskId() === id) {
          this.resetForm();
        }
      },
      error: error => {
        this.errorMessage.set(
          error.error?.message || 'Unable to delete task.'
        );
      }
    });
  }

  resetForm(): void {
    this.editingTaskId.set(null);

    this.taskForm = {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      due_date: null
    };

    this.errorMessage.set('');
  }
}
