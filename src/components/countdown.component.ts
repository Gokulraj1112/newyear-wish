import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownService } from '../services/countdown.service';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="countdown-container text-center">
      <h1 class="countdown-title mb-4">🎆 New Year 2026 Countdown 🎆</h1>
      
      @if (!countdownService.isUnlocked()) {
        <div class="countdown-display">
          <div class="row justify-content-center">
           
            <div class="col-6 col-md-3 mb-3">
              <div class="time-box">
                <div class="time-number">{{ countdownService.timeLeft().hours }}</div>
                <div class="time-label">Hours</div>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div class="time-box">
                <div class="time-number">{{ countdownService.timeLeft().minutes }}</div>
                <div class="time-label">Minutes</div>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div class="time-box">
                <div class="time-number">{{ countdownService.timeLeft().seconds }}</div>
                <div class="time-label">Seconds</div>
              </div>
            </div>
          </div>
        </div>
        <p class="countdown-message mt-4">Get ready for an amazing New Year ...!</p>
      } @else {
        <div class="unlocked-message">
          <h2 class="mb-3">🎊 Happy New Year 2026! 🎊</h2>
          <p class="lead">The celebration begins now!</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .countdown-container {
      padding: 2rem 1rem;
      color: white;
    }

    .countdown-title {
      font-size: 2.5rem;
      font-weight: bold;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
      margin-bottom: 2rem;
    }

    .time-box {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
      border: 2px solid rgba(255, 215, 0, 0.8);
      border-radius: 15px;
      padding: 1.5rem 1rem;
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .time-box:hover {
      transform: scale(1.05);
      box-shadow: 0 0 40px rgba(255, 215, 0, 0.5);
    }

    .time-number {
      font-size: 3rem;
      font-weight: bold;
      color: #FFD700;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
    }

    .time-label {
      font-size: 1.2rem;
      color: #FFF;
      margin-top: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .countdown-message {
      font-size: 1.3rem;
      color: #FFD700;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
    }

    .unlocked-message h2 {
      font-size: 3rem;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
      animation: glow 2s ease-in-out infinite alternate;
    }

    @keyframes glow {
      from { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
      to { text-shadow: 0 0 30px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.8); }
    }

    @media (max-width: 768px) {
      .countdown-container {
        padding: 1rem 0.5rem;
      }
      
      .countdown-title { 
        font-size: 1.8rem; 
        margin-bottom: 1.5rem;
      }
      
      .time-box {
        padding: 1rem 0.5rem;
        margin-bottom: 0.5rem;
      }
      
      .time-number { 
        font-size: 2rem; 
      }
      
      .time-label { 
        font-size: 0.9rem; 
        margin-top: 0.25rem;
      }
      
      .countdown-message {
        font-size: 1.1rem;
        margin-top: 2rem;
      }
      
      .unlocked-message h2 { 
        font-size: 2rem; 
        margin-bottom: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .countdown-title { 
        font-size: 1.5rem; 
      }
      
      .time-number { 
        font-size: 1.8rem; 
      }
      
      .time-label { 
        font-size: 0.8rem; 
      }
      
      .unlocked-message h2 { 
        font-size: 1.8rem; 
      }
    }
  `]
})
export class CountdownComponent implements OnInit, OnDestroy {
  countdownService = inject(CountdownService);

  ngOnInit(): void {
    this.countdownService.startCountdown();
  }

  ngOnDestroy(): void {
    this.countdownService.stopCountdown();
  }
}