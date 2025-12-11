// services/timer.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Timer {
  private startTime: number = 0;
  private duration: number = 0;
  private pausedTime: number = 0;
  private isRunningFlag: boolean = false;

  // Ajoutez ces méthodes publiques
  remaining(): number {
    if (!this.isRunningFlag) {
      return Math.max(0, this.duration);
    }
    const elapsed = (Date.now() - this.startTime) / 1000;
    return Math.max(0, this.duration - elapsed);
  }

  running(): boolean {
    return this.isRunningFlag;
  }

  start(durationInSeconds: number) {
    this.duration = durationInSeconds;
    this.startTime = Date.now();
    this.isRunningFlag = true;
    this.pausedTime = 0;
  }

  pause() {
    if (this.isRunningFlag) {
      this.pausedTime = this.remaining();
      this.isRunningFlag = false;
    }
  }

  resume() {
    if (!this.isRunningFlag && this.pausedTime > 0) {
      this.duration = this.pausedTime;
      this.startTime = Date.now();
      this.isRunningFlag = true;
    }
  }

  reset() {
    this.isRunningFlag = false;
    this.duration = 0;
    this.pausedTime = 0;
    this.startTime = 0;
  }
}
// Dans votre timer.component.ts
import { AudioService } from '../../services/audio';

export class TimerComponent {
  constructor(private audioService: AudioService) {}

  // Quand le timer se termine
  onTimerComplete() {
    // Charge les paramètres
    const settings = JSON.parse(localStorage.getItem('focusly-settings') || '{}');
    
    if (settings.timer?.soundEnabled) {
      this.audioService.playSound(settings.sound || 'bell', 0.5);
    }
  }
}