import { Injectable, signal } from '@angular/core';

const KEY = 'focusly_bg';

@Injectable({
  providedIn: 'root'
})
export class Background {
  bg = signal<string>(localStorage.getItem(KEY) || 'default');
  
  // Liste des arrière-plans disponibles
  backgrounds = [
    { 
      id: 'default', 
      label: 'Douceur Pastel', 
      icon: '🌸',
      color: 'linear-gradient(135deg, #FFB7C5, #FFDAC1)'
    },
    { 
      id: 'bg-forest', 
      label: 'Forêt Enchantée', 
      icon: '🌿',
      color: 'linear-gradient(135deg, #B5EAD7, #C7F9CC)'
    },
    { 
      id: 'bg-library', 
      label: 'Bibliothèque Rose', 
      icon: '📚',
      color: 'linear-gradient(135deg, #FFD1DC, #E2D1F9)'
    },
    { 
      id: 'bg-ocean', 
      label: 'Océan Lavande', 
      icon: '🌊',
      color: 'linear-gradient(135deg, #C7CEEA, #A7C5E8)'
    },
    { 
      id: 'bg-sunset', 
      label: 'Coucher Pastel', 
      icon: '🌅',
      color: 'linear-gradient(135deg, #FFDAC1, #FFB7C5)'
    },
    { 
      id: 'bg-garden', 
      label: 'Jardin Fleuri', 
      icon: '🌷',
      color: 'linear-gradient(135deg, #FFD1DC, #B5EAD7)'
    },
  
  {
    id: 'gradient4',
    label: 'Lavande',
    color: 'linear-gradient(135deg, #E2D1F9, #D8BFD8)',
    icon: '💜'
  },
  {
    id: 'gradient5',
    label: 'Pêche Crémeuse',
    color: 'linear-gradient(135deg, #FFD8B1, #FFB7B2)',
    icon: '🍑'
  },
  {
    id: 'gradient6',
    label: 'Bleu Azur',
    color: 'linear-gradient(135deg, #A7C7E7, #B5EAD7)',
    icon: '💎'
  }
  ];

  set(bgName: string): void {
    this.bg.set(bgName);
    localStorage.setItem(KEY, bgName);
    this.apply();
  }

  apply(): void {
    const currentBg = this.bg();
    const bgConfig = this.backgrounds.find(b => b.id === currentBg) || this.backgrounds[0];
    
    // Appliquer le fond
    document.body.style.background = bgConfig.color;
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'cover';
    
    // Ajouter un overlay pour la lisibilité
    if (!document.getElementById('bg-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'bg-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        z-index: -1;
        pointer-events: none;
      `;
      document.body.appendChild(overlay);
    }
  }

  get current() {
    return this.bg();
  }
}