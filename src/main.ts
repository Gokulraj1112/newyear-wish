import { Component, OnInit, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { CountdownComponent } from './components/countdown.component';
import { WishComponent } from './components/wish.component';
import { CountdownService } from './services/countdown.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CountdownComponent, WishComponent],
  template: `
    <div class="app-container">
      <!-- Background -->
      <div class="background-gradient"></div>
      <div class="stars"></div>
      
      <!-- Header -->
      <header class="app-header text-center py-4">
        <h1 class="app-title">🌟 New Year Festival 2026 🌟</h1>
        <p class="app-subtitle">A magical celebration awaits you!</p>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <div class="container">
          <!-- Countdown Section -->
          <section class="countdown-section mb-5">
            <app-countdown></app-countdown>
          </section>

          <!-- Wish Section - Only show when unlocked -->
          @if (countdownService.isUnlocked()) {
            <section class="wish-section">
              <app-wish></app-wish>
            </section>
          }
        </div>
      </main>

      <!-- Footer -->
      <footer class="app-footer text-center py-3">
        <p class="mb-0">✨ Made with love for an amazing 2026 ✨</p>
      </footer>

      <!-- Effects Container -->
      <div class="effects-container" id="effectsContainer"></div>
    </div>
  `,
  styles: [`
    .app-container {
      position: relative;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .background-gradient {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, 
        #1a1a2e 0%, 
        #16213e 25%, 
        #0f3460 50%, 
        #16213e 75%, 
        #1a1a2e 100%);
      z-index: -2;
    }

    .stars {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(2px 2px at 20px 30px, #eee, transparent),
        radial-gradient(2px 2px at 40px 70px, #fff, transparent),
        radial-gradient(1px 1px at 90px 40px, #fff, transparent),
        radial-gradient(1px 1px at 130px 80px, #fff, transparent),
        radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
      background-size: 200px 100px;
      animation: stars 20s linear infinite;
      z-index: -1;
    }

    @keyframes stars {
      from { transform: translateY(0px); }
      to { transform: translateY(-200px); }
    }

    .app-header {
      position: relative;
      z-index: 10;
      padding: 2rem 1rem;
    }

    .app-title {
      font-size: 3rem;
      font-weight: bold;
      color: #FFD700;
      text-shadow: 
        0 0 5px rgba(255, 215, 0, 0.8),
        0 0 10px rgba(255, 215, 0, 0.6),
        0 0 15px rgba(255, 215, 0, 0.4);
      margin-bottom: 0.5rem;
      animation: titleGlow 3s ease-in-out infinite alternate;
    }

    .app-subtitle {
      font-size: 1.3rem;
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    @keyframes titleGlow {
      from { 
        text-shadow: 
          0 0 5px rgba(255, 215, 0, 0.8),
          0 0 10px rgba(255, 215, 0, 0.6),
          0 0 15px rgba(255, 215, 0, 0.4);
      }
      to { 
        text-shadow: 
          0 0 10px rgba(255, 215, 0, 1),
          0 0 20px rgba(255, 215, 0, 0.8),
          0 0 30px rgba(255, 215, 0, 0.6);
      }
    }

    .main-content {
      position: relative;
      z-index: 10;
      padding: 2rem 0;
    }

    .app-footer {
      position: relative;
      z-index: 10;
      color: rgba(255, 255, 255, 0.8);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      margin-top: 3rem;
    }

    .effects-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
    }

    @media (max-width: 768px) {
      .app-container {
        min-height: 100vh;
      }
      
      .app-header {
        padding: 1.5rem 1rem;
      }
      
      .app-title {
        font-size: 2rem;
        margin-bottom: 0.75rem;
      }
      
      .app-subtitle {
        font-size: 1.1rem;
      }
      
      .main-content {
        padding: 1rem 0;
      }
      
      .container {
        padding: 0 0.5rem;
      }
      
      .app-footer {
        margin-top: 2rem;
        padding: 1rem;
        font-size: 0.9rem;
      }
    }
    
    @media (max-width: 480px) {
      .app-header {
        padding: 1rem 0.5rem;
      }
      
      .app-title {
        font-size: 1.8rem;
      }
      
      .app-subtitle {
        font-size: 1rem;
      }
      
      .container {
        padding: 0 0.25rem;
      }
    }
  `]
})
export class App implements OnInit {
  countdownService = inject(CountdownService);

  ngOnInit(): void {
    // Add global styles for effects
    this.addGlobalEffectStyles();
  }

  private addGlobalEffectStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .firework {
        position: absolute;
        width: 6px;
        height: 6px;
        background: #FFD700;
        border-radius: 50%;
        animation: fireworkAnimation 3s ease-out forwards;
      }

      @keyframes fireworkAnimation {
        0% {
          transform: translateY(100vh);
          opacity: 1;
        }
        15% {
          opacity: 1;
        }
        50% {
          transform: translateY(20vh);
          opacity: 1;
        }
        100% {
          transform: translateY(20vh);
          opacity: 0;
          box-shadow: 
            0 0 50px #ff6b6b,
            0 0 100px #4ecdc4,
            0 0 150px #45b7d1,
            0 0 200px #feca57;
        }
      }

      .confetti {
        position: absolute;
        width: 8px;
        height: 8px;
        top: -10px;
        animation: confettiAnimation 5s linear forwards;
      }

      @keyframes confettiAnimation {
        to {
          transform: translateY(100vh) rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideHttpClient()
  ]
});