import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: any[] = [];

  constructor() { }

  // Show toast
  show(textOrTpl: string | TemplateRef<any>, options: any = {}):void {
    this.toasts.push({ textOrTpl, ...options });
  }

  // Remove toast
  remove(toast: any):void {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  // Clear toast
  clear():void {
    this.toasts.splice(0, this.toasts.length);
  }
}
