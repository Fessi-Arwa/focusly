// audio.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext | null = null;
  private isUnlocked = false;
  
  constructor() {
    this.initializeAudio();
  }

  private initializeAudio(): void {
    // Crée le contexte audio mais ne l'active pas encore
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Déverrouille l'audio au premier clic utilisateur
    document.addEventListener('click', this.unlockAudio.bind(this), { once: true });
    document.addEventListener('touchstart', this.unlockAudio.bind(this), { once: true });
    document.addEventListener('keydown', this.unlockAudio.bind(this), { once: true });
  }

  private unlockAudio(): void {
    if (this.isUnlocked || !this.audioContext) return;
    
    // Crée un son court pour déverrouiller l'audio
    const buffer = this.audioContext.createBuffer(1, 1, 22050);
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(0);
    
    // Vérifie l'état après un court délai
    setTimeout(() => {
      if (this.audioContext && this.audioContext.state === 'running') {
        this.isUnlocked = true;
        console.log('Audio unlocked!');
      }
    }, 100);
  }

  playSound(soundId: string, volume: number = 0.5): void {
    if (!this.audioContext) {
      console.warn('Audio context not initialized');
      return;
    }

    // Si le contexte est suspendu, essayez de le reprendre
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        console.log('Audio context resumed');
        this.playSoundInternal(soundId, volume);
      }).catch(error => {
        console.error('Failed to resume audio context:', error);
      });
    } else {
      this.playSoundInternal(soundId, volume);
    }
  }

  private playSoundInternal(soundId: string, volume: number): void {
    if (!this.audioContext) return;

    try {
      let frequencies: number[] = [];
      let durations: number[] = [];
      
      switch(soundId) {
        case 'bell':
          frequencies = [440, 880, 1320];
          durations = [0.3, 0.2, 0.1];
          break;
        case 'chime':
          frequencies = [523.25, 659.25, 783.99];
          durations = [0.4, 0.3, 0.2];
          break;
        case 'bubble':
          frequencies = [200, 400, 600];
          durations = [0.2, 0.15, 0.1];
          break;
        default:
          frequencies = [440];
          durations = [0.3];
      }
      
      this.playFrequencies(frequencies, durations, volume);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  private playFrequencies(frequencies: number[], durations: number[], volume: number): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    
    frequencies.forEach((freq, index) => {
      try {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        // Enveloppe ADSR plus douce
        const duration = durations[index] || 0.3;
        const attackTime = 0.01;
        const decayTime = 0.1;
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + attackTime);
        gainNode.gain.exponentialRampToValueAtTime(volume * 0.3, now + attackTime + decayTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
        
        // Nettoyage
        oscillator.onended = () => {
          oscillator.disconnect();
          gainNode.disconnect();
        };
        
      } catch (error) {
        console.error('Error creating oscillator:', error);
      }
    });
  }

  // Méthode pour forcer l'activation de l'audio
  enableAudio(): Promise<void> {
    if (!this.audioContext) {
      return Promise.reject('Audio context not available');
    }
    
    return this.audioContext.resume().then(() => {
      this.isUnlocked = true;
      console.log('Audio enabled by user');
    });
  }
}