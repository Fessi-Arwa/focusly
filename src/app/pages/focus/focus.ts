import { Component, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Timer } from '../../services/timer';
import { Todo, TodoItem } from '../../services/todo';
import { Background } from '../../services/background';

@Component({
  selector: 'app-focus',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './focus.html',
  styleUrls: ['./focus.css']
})
export class Focus implements OnInit, OnDestroy {
  // États du timer
  minutes: number = 25;
  seconds: number = 0;
  isRunning: boolean = false;
  isPaused: boolean = false;
  
  // Modes
  currentMode: 'focus' | 'shortBreak' | 'longBreak' = 'focus';
  
  // Statistiques
  sessionsCompleted: number = 0;
  totalFocusTime: number = 0;
  
  // Todo
  newTodoText: string = '';
  
  // Durées rapides
  quickTimes = [
    { value: 15, label: '15 min', icon: '☕' },
    { value: 25, label: '25 min', icon: '🎯' },
    { value: 45, label: '45 min', icon: '📚' },
    { value: 60, label: '60 min', icon: '⏰' }
  ];
  
  // Citations motivantes
  motivationalQuotes = [
    "Chaque minute de concentration est une victoire ✨",
    "Ton futur toi te remerciera pour cet effort 🌟",
    "Petit à petit, l'oiseau fait son nid 🕊️",
    "La discipline est le pont entre les objectifs et leur réalisation 🌈",
    "Tu es plus forte que tu ne le penses 💪",
    "Le secret du succès est de commencer 🌸",
    "Un pas à la fois, tu y arriveras 🦋",
    "Crois en toi, tu es capable de grandes choses 💫"
  ];
  
  currentQuote: string = '';
  
  // Statistiques calculées
  completedCount = computed(() => 
    this.todo.todos().filter(t => t.done).length
  );
  
  totalCount = computed(() => 
    this.todo.todos().length
  );
  
  // Timer interval
  private timerInterval: any;

  constructor(
    public timer: Timer,
    public todo: Todo,
    public bg: Background
  ) {}

  ngOnInit(): void {
    this.bg.apply();
    this.loadSettings();
    this.updateMotivationalQuote();
    this.loadStatistics();
    
    // Changer la citation toutes les 30 secondes
    setInterval(() => {
      this.updateMotivationalQuote();
    }, 30000);
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  // Méthodes Timer
  startTimer(): void {
    if (this.minutes <= 0) return;
    
    this.isRunning = true;
    this.isPaused = false;
    
    const totalSeconds = this.minutes * 60 + this.seconds;
    let remainingSeconds = totalSeconds;
    
    this.clearTimer();
    
    this.timerInterval = setInterval(() => {
      remainingSeconds--;
      
      if (remainingSeconds <= 0) {
        this.completeSession();
        this.clearTimer();
      } else {
        this.minutes = Math.floor(remainingSeconds / 60);
        this.seconds = remainingSeconds % 60;
      }
    }, 1000);
  }

  pauseTimer(): void {
    this.isRunning = false;
    this.isPaused = true;
    this.clearTimer();
  }

  resumeTimer(): void {
    if (this.isPaused) {
      this.startTimer();
    }
  }

  resetTimer(): void {
    this.clearTimer();
    this.isRunning = false;
    this.isPaused = false;
    this.loadSettings();
  }

  quickSetTime(minutes: number): void {
    this.minutes = minutes;
    this.seconds = 0;
    if (this.isRunning) {
      this.resetTimer();
    }
  }

  switchMode(mode: 'focus' | 'shortBreak' | 'longBreak'): void {
    this.currentMode = mode;
    switch(mode) {
      case 'focus':
        this.minutes = 25;
        break;
      case 'shortBreak':
        this.minutes = 5;
        break;
      case 'longBreak':
        this.minutes = 15;
        break;
    }
    this.seconds = 0;
    this.resetTimer();
  }

  private completeSession(): void {
    this.isRunning = false;
    
    if (this.currentMode === 'focus') {
      this.sessionsCompleted++;
      this.totalFocusTime += this.minutes;
      this.saveStatistics();
      
      // Notification
      this.showNotification('Session terminée ! 🎉', 'Prenez une pause bien méritée.');
    }
    
    // Auto-switch mode
    if (this.currentMode === 'focus') {
      this.switchMode('shortBreak');
    } else {
      this.switchMode('focus');
    }
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // Méthodes Todo
  addTodo(): void {
    if (this.newTodoText.trim()) {
      this.todo.add(this.newTodoText);
      this.newTodoText = '';
    }
  }

  toggleTodo(id: string): void {
    this.todo.toggle(id);
  }

  removeTodo(id: string): void {
    this.todo.remove(id);
  }

  clearCompleted(): void {
    this.todo.clearDone();
  }

  // Format du temps
  formatTime(): string {
    const mins = this.minutes.toString().padStart(2, '0');
    const secs = this.seconds.toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  // Calcul du pourcentage de progression
  getProgressPercentage(): number {
    let totalSeconds = 0;
    switch(this.currentMode) {
      case 'focus': totalSeconds = 25 * 60; break;
      case 'shortBreak': totalSeconds = 5 * 60; break;
      case 'longBreak': totalSeconds = 15 * 60; break;
    }
    
    const currentSeconds = this.minutes * 60 + this.seconds;
    const elapsed = totalSeconds - currentSeconds;
    return (elapsed / totalSeconds) * 100;
  }

  // Citations
  private updateMotivationalQuote(): void {
    const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
    this.currentQuote = this.motivationalQuotes[randomIndex];
  }

  // Settings
  private loadSettings(): void {
    const saved = localStorage.getItem('focusly-settings');
    if (saved) {
      const settings = JSON.parse(saved);
      if (settings.timer) {
        this.minutes = settings.timer.focusDuration || 25;
      }
    }
  }

  // Statistiques
  private loadStatistics(): void {
    const saved = localStorage.getItem('focusly-statistics');
    if (saved) {
      const stats = JSON.parse(saved);
      this.sessionsCompleted = stats.sessionsCompleted || 0;
      this.totalFocusTime = stats.totalFocusTime || 0;
    }
  }

  private saveStatistics(): void {
    const stats = {
      sessionsCompleted: this.sessionsCompleted,
      totalFocusTime: this.totalFocusTime,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('focusly-statistics', JSON.stringify(stats));
  }

  // Notifications
  private showNotification(title: string, message: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: 'assets/favicon.ico' });
    }
  }

  // Mode getters
  getModeTitle(): string {
    switch(this.currentMode) {
      case 'focus': return 'Mode Concentration 🎯';
      case 'shortBreak': return 'Petite Pause ☕';
      case 'longBreak': return 'Longue Pause 🌴';
    }
  }

  getModeColor(): string {
    switch(this.currentMode) {
      case 'focus': return 'var(--primary)';
      case 'shortBreak': return 'var(--secondary)';
      case 'longBreak': return 'var(--accent-lavender)';
    }
  }

  getModeEmoji(): string {
    switch(this.currentMode) {
      case 'focus': return '🎯';
      case 'shortBreak': return '☕';
      case 'longBreak': return '🌴';
    }
  }
}