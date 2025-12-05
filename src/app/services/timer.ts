import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  remaining = signal<number>(0);   // secondes
  running = signal<boolean>(false);

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private endSound = new Audio('/assets/sounds/done.mp3'); // optionnel

  start(seconds: number) {
    if (!seconds || seconds <= 0) return;
    this.stopInternal();
    this.remaining.set(seconds);
    this.running.set(true);

    this.intervalId = setInterval(() => {
      const newVal = this.remaining() - 1;
      this.remaining.set(newVal);
      if (newVal <= 0) this.finish();
    }, 1000);
  }

  pause() {
    if (!this.running()) return;
    this.stopInternal();
    this.running.set(false);
  }

  resume() {
    if (this.running() || this.remaining() <= 0) return;
    this.running.set(true);
    this.intervalId = setInterval(() => {
      const newVal = this.remaining() - 1;
      this.remaining.set(newVal);
      if (newVal <= 0) this.finish();
    }, 1000);
  }

  reset(seconds = 0) {
    this.stopInternal();
    this.remaining.set(seconds);
    this.running.set(false);
  }

  private finish() {
    this.stopInternal();
    this.remaining.set(0);
    // joue son si existe
    this.endSound.play().catch(() => {});
    // on peut émettre un événement ou Notification ici
  }

  private stopInternal() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.running.set(false);
  }
}
