import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-quiz-option',
  imports: [],
  templateUrl: './quiz-option.component.html',
  styleUrls: ['./quiz-option.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizOptionComponent {

  @Input() letter: 'A' | 'B' | 'C' | 'D' = 'A';
  @Input() text: string = '';
  @Input() isSelected: boolean = false;
  @Input() isCorrect: boolean | null = null; 
  @Input() isClickable: boolean = false; // Nueva propiedad para controlar si es clickeable

  // Mapeo de colores según la letra
  get colorClasses() {
    const colors = {
      'A': {
        bg: 'from-white/90 to-orange-50/90',
        hover: 'hover:from-orange-100 hover:to-orange-200',
        border: 'border-orange-200 hover:border-orange-400',
        badge: 'from-orange-400 to-orange-500'
      },
      'B': {
        bg: 'from-white/90 to-pink-50/90',
        hover: 'hover:from-pink-100 hover:to-pink-200',
        border: 'border-pink-200 hover:border-pink-400',
        badge: 'from-pink-400 to-pink-500'
      },
      'C': {
        bg: 'from-white/90 to-purple-50/90',
        hover: 'hover:from-purple-100 hover:to-purple-200',
        border: 'border-purple-200 hover:border-purple-400',
        badge: 'from-purple-400 to-purple-500'
      },
      'D': {
        bg: 'from-white/90 to-yellow-50/90',
        hover: 'hover:from-yellow-100 hover:to-yellow-200',
        border: 'border-yellow-200 hover:border-yellow-400',
        badge: 'from-yellow-400 to-yellow-500'
      }
    };
    return colors[this.letter];
  }
}