import { Injectable, signal } from '@angular/core';

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

const STORAGE_KEY = 'focusly_todos';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  todos = signal<TodoItem[]>(this.load());

  private load(): TodoItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos()));
  }

  add(text: string) {
    const item: TodoItem = { id: Date.now().toString(), text, done: false };
    this.todos.update(list => [item, ...list]);
    this.save();
  }

  toggle(id: string) {
    this.todos.update(list => list.map(t => t.id === id ? { ...t, done: !t.done } : t));
    this.save();
  }

  remove(id: string) {
    this.todos.update(list => list.filter(t => t.id !== id));
    this.save();
  }

  clearDone() {
    this.todos.update(list => list.filter(t => !t.done));
    this.save();
  }
}
