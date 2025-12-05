import { Routes } from '@angular/router';
import { Focus } from './pages/focus/focus';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
  { 
    path: '', 
    component: Focus,
    title: 'Focusly - Votre espace de concentration'
  },
  { 
    path: 'settings', 
    component: Settings,
    title: 'Focusly - Paramètres'
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];