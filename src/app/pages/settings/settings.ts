import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Background } from '../../services/background';
import { AudioService } from '../../services/audio';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings implements OnInit {
  timerSettings = {
    focusDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartFocus: true,
    soundEnabled: true
  };

  sounds = [
    { id: 'bell', name: 'Clochette Douce', icon: '🔔' },
    { id: 'chime', name: 'Carillon', icon: '🎵' },
    { id: 'bubble', name: 'Bulles', icon: '💭' }
  ];

  selectedSound: string = 'bell';
  audioEnabled = false;

  constructor(
    public bg: Background,
    private audioService: AudioService
  ) {}

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

  testSound(soundId?: string): void {
    if (!this.timerSettings.soundEnabled) {
      this.showAlert('Activez d\'abord les sons dans les paramètres');
      return;
    }
    
    const soundToPlay = soundId || this.selectedSound;
    
    this.audioService.playSound(soundToPlay, 0.3);
    
    setTimeout(() => {
      if (!this.audioEnabled) {
        this.enableAudioFirst();
      }
    }, 100);
  }

  enableAudioFirst(): void {
    if (confirm('L\'audio est bloqué par le navigateur. Voulez-vous l\'activer maintenant ?')) {
      this.audioService.enableAudio().then(() => {
        this.audioEnabled = true;
        this.showAlert('Audio activé ! Vous pouvez maintenant tester les sons.');
      }).catch(error => {
        this.showAlert('Impossible d\'activer l\'audio. Vérifiez vos paramètres de navigateur.');
      });
    }
  }

  private showAlert(message: string): void {
    alert(message);
  }

  saveSettings(): void {
    const settings = {
      timer: this.timerSettings,
      sound: this.selectedSound
    };
    localStorage.setItem('focusly-settings', JSON.stringify(settings));
    
    if (this.timerSettings.soundEnabled) {
      this.audioService.playSound('bell', 0.2);
    }
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
      
      this.audioService.playSound('chime', 0.2);
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