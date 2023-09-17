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

  showFromCode(statusCode: number, body: string) {
    const toastType = this.codeToToastType(statusCode);
    this.show(toastType, body, toastType);
  }

  showFromMessageType(messageType: string, body: string) {
    const toastType = messageType as ToastType;
    this.show(toastType, body, toastType);
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }

  codeToToastType(statusCode: number): ToastType {
    switch (statusCode) {
      case 200:
        return ToastType.Success;
      case 400:
        return ToastType.Warning;
      case 401:
        return ToastType.Warning;
      case 403:
        return ToastType.Warning;
      case 404:
        return ToastType.Warning;
      case 500:
        return ToastType.Error;
      default:
        return ToastType.Warning;
    }
  }
}
