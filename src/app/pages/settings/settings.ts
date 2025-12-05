import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundService } from '../../services/background';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent {
  backgrounds = [
    { id: 'default', label: 'Default' },
    { id: 'bg-forest', label: 'Forêt' },
    { id: 'bg-library', label: 'Bibliothèque' }
  ];

  constructor(public bg: BackgroundService) {
    this.bg.apply();
  }

  setBg(id: string) { this.bg.set(id); }
}
