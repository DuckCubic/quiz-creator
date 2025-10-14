import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz-header',
  imports: [],
  templateUrl: './quiz-header.component.html',
    styleUrls: ['./quiz-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizHeaderComponent {
  @Input() avatarUrl: string = './assets/images/youtube/icon.png';
  @Input() isOnline: boolean = true;
  @Input() title: string = 'FrameQuiz';
  @Input() subtitle: string = 'Preguntas del día';
  @Input() currentQuestion: number = 1;
  @Input() totalQuestions: number = 10;
  @Input() showCounter: boolean = true;

  get questionCounter(): string {
    return `${this.currentQuestion}/${this.totalQuestions}`;
  }
}
