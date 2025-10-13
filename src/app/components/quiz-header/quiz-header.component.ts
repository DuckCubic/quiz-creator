import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz-header',
  imports: [],
  templateUrl: './quiz-header.component.html',
    styleUrls: ['./quiz-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizHeaderComponent {
  @Input() avatarUrl: string = 'https://i.pravatar.cc/102';
  @Input() isOnline: boolean = true;
  @Input() title: string = 'FrameQuiz';
  @Input() subtitle: string = 'Cinema Fun';
  @Input() currentQuestion: number = 1;
  @Input() totalQuestions: number = 10;
  @Input() showCounter: boolean = true;

  get questionCounter(): string {
    return `${this.currentQuestion}/${this.totalQuestions}`;
  }
}
