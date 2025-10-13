import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { QuizOptionComponent } from "../../components/quiz-option/quiz-option.component";
import { QuizHeaderComponent } from "../../components/quiz-header/quiz-header.component";
import { CircularTimerComponent } from "../../components/circular-timer/circular-timer.component";
import { Question } from '../../interfaces/quiz.interface';

@Component({
  selector: 'app-generator-quiz-page',
  standalone: true,
  imports: [
    QuizOptionComponent,
    QuizHeaderComponent,
    CircularTimerComponent
  ],
  templateUrl: './generator-quiz-page.html',
  styleUrl: './generator-quiz-page.css'
})
export default class GeneratorQuizPage implements AfterViewInit {

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild(CircularTimerComponent) timer!: CircularTimerComponent;

  questions: Question[] = [
    {
      id: 1,
      questionText: "Which actor voiced Buzz Lightyear?",
      options: {
        A: "Tim Allen",
        B: "Tom Hanks",
        C: "Chris Evans",
        D: "Will Smith"
      },
      correctAnswer: "A",
      timeLimit: 10,
      videoUrl: "assets/videos/kick.mp4"
    },
    {
      id: 2,
      questionText: "In which year was the first Star Wars movie released?",
      options: {
        A: "1975",
        B: "1977",
        C: "1980",
        D: "1983"
      },
      correctAnswer: "B",
      timeLimit: 10,
      videoUrl: "assets/videos/overlord.mp4"
    },
  ];

  currentQuestionIndex = 0;
  selectedOption: string | null = null;
  quizStarted = false;
  showingAnswer = false;
  private answerTimeout: any = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.loadInitialVideo();
  }

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  get options() {
    const q = this.currentQuestion;
    return [
      { letter: 'A' as const, text: q.options.A },
      { letter: 'B' as const, text: q.options.B },
      { letter: 'C' as const, text: q.options.C },
      { letter: 'D' as const, text: q.options.D }
    ];
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  // Cargar video inicial
  loadInitialVideo() {
    if (this.videoPlayer?.nativeElement) {
      const video = this.videoPlayer.nativeElement;
      const videoUrl = this.currentQuestion.videoUrl;
      
      if (!videoUrl) {
        console.warn('No hay URL de video para la pregunta inicial');
        return;
      }
      
      video.muted = true;
      video.volume = 0;
      video.src = videoUrl;
      video.load();
      video.play().catch(e => console.log('Error playing initial video:', e));
    }
  }

  // Iniciar el quiz
  startQuiz() {
    this.quizStarted = true;
    this.currentQuestionIndex = 0;
    this.selectedOption = null;
    this.showingAnswer = false;
    
    // Limpiar timeout previo si existe
    if (this.answerTimeout) {
      clearTimeout(this.answerTimeout);
      this.answerTimeout = null;
    }
    
    // Cargar el video de la primera pregunta
    this.changeVideo();
    
    this.cdr.detectChanges();
    
    // Iniciar timer automáticamente
    setTimeout(() => {
      if (this.timer) {
        this.timer.resetTimer();
        this.timer.startTimer();
      }
    }, 100);
  }

  // Cuando el tiempo se agota (automáticamente)
  onTimeUp() {
    console.log('¡Tiempo agotado! Mostrando respuesta...');
    this.showAnswer();
  }

  // Mostrar respuesta por 5 segundos
  showAnswer() {
    if (this.showingAnswer) return;
    
    this.showingAnswer = true;
    
    // Detener el timer
    if (this.timer && this.timer.isRunning) {
      this.timer.stopTimer();
    }
    
    this.cdr.detectChanges();

    // Esperar 5 segundos y pasar automáticamente a la siguiente pregunta
    this.answerTimeout = setTimeout(() => {
      this.goToNextQuestion();
    }, 5000);
  }

  // Ir a la siguiente pregunta automáticamente
  goToNextQuestion() {
    if (this.answerTimeout) {
      clearTimeout(this.answerTimeout);
      this.answerTimeout = null;
    }

    if (this.isLastQuestion) {
      console.log('Quiz terminado');
      this.quizStarted = false;
      this.showingAnswer = false;
      this.cdr.detectChanges();
      return;
    }

    this.currentQuestionIndex++;
    this.selectedOption = null;
    this.showingAnswer = false;
    
    this.cdr.detectChanges();
    
    // Cambiar video DESPUÉS de actualizar el índice
    setTimeout(() => {
      this.changeVideo();
      
      // Iniciar timer para la siguiente pregunta
      if (this.timer) {
        this.timer.resetTimer();
        this.timer.startTimer();
      }
    }, 100);
  }

  changeVideo() {
    if (this.videoPlayer?.nativeElement) {
      const video = this.videoPlayer.nativeElement;
      const newVideoUrl = this.currentQuestion.videoUrl;
      
      if (!newVideoUrl) {
        console.warn('No hay URL de video para esta pregunta');
        return;
      }
      
      console.log('Cambiando video a:', newVideoUrl);
      
      // Pausar el video actual
      video.pause();
      
      // Cambiar la fuente del video
      video.src = newVideoUrl;
      
      // Mantener el video muted
      video.muted = true;
      video.volume = 0;
      
      // Cargar y reproducir el nuevo video
      video.load();
      
      video.play()
        .then(() => console.log('Video cargado exitosamente:', newVideoUrl))
        .catch(e => console.log('Error playing video:', e));
    }
  }

  ngOnDestroy() {
    if (this.answerTimeout) {
      clearTimeout(this.answerTimeout);
    }
    
    // Pausar el video al destruir el componente
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.pause();
    }
  }

}
