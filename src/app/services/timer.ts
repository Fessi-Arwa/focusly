import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Timer {
  // Signaux pour le state
  isRunning = signal(false);
  isPaused = signal(false);
  remainingSeconds = signal(0);
  currentMode = signal<'focus' | 'shortBreak' | 'longBreak'>('focus');
  
  // Statistiques
  sessionsCompleted = signal(0);
  totalFocusTime = signal(0);
  
  // Computed values
  formattedTime = computed(() => {
    const total = this.remainingSeconds();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });
  
  progressPercentage = computed(() => {
    const total = this.getModeDuration() * 60;
    const remaining = this.remainingSeconds();
    return ((total - remaining) / total) * 100;
  });
  
  private intervalId: any;

  // Start timer
  start(minutes: number): void {
    if (this.isRunning()) return;
    
    this.remainingSeconds.set(minutes * 60);
    this.isRunning.set(true);
    this.isPaused.set(false);
    
    this.intervalId = setInterval(() => {
      const current = this.remainingSeconds();
      if (current > 0) {
        this.remainingSeconds.set(current - 1);
      } else {
        this.completeSession();
      }
    }, 1000);
  }

  // Pause timer
  pause(): void {
    if (!this.isRunning()) return;
    
    this.isRunning.set(false);
    this.isPaused.set(true);
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Resume timer
  resume(): void {
    if (!this.isPaused() || this.remainingSeconds() <= 0) return;
    
    this.isRunning.set(true);
    this.isPaused.set(false);
    
    this.intervalId = setInterval(() => {
      const current = this.remainingSeconds();
      if (current > 0) {
        this.remainingSeconds.set(current - 1);
      } else {
        this.completeSession();
      }
    }, 1000);
  }

  // Reset timer
  reset(): void {
    this.isRunning.set(false);
    this.isPaused.set(false);
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.remainingSeconds.set(this.getModeDuration() * 60);
  }

  // Set custom time
  setCustomTime(minutes: number): void {
    this.remainingSeconds.set(minutes * 60);
  }

  // Switch mode
  switchMode(mode: 'focus' | 'shortBreak' | 'longBreak'): void {
    this.currentMode.set(mode);
    this.reset();
  }

  // Get mode duration
  private getModeDuration(): number {
    switch (this.currentMode()) {
      case 'focus': return 25;
      case 'shortBreak': return 5;
      case 'longBreak': return 15;
    }
  }

  // Complete session
  private completeSession(): void {
    this.reset();
    
    if (this.currentMode() === 'focus') {
      this.sessionsCompleted.update(v => v + 1);
      this.totalFocusTime.update(v => v + this.getModeDuration());
    }
    
    // Auto switch to next mode
    if (this.currentMode() === 'focus') {
      this.switchMode('shortBreak');
    } else {
      this.switchMode('focus');
    }
  }

  // Format time helper
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}