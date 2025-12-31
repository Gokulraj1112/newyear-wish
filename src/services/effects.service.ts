import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EffectsService {
  private audioContext?: AudioContext;
  private backgroundMusic?: HTMLAudioElement;

  playBackgroundMusic(): void {
    if (this.backgroundMusic) return;
    
    this.backgroundMusic = new Audio('assets/music.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
    this.backgroundMusic.play().catch(() => {
      // Handle autoplay restrictions
    });
  }

  stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = undefined;
    }
  }

  createFireworks(container: HTMLElement): void {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createFirework(container);
      }, i * 200);
    }
  }

  private createFirework(container: HTMLElement): void {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = Math.random() * 100 + '%';
    firework.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(firework);

    setTimeout(() => {
      firework.remove();
    }, 3000);
  }

  createConfetti(container: HTMLElement): void {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#54a0ff'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      container.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }
}