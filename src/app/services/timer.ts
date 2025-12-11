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
  
  // Durées configurables
  focusDuration = signal(25);
  shortBreakDuration = signal(5);
  longBreakDuration = signal(15);
  
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

  constructor() {
    this.loadSettings();
    // Écouter les changements de paramètres
    window.addEventListener('storage', (event) => {
      if (event.key === 'focusly-settings') {
        this.loadSettings();
        this.reset(); // Réinitialiser le timer avec les nouvelles durées
      }
    });
  }

  // Charger les paramètres depuis localStorage
  private loadSettings(): void {
    const saved = localStorage.getItem('focusly-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.timer) {
          this.focusDuration.set(settings.timer.focusDuration || 25);
          this.shortBreakDuration.set(settings.timer.shortBreak || 5);
          this.longBreakDuration.set(settings.timer.longBreak || 15);
        }
      } catch (error) {
        console.error('Erreur de chargement des paramètres:', error);
        this.resetToDefaults();
      }
    } else {
      this.resetToDefaults();
    }
  }

  // Réinitialiser aux valeurs par défaut
  private resetToDefaults(): void {
    this.focusDuration.set(25);
    this.shortBreakDuration.set(5);
    this.longBreakDuration.set(15);
  }

  // Obtenir la durée du mode actuel
  private getModeDuration(): number {
    switch (this.currentMode()) {
      case 'focus': return this.focusDuration();
      case 'shortBreak': return this.shortBreakDuration();
      case 'longBreak': return this.longBreakDuration();
    }
  }

  // Start timer (démarre avec la durée du mode actuel)
  start(): void {
    if (this.isRunning()) return;
    
    // Utiliser la durée configurée pour le mode actuel
    const duration = this.getModeDuration();
    this.remainingSeconds.set(duration * 60);
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

  // Start timer avec une durée personnalisée
  startWithDuration(minutes: number): void {
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

  // Reset timer (remet à la durée configurée du mode actuel)
  reset(): void {
    this.isRunning.set(false);
    this.isPaused.set(false);
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    // Réinitialiser avec la durée configurée du mode actuel
    const duration = this.getModeDuration();
    this.remainingSeconds.set(duration * 60);
  }

  // Set custom time (pour les durées rapides)
  setCustomTime(minutes: number): void {
    this.remainingSeconds.set(minutes * 60);
  }

  // Switch mode
  switchMode(mode: 'focus' | 'shortBreak' | 'longBreak'): void {
    this.currentMode.set(mode);
    this.reset(); // Reset avec la nouvelle durée configurée
  }

  // Complete session
  private completeSession(): void {
    this.reset();
    
    if (this.currentMode() === 'focus') {
      this.sessionsCompleted.update(v => v + 1);
      const focusMinutes = this.focusDuration();
      this.totalFocusTime.update(v => v + focusMinutes);
    }
    
    // Auto switch to next mode (selon les paramètres)
    if (this.currentMode() === 'focus') {
      this.switchMode('shortBreak');
    } else {
      this.switchMode('focus');
    }
  }

  // Format time helper (statique)
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Getters pour les durées (utiles pour l'affichage)
  getCurrentDuration(): number {
    return this.getModeDuration();
  }

  getFocusDuration(): number {
    return this.focusDuration();
  }

  getShortBreakDuration(): number {
    return this.shortBreakDuration();
  }

  getLongBreakDuration(): number {
    return this.longBreakDuration();
  }

  // Rafraîchir les paramètres (peut être appelé depuis settings)
  refreshSettings(): void {
    this.loadSettings();
    this.reset();
  }

  // Nettoyage
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    window.removeEventListener('storage', () => {});
  }
}