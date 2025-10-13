// circular-timer.component.ts
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-circular-timer',
  standalone: true,
  imports: [],
  templateUrl: './circular-timer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircularTimerComponent implements OnDestroy {
  @Input() timeLimit: number = 10;
  @Output() timeUp = new EventEmitter<void>();
  
  timeRemaining: number = 10;
  private timerInterval?: number;
  private readonly CIRCLE_CIRCUMFERENCE = 276;
  isRunning = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy() {
    this.stopTimer();
  }

  get strokeDashoffset(): number {
    const progress = this.timeRemaining / this.timeLimit;
    return this.CIRCLE_CIRCUMFERENCE * (1 - progress);
  }

  startTimer() {
    if (this.isRunning) return;
    
    this.timeRemaining = this.timeLimit;
    this.isRunning = true;
    this.cdr.markForCheck(); // Forzar detección de cambios inicial
    
    this.timerInterval = window.setInterval(() => {
      this.timeRemaining--;
      this.cdr.markForCheck(); // Forzar detección de cambios cada segundo
      
      if (this.timeRemaining <= 0) {
        this.stopTimer();
        this.timeUp.emit();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
      this.isRunning = false;
    }
  }

  resetTimer() {
    this.stopTimer();
    this.timeRemaining = this.timeLimit;
    this.cdr.markForCheck(); // Forzar detección de cambios al resetear
  }
}
