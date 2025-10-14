// quiz.interface.ts
export interface Question {
  id: number;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  timeLimit: number;
  videoUrl?: string;
}

// Interface para los datos que vienen de Supabase
export interface SupabaseQuestion {
  id: string;
  question_number: number;
  question_text: string;
  video_url: string;
  time_limit: number;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  created_at: string;
}
