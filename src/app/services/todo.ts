import { Injectable, signal, computed } from '@angular/core';

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

const STORAGE_KEY = 'focusly_todos';

@Injectable({
  providedIn: 'root'
})
export class Todo {
  todos = signal<TodoItem[]>(this.load());
  
  // Computed properties
  completedCount = computed(() => 
    this.todos().filter(t => t.done).length
  );
  
  totalCount = computed(() => 
    this.todos().length
  );

  private load(): TodoItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos()));
  }

  add(text: string): void {
    const item: TodoItem = { 
      id: Date.now().toString(), 
      text, 
      done: false 
    };
    this.todos.update(list => [item, ...list]);
    this.save();
  }

  toggle(id: string): void {
    this.todos.update(list => 
      list.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
    this.save();
  }

  remove(id: string): void {
    this.todos.update(list => list.filter(t => t.id !== id));
    this.save();
  }

  clearDone(): void {
    this.todos.update(list => list.filter(t => !t.done));
    this.save();
  }
}