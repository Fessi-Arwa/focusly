import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimerService } from '../../services/timer';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timer.html',
  styleUrls: ['./timer.css']
})
export class TimerComponent {
  minutes = Number(localStorage.getItem('focusly_last_minutes') || 25);

  constructor(public timer: TimerService) {}

  start() {
    const mins = Math.max(1, Math.floor(this.minutes));
    localStorage.setItem('focusly_last_minutes', String(mins));
    this.timer.start(mins * 60);
  }

  pause() { this.timer.pause(); }
  resume() { this.timer.resume(); }
  reset() { this.timer.reset(0); }

  formatTime(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.max(0, sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}
