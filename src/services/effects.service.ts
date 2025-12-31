import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EffectsService {

  private backgroundMusic?: HTMLAudioElement;

  private specialMusicMap: { [key: string]: string } = {
    naveen:'assets/thambi.mp3',
    meena: 'assets/angel.mp3',
     varsha: 'assets/angel.mp3',
     angel:'assets/music.mp3'
  };

  enableAudioByUserGesture(userName?: string) {
    document.addEventListener('click', () => {
      this.playBackgroundMusic(userName);
    }, { once: true });
  }

  playBackgroundMusic(userName?: string) {
    if (this.backgroundMusic) return;

    let musicPath = 'assets/default.mp3';

    if (userName) {
      const key = userName.toLowerCase().trim();
      if (this.specialMusicMap[key]) {
        musicPath = this.specialMusicMap[key];
      }
    }

    this.backgroundMusic = new Audio(musicPath);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.4;

    this.backgroundMusic.play().catch(err => {
      console.log('Music blocked:', err);
    });
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic = undefined;
    }
  }

  createFireworks(container: HTMLElement) {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => this.createFirework(container), i * 200);
    }
  }

  private createFirework(container: HTMLElement) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = Math.random() * 100 + '%';
    firework.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(firework);

    setTimeout(() => firework.remove(), 3000);
  }

  createConfetti(container: HTMLElement) {
    const colors = ['#ff6b6b', '#4ecdc4', '#feca57', '#54a0ff', '#ff9ff3'];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      container.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
    }
  }
}
