import { Injectable, signal, computed } from '@angular/core';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Injectable({
  providedIn: 'root'
})
export class CountdownService {
  private targetDate = new Date('2025-12-31T00:00:00').getTime();
  private currentTime = signal(Date.now());
  private intervalId?: number;

  timeLeft = computed(() => {
    const now = this.currentTime();
    const difference = this.targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  });

  isUnlocked = computed(() => {
    const time = this.timeLeft();
    return time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;
  });

  startCountdown(): void {
    if (this.intervalId) return;
    
    this.intervalId = window.setInterval(() => {
      this.currentTime.set(Date.now());
    }, 1000);
  }

  stopCountdown(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}