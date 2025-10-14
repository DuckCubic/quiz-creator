import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Question, SupabaseQuestion } from '../interfaces/quiz.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = `${environment.supabaseUrl}/rest/v1/questions`;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'apikey': environment.supabaseAnonKey,
      'Authorization': `Bearer ${environment.supabaseAnonKey}`
    });
  }

  /**
   * Obtiene todas las preguntas desde Supabase
   */
  getQuestions(): Observable<Question[]> {
    return this.http.get<SupabaseQuestion[]>(
      `${this.apiUrl}?select=*&order=question_number.asc`,
      { headers: this.headers }
    ).pipe(
      map(supabaseQuestions => this.transformSupabaseQuestions(supabaseQuestions))
    );
  }

  /**
   * Transforma las preguntas de formato Supabase al formato de la aplicación
   */
  private transformSupabaseQuestions(supabaseQuestions: SupabaseQuestion[]): Question[] {
    return supabaseQuestions.map(sq => ({
      id: sq.question_number,
      questionText: sq.question_text,
      options: {
        A: sq.option_a,
        B: sq.option_b,
        C: sq.option_c,
        D: sq.option_d
      },
      correctAnswer: sq.correct_answer,
      timeLimit: sq.time_limit,
      videoUrl: sq.video_url
    }));
  }
}
