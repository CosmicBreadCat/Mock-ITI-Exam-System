import { Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExamQuestion } from '../../exams/entities/exam-question.entity';

export enum QuestionType {
  MCQ = 'Multi-Choice',
  TrueFalse = 'True-Or-False',
  Text = 'Text-Based',
}

@Entity()
@Check(`array_length("choices", 1) <= 3`)
@Check(`
    CASE "type"
      WHEN 'Multi-Choice' THEN
        "choices" IS NOT NULL
        AND "correct_answer" <> ALL("choices")
      ELSE
        "choices" IS NULL
    END
  `)
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 500 })
  body!: string;

  @Column({ type: 'enum', enum: QuestionType, default: QuestionType.MCQ })
  type!: QuestionType;

  @Column({ length: 500 })
  correctAnswer!: string;

  @Column({ type: 'varchar', length: 500, array: true, nullable: true })
  choices?: string[];

  @OneToMany(() => ExamQuestion, (examQuestion) => examQuestion.question)
  examQuestions!: ExamQuestion[];
}
