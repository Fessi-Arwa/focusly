import { Routes } from '@angular/router';
import { FocusComponent } from './pages/focus/focus';
import { SettingsComponent } from './pages/settings/settings';

export const routes: Routes = [
  { path: '', component: FocusComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '' }
];
