import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Background } from '../../services/background';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings implements OnInit {
  // Paramètres du timer
  timerSettings = {
    focusDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartFocus: true,
    soundEnabled: true
  };

  // Sons disponibles
  sounds = [
    { id: 'bell', name: 'Clochette Douce', icon: '🔔' },
    { id: 'chime', name: 'Carillon', icon: '🎵' },
    { id: 'bubble', name: 'Bulles', icon: '💭' }
  ];

  selectedSound: string = 'bell';

  constructor(public bg: Background) {}

  ngOnInit(): void {
    this.bg.apply();
    this.loadSettings();
  }

  setBg(id: string): void { 
    this.bg.set(id); 
  }

  isActive(id: string): boolean {
    return this.bg.bg() === id;
  }

  saveSettings(): void {
    const settings = {
      timer: this.timerSettings,
      sound: this.selectedSound
    };
    localStorage.setItem('focusly-settings', JSON.stringify(settings));
  }

  loadSettings(): void {
    const saved = localStorage.getItem('focusly-settings');
    if (saved) {
      const settings = JSON.parse(saved);
      this.timerSettings = { ...this.timerSettings, ...settings.timer };
      this.selectedSound = settings.sound || 'bell';
    }
  }

  resetSettings(): void {
    if (confirm('Réinitialiser tous les paramètres ?')) {
      localStorage.removeItem('focusly-settings');
      this.timerSettings = {
        focusDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        autoStartBreaks: true,
        autoStartFocus: true,
        soundEnabled: true
      };
      this.selectedSound = 'bell';
      this.bg.set('default');
    }
  }

  getBackgrounds() {
    return this.bg.backgrounds;
  }

  getBackgroundColor(id: string): string {
    const bg = this.bg.backgrounds.find(b => b.id === id);
    return bg ? bg.color : 'linear-gradient(135deg, #FFB7C5, #FFDAC1)';
  }
}