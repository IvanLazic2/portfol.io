import { Injectable, TemplateRef } from '@angular/core';
import { ToastType } from 'src/app/types';

export interface ToastInfo {
  header: string,
  body: string,
  toastType: ToastType,
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: ToastInfo[] = [];

  show(header: string, body: string, toastType: ToastType) {
    this.toasts.push({ header, body, toastType });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}
