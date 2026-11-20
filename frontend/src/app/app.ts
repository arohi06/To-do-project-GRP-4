import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  tasks = signal<Task[]>([]);
  filterStatus = signal<string>('All');
  editingTaskId = signal<number | null>(null);
  isLoading = signal<boolean>(false);

  // Form model matching database fields
  taskForm: Task = {
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    due_date: ''
  };

  // Dashboard summary counts
  totalTasks = computed(() => this.tasks().length);
  pendingTasks = computed(() => this.tasks().filter(t => t.status === 'Pending').length);
  inProgressTasks = computed(() => this.tasks().filter(t => t.status === 'In Progress').length);
  completedTasks = computed(() => this.tasks().filter(t => t.status === 'Completed').length);

  // Filtered task list
  filteredTasks = computed(() => {
    const status = this.filterStatus();
    if (status === 'All') return this.tasks();
    return this.tasks().filter(t => t.status === status);
  });

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getTasks().subscribe(data => {
      if (data && data.length > 0) {
        this.tasks.set(data);
      } else {
        // Starter sample data so UI works offline until backend connects
        this.tasks.set([
          {
            id: 1,
            title: 'Design Dashboard & Task UI',
            description: 'Build responsive Angular components for task management.',
            status: 'Completed',
            priority: 'High',
            due_date: '2026-11-20'
          },
          {
            id: 2,
            title: 'Connect Frontend with Backend API',
            description: 'Verify GET, POST, PUT, and DELETE endpoints on localhost.',
            status: 'In Progress',
            priority: 'High',
            due_date: '2026-11-21'
          },
          {
            id: 3,
            title: 'Test Edge Cases & Submit PR',
            description: 'Check empty form validation and push feature/frontend branch.',
            status: 'Pending',
            priority: 'Medium',
            due_date: '2026-11-21'
          }
        ]);
      }
      this.isLoading.set(false);
    });
  }

  onSubmit(): void {
    if (!this.taskForm.title.trim()) return;

    const editId = this.editingTaskId();
    if (editId !== null) {
      const updated: Task = { ...this.taskForm, id: editId };
      this.taskService.updateTask(editId, updated).subscribe(() => {
        this.tasks.update(list => list.map(t => (t.id === editId ? updated : t)));
        this.resetForm();
      });
    } else {
      const newTask: Task = { ...this.taskForm };
      this.taskService.createTask(newTask).subscribe(created => {
        const savedTask = { ...newTask, id: created?.id || Date.now() };
        this.tasks.update(list => [savedTask, ...list]);
        this.resetForm();
      });
    }
  }

  editTask(task: Task): void {
    this.editingTaskId.set(task.id ?? null);
    this.taskForm = { ...task };
  }

  toggleStatus(task: Task): void {
    const nextStatus: Task['status'] =
      task.status === 'Pending'
        ? 'In Progress'
        : task.status === 'In Progress'
        ? 'Completed'
        : 'Pending';

    const updated: Task = { ...task, status: nextStatus };
    if (task.id !== undefined) {
      this.taskService.updateTask(task.id, updated).subscribe(() => {
        this.tasks.update(list => list.map(t => (t.id === task.id ? updated : t)));
      });
    }
  }

  deleteTask(id?: number): void {
    if (id === undefined) return;
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks.update(list => list.filter(t => t.id !== id));
      if (this.editingTaskId() === id) this.resetForm();
    });
  }

  resetForm(): void {
    this.editingTaskId.set(null);
    this.taskForm = {
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      due_date: ''
    };
  }
}