import { Injectable, signal } from '@angular/core';

const KEY = 'focusly_bg';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  bg = signal<string>(localStorage.getItem(KEY) || 'default');

  set(bgName: string) {
    this.bg.set(bgName);
    localStorage.setItem(KEY, bgName);
    document.body.setAttribute('data-bg', bgName);
  }

  apply() {
    document.body.setAttribute('data-bg', this.bg());
  }

  get() { return this.bg(); }
}
