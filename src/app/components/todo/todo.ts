import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../services/todo';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.html',
  styleUrls: ['./todo.css']
})
export class TodoComponent {
  newText = '';

  constructor(public todo: Todo) {}

  add() {
    const t = this.newText.trim();
    if (!t) return;
    this.todo.add(t);
    this.newText = '';
  }

  toggle(id: string) { this.todo.toggle(id); }
  remove(id: string) { this.todo.remove(id); }
  clearDone() { this.todo.clearDone(); }
}
