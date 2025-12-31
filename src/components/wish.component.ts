import { Component, OnInit, inject, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EffectsService } from '../services/effects.service';

interface WishData {
  special: { [key: string]: { message: string; image: string } };
  random: string[];
  gifts: string[];
}

@Component({
  selector: 'app-wish',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wish-container" #effectsContainer>
      @if (!nameEntered()) {
        <div class="name-entry-section">
          <div class="card wish-card">
            <div class="card-body text-center">
              <h3 class="mb-4">✨ Enter Your Name ✨</h3>
              <div class="mb-3">
                <input 
                  type="text" 
                  class="form-control custom-input" 
                  [(ngModel)]="userName" 
                  placeholder="Your beautiful name..."
                  maxlength="50"
                  (keyup.enter)="enterName()">
              </div>
              <button class="btn custom-btn" (click)="enterName()" [disabled]="!userName.trim()">
                🎁 Get My Wish
              </button>
            </div>
          </div>
        </div>
      } @else if (!wishRevealed()) {
        <div class="scratch-section">
          <div class="card wish-card">
            <div class="card-body text-center">
              <h4 class="mb-3">🎭 Scratch to reveal your wish!</h4>
              <div class="scratch-card-container">
                <canvas 
                  #scratchCanvas 
                  class="scratch-canvas"
                  (mousedown)="startScratching($event)"
                  (mousemove)="scratch($event)"
                  (mouseup)="stopScratching()"
                  (touchstart)="startScratching($event)"
                  (touchmove)="scratch($event)"
                  (touchend)="stopScratching()">
                </canvas>
                <div class="scratch-content">
                  @if (currentWish()) {
                    <div class="wish-content">
                      <img [src]="'assets/' + currentWish()!.image" [alt]="userName" class="wish-image mb-3">
                      <p class="wish-message">{{ currentWish()!.message }}</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else if (!giftOpened()) {
        <div class="gift-section">
          <div class="card wish-card">
            <div class="card-body text-center">
              <h4 class="mb-4">🎁 You have a special gift!</h4>
              <div class="gift-box mb-4" (click)="openGift()">
                <img src="assets/gift.png" alt="Gift Box" class="gift-image">
                <div class="gift-glow"></div>
              </div>
              <p class="gift-instruction">Click the gift box to open it!</p>
            </div>
          </div>
        </div>
      } @else {
        <div class="final-section">
          <div class="card wish-card">
            <div class="card-body text-center">
              <h4 class="mb-3">🎊 Your Special Gift!</h4>
              @if (currentWish()) {
                <div class="wish-content mb-4">
                  <img [src]="'assets/' + currentWish()!.image" [alt]="userName" class="wish-image mb-3">
                  <p class="wish-message mb-3">{{ currentWish()!.message }}</p>
                  <div class="gift-message">
                    <h5>🎁 Special Gift for {{ userName }}:</h5>
                    <p class="gift-text">{{ currentGift() }}</p>
                  </div>
                </div>
              }
              
              <div class="action-buttons">
                <button class="btn custom-btn me-2 mb-2" (click)="downloadCard()">
                  📱 Download Card
                </button>
                <button class="btn custom-btn-secondary mb-2" (click)="shareWhatsApp()">
                  📱 Share on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      
      <!-- Hidden canvas for card generation -->
      <canvas #cardCanvas style="display: none;"></canvas>
    </div>
  `,
  styles: [`
    .wish-container {
      padding: 2rem 1rem;
      min-height: 60vh;
    }

    .wish-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      border: 2px solid rgba(255, 215, 0, 0.3);
      border-radius: 20px;
      backdrop-filter: blur(15px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      color: white;
      max-width: 600px;
      margin: 0 auto;
    }

    .custom-input {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 215, 0, 0.5);
      border-radius: 10px;
      color: white;
      padding: 12px 20px;
      font-size: 1.1rem;
    }

    .custom-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .custom-input:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: #FFD700;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
      color: white;
    }

    .custom-btn {
      background: linear-gradient(45deg, #FFD700, #FFA500);
      border: none;
      border-radius: 10px;
      color: #000;
      font-weight: bold;
      padding: 12px 30px;
      font-size: 1.1rem;
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
      transition: all 0.3s ease;
    }

    .custom-btn:hover:not(:disabled) {
      background: linear-gradient(45deg, #FFA500, #FFD700);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
    }

    .custom-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .custom-btn-secondary {
      background: linear-gradient(45deg, #4ecdc4, #45b7d1);
      border: none;
      border-radius: 10px;
      color: white;
      font-weight: bold;
      padding: 12px 30px;
      font-size: 1.1rem;
      box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
      transition: all 0.3s ease;
    }

    .custom-btn-secondary:hover {
      background: linear-gradient(45deg, #45b7d1, #4ecdc4);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
    }

    .scratch-card-container {
      position: relative;
      display: inline-block;
      border-radius: 15px;
      overflow: hidden;
    }

    .scratch-canvas {
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
      z-index: 2;
    }

    .scratch-content {
      position: relative;
      z-index: 1;
    }

    .wish-content {
      padding: 2rem;
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
      border-radius: 15px;
    }

    .wish-image {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 50%;
      border: 3px solid #FFD700;
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    }

    .wish-message {
      font-size: 1.2rem;
      line-height: 1.6;
      color: #FFD700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .gift-box {
      cursor: pointer;
      position: relative;
      display: inline-block;
      transition: transform 0.3s ease;
    }

    .gift-box:hover {
      transform: scale(1.1);
    }

    .gift-image {
      width: 120px;
      height: 120px;
      filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6));
    }

    .gift-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .gift-message {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
      border-radius: 15px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 215, 0, 0.3);
    }

    .gift-text {
      font-size: 1.3rem;
      color: #FFD700;
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .gift-instruction {
      color: rgba(255, 255, 255, 0.8);
      font-style: italic;
    }

    .action-buttons {
      margin-top: 2rem;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }

    @media (max-width: 768px) {
      .wish-container {
        padding: 1rem 0.5rem;
      }
      
      .wish-card {
        margin: 0 0.5rem;
      }
      
      .wish-card .card-body {
        padding: 1.5rem 1rem;
      }
      
      .custom-input {
        font-size: 1rem;
        padding: 10px 15px;
      }
      
      .custom-btn, .custom-btn-secondary {
        font-size: 1rem;
        padding: 10px 20px;
        margin: 0.25rem;
        width: 100%;
        max-width: 280px;
      }
      
      .scratch-card-container {
        max-width: 100%;
        margin: 0 auto;
      }
      
      .wish-image {
        width: 120px;
        height: 120px;
      }
      
      .wish-message {
        font-size: 1.1rem;
        padding: 1rem;
      }
      
      .gift-image {
        width: 100px;
        height: 100px;
      }
      
      .gift-text {
        font-size: 1.1rem;
      }
      
      .action-buttons {
        margin-top: 1.5rem;
      }
      
      .action-buttons .btn {
        margin-bottom: 0.5rem;
      }
    }
    
    @media (max-width: 480px) {
      .wish-container {
        padding: 0.5rem 0.25rem;
      }
      
      .wish-card {
        margin: 0 0.25rem;
      }
      
      .wish-card .card-body {
        padding: 1rem 0.75rem;
      }
      
      .wish-image {
        width: 100px;
        height: 100px;
      }
      
      .wish-message {
        font-size: 1rem;
      }
      
      .gift-image {
        width: 80px;
        height: 80px;
      }
      
      .gift-text {
        font-size: 1rem;
      }
      
      .custom-btn, .custom-btn-secondary {
        font-size: 0.9rem;
        padding: 8px 16px;
      }
    }
  `]
})
export class WishComponent implements OnInit {
  @ViewChild('scratchCanvas') scratchCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cardCanvas') cardCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('effectsContainer') effectsContainer!: ElementRef<HTMLElement>;

  private http = inject(HttpClient);
  private effectsService = inject(EffectsService);

  userName = '';
  nameEntered = signal(false);
  wishRevealed = signal(false);
  giftOpened = signal(false);
  wishData = signal<WishData | null>(null);
  currentWish = signal<{ message: string; image: string } | null>(null);
  currentGift = signal<string>('');

  private isScratching = false;
  private scratchPercentage = 0;

  ngOnInit(): void {
    this.loadWishData();
  }

  private loadWishData(): void {
    this.http.get<WishData>('assets/data/wishes.json').subscribe({
      next: (data) => {
        this.wishData.set(data);
      },
      error: (error) => {
        console.error('Error loading wish data:', error);
        // Fallback data
        this.wishData.set({
          special: {},
          random: ['May this New Year bring you happiness and success! 🎆'],
          gifts: ['A year full of blessings! 🎁']
        });
      }
    });
  }

  enterName(): void {
  if (!this.userName.trim() || !this.wishData()) return;

  this.nameEntered.set(true);
  this.setCurrentWish();
  this.setCurrentGift();

  // 🎵 Enable special music after button click
  this.effectsService.enableAudioByUserGesture(this.userName);

  setTimeout(() => this.initializeScratchCanvas(), 100);
}


  private setCurrentWish(): void {
    const data = this.wishData()!;
    const lowerName = this.userName.toLowerCase().trim();
    
    if (data.special[lowerName]) {
      this.currentWish.set(data.special[lowerName]);
    } else {
      const randomMessage = data.random[Math.floor(Math.random() * data.random.length)];
      this.currentWish.set({
        message: randomMessage,
        image:'default.png'
      });
    }
  }

  private setCurrentGift(): void {
    const data = this.wishData()!;
    const randomGift = data.gifts[Math.floor(Math.random() * data.gifts.length)];
    this.currentGift.set(randomGift);
  }

  private initializeScratchCanvas(): void {
    const canvas = this.scratchCanvasRef.nativeElement;
    const container = canvas.parentElement!;
    
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    const ctx = canvas.getContext('2d')!;
    
    // Create scratch surface
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add scratch instruction
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch Here!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '16px Arial';
    ctx.fillText('✨ Reveal your wish ✨', canvas.width / 2, canvas.height / 2 + 20);
  }

  startScratching(event: MouseEvent | TouchEvent): void {
    this.isScratching = true;
    this.scratch(event);
  }

  scratch(event: MouseEvent | TouchEvent): void {
    if (!this.isScratching) return;
    
    const canvas = this.scratchCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    
    let x, y;
    if (event instanceof MouseEvent) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    }
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // Check scratch percentage
    this.checkScratchPercentage(ctx, canvas);
  }

  stopScratching(): void {
    this.isScratching = false;
  }

  private checkScratchPercentage(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }
    
    this.scratchPercentage = (transparentPixels / (pixels.length / 4)) * 100;
    
    if (this.scratchPercentage > 50 && !this.wishRevealed()) {
      this.revealWish();
    }
  }

  private revealWish(): void {
    this.wishRevealed.set(true);
    
    // Add effects
    this.effectsService.createFireworks(this.effectsContainer.nativeElement);
    setTimeout(() => {
      this.effectsService.createConfetti(this.effectsContainer.nativeElement);
    }, 500);
  }

  openGift(): void {
    this.giftOpened.set(true);
    this.effectsService.createConfetti(this.effectsContainer.nativeElement);
  }

  downloadCard(): void {
    const canvas = this.cardCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add stars
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Add title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎊 Happy New Year 2026! 🎊', canvas.width / 2, 80);
    
    // Add name
    ctx.font = 'bold 36px Arial';
    ctx.fillText(`Dear ${this.userName}`, canvas.width / 2, 150);
    
    // Add message (wrapped)
    const wish = this.currentWish()!;
    const words = wish.message.split(' ');
    let line = '';
    let y = 220;
    
    ctx.font = '24px Arial';
    ctx.fillStyle = '#FFF';
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > 700 && i > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[i] + ' ';
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);
    
    // Add gift message
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`🎁 ${this.currentGift()}`, canvas.width / 2, y + 80);
    
    // Download the canvas as image
    const link = document.createElement('a');
    link.download = `NewYear2026_${this.userName}_Greeting.png`;
    link.href = canvas.toDataURL();
    link.click();
  }

  shareWhatsApp(): void {
    const wish = this.currentWish()!;
    const message = `🎊 Happy New Year 2026! 🎊\n\nDear ${this.userName},\n\n${wish.message}\n\n🎁 Special Gift: ${this.currentGift()}\n\n✨ Wishing you an amazing 2026! ✨`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}