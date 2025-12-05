import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerComponent } from '../../components/timer/timer';
import { TodoComponent } from '../../components/todo/todo';

@Component({
  selector: 'app-focus',
  standalone: true,
  imports: [CommonModule, TimerComponent, TodoComponent],
  templateUrl: './focus.html',
  styleUrls: ['./focus.css']
})
export class FocusComponent {}
