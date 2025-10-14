import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizOptionComponent } from "../../components/quiz-option/quiz-option.component";
import { QuizHeaderComponent } from "../../components/quiz-header/quiz-header.component";
import { CircularTimerComponent } from "../../components/circular-timer/circular-timer.component";
import { Question } from '../../interfaces/quiz.interface';
import { QuizService } from '../../services/quiz.service.service';

@Component({
  selector: 'app-generator-quiz-page',
  standalone: true,
  imports: [
    CommonModule,
    QuizOptionComponent,
    QuizHeaderComponent,
    CircularTimerComponent
  ],
  templateUrl: './generator-quiz-page.html',
  styleUrl: './generator-quiz-page.css'
})
export default class GeneratorQuizPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild(CircularTimerComponent) timer!: CircularTimerComponent;

  questions: Question[] = [];
  currentQuestionIndex = 0;
  selectedOption: string | null = null;
  quizStarted = false;
  showingAnswer = false;
  loading = true;
  error: string | null = null;
  backgroundColor = '#ffffff'; // Fondo inicial blanco
  audioMode: 'music' | 'video' = 'video'; // Modo de audio inicial
  isTransitioning = false; // Para controlar la transición entre preguntas
  
  private answerTimeout: any = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private quizService: QuizService
  ) {}

  ngOnInit() {
    this.loadQuestionsFromSupabase();
  }

  ngAfterViewInit() {
    // El video se cargará después de obtener las preguntas
  }

  /**
   * Cargar preguntas desde Supabase
   */
  loadQuestionsFromSupabase() {
    this.loading = true;
    this.error = null;
    
    this.quizService.getQuestions().subscribe({
      next: (questions) => {
        console.log('Preguntas cargadas desde Supabase:', questions);
        this.questions = questions;
        this.loading = false;
        
        if (this.questions.length > 0) {
          this.cdr.detectChanges();
          setTimeout(() => this.loadInitialVideo(), 100);
        }
      },
      error: (err) => {
        console.error('Error al cargar preguntas:', err);
        this.error = 'Error al cargar las preguntas. Por favor, intenta nuevamente.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
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
    if (this.videoPlayer?.nativeElement && this.questions.length > 0) {
      const video = this.videoPlayer.nativeElement;
      const videoUrl = this.currentQuestion.videoUrl;
      
      if (!videoUrl) {
        console.warn('No hay URL de video para la pregunta inicial');
        return;
      }
      
      // Configurar audio según el modo seleccionado
      if (this.audioMode === 'music') {
        video.muted = true;
        video.volume = 0;
      } else {
        video.muted = false;
        video.volume = 1;
      }
      
      video.src = videoUrl;
      video.load();
      video.play().catch(e => console.log('Error playing initial video:', e));
    }
  }

  // Iniciar el quiz
  startQuiz() {
    if (this.questions.length === 0) {
      console.warn('No hay preguntas disponibles');
      return;
    }

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

  // Ir a la siguiente pregunta automáticamente con transición
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

    // Iniciar transición de salida
    this.isTransitioning = true;
    this.cdr.detectChanges();
    
    // Esperar que termine la transición de salida (300ms)
    setTimeout(() => {
      this.currentQuestionIndex++;
      this.selectedOption = null;
      this.showingAnswer = false;
      
      // Cambiar video inmediatamente
      this.changeVideo();
      
      this.cdr.detectChanges();
      
      // Pequeña pausa para asegurar que el DOM se actualice
      setTimeout(() => {
        // Terminar transición (fade in)
        this.isTransitioning = false;
        this.cdr.detectChanges();
        
        // Esperar a que termine completamente el fade in antes de iniciar el timer
        setTimeout(() => {
          if (this.timer) {
            this.timer.resetTimer();
            this.timer.startTimer();
          }
        }, 350); // Esperar 350ms después del fade in para que sea visible
      }, 50);
    }, 300);
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
      
      // Configurar audio según el modo seleccionado
      if (this.audioMode === 'music') {
        video.muted = true;
        video.volume = 0;
      } else {
        video.muted = false;
        video.volume = 1;
      }
      
      // Cargar y reproducir el nuevo video
      video.load();
      
      video.play()
        .then(() => console.log('Video cargado exitosamente:', newVideoUrl))
        .catch(e => console.log('Error playing video:', e));
    }
  }

  /**
   * Alternar entre fondo blanco y verde
   */
  toggleBackground() {
    this.backgroundColor = this.backgroundColor === '#ffffff' ? '#04F404' : '#ffffff';
  }

  /**
   * Alternar entre modo música y audio del video
   */
  toggleAudioMode() {
    this.audioMode = this.audioMode === 'music' ? 'video' : 'music';
    
    // Si ya hay un video cargado, actualizar su configuración de audio
    if (this.videoPlayer?.nativeElement) {
      const video = this.videoPlayer.nativeElement;
      if (this.audioMode === 'music') {
        video.muted = true;
        video.volume = 0;
      } else {
        video.muted = false;
        video.volume = 1;
      }
    }
  }

  /**
   * Reintentar carga de preguntas
   */
  retryLoadQuestions() {
    this.loadQuestionsFromSupabase();
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
