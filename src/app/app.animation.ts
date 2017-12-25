import {animate, state, style, transition, trigger} from '@angular/animations';

export const AppAnimation =
  [
    trigger('reveal-up', [
      transition('void => *', [
        animate('0.6s ease-in', style({
          transform: 'translateY(0) scale(1)',
          opacity: 1
        }))
      ]),
      state('void',
        style({
          transform: 'translateY(100vh) scale(0.7)',
          opacity: 0
        })
      )
    ]),
    trigger('reveal-up-2', [
      transition('void => *', [
        animate('0.6s ease-in', style({
          transform: 'translateY(0) scale(1)',
          opacity: 1
        }))
      ]),
      state('void',
        style({
          transform: 'translateY(200vh) scale(0.7)',
          opacity: 0
        })
      )
    ]),
    trigger('card-show', [
      transition('* => true', [
        animate('0.4s ease-in', style({
          transform: 'translateY(0) scale(1)',
          opacity: 1
        }))
      ]),
      transition('true => false', [
        animate('0.2s ease-out', style({
          transform: 'translateY(100vh) scale(0.3)',
          opacity: 0
        }))
      ]),
      state('false',
        style({
          transform: 'translateY(100vh)',
          opacity: 0
        })
      )
    ]),
    trigger('exif-card-reveal', [
      transition('* => true', [
        animate('0.15s 0.8s ease-in', style({
          transform: 'scale(1)',
          opacity: 1
        }))
      ]),
      transition('true => false', [
        animate('0.2s 0.2s ease-out', style({
          transform: 'scale(0.8)',
          opacity: 0
        }))
      ]),
      state('false',
        style({
          transform: 'scale(0.8)',
          opacity: 0
        })
      )
    ]),
    trigger('exif-show-btn', [
      transition('* => true', [
        animate('0.15s ease-in', style({
          transform: 'translateY(0vh) scale(1)'
        }))
      ]),
      transition('true => false', [
        animate('0.2s ease-out', style({
          transform: 'translateY(18vh) scale(1.38)'
        }))
      ]),
      state('false',
        style({
          transform: 'translateY(18vh) scale(1.38)'
        })
      )
    ])
  ];

