import { animate, AnimationMetadata, state, style } from '@angular/animations';

export const fadeIn: AnimationMetadata[] = [
  style({ opacity: 0 }),
  // fade in speed, delay
  animate('0.5s 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955)', style({ opacity: 1 })),
];

export const fadeInDown: AnimationMetadata[] = [
  style({ opacity: 0, transform: 'translate3d(0, -20%, 0)' }),
  animate('500ms', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' })),
];

export const fadeInUp: AnimationMetadata[] = [
  style({ opacity: 0, transform: 'translate3d(0, 20%, 0)' }),
  animate('500ms', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' })),
];

export const fadeInLeft: AnimationMetadata[] = [
  style({ opacity: 0, transform: 'translate3d(-10%, 0, 0)' }),
  animate('500ms', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' })),
];

export const fadeInRight: AnimationMetadata[] = [
  style({ opacity: 0, transform: 'translate3d(10%, 0, 0)' }),
  animate('500ms', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' })),
];