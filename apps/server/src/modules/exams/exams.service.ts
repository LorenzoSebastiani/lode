import type { CreateExamInput } from "@lode/shared"
import { exams, studyUnits, type Exam, type ExamWithUnits } from "../../db/schema.js"
import { db } from "../../db/index.js"
import { and, asc, eq } from "drizzle-orm"
import { AppError } from "../../lib/errors.js"

export const createExam = async (userId: string, input: CreateExamInput): Promise<ExamWithUnits> => {
    return await db.transaction(async (tx) => {
        const [exam] = await tx.insert(exams)
            .values({ userId: userId, name: input.name, examDate: input.examDate, cfu: input.cfu })
            .returning({ id: exams.id, userId: exams.userId, name: exams.name, examDate: exams.examDate, cfu: exams.cfu, createdAt: exams.createdAt });

        if(!exam) {
            throw new Error('Creazione esame fallita')
        }

        const unitRows = input.units.map((unit, index) => ({
            ...unit,
            examId: exam.id,
            position: index,
        }));

        const units = await tx.insert(studyUnits)
        .values(unitRows)
        .returning({id: studyUnits.id, title: studyUnits.title, estimatedMinutes: studyUnits.estimatedMinutes, examId: studyUnits.examId, completedAt: studyUnits.completedAt, position: studyUnits.position})

        return {
            ...exam,
            units
        }
    })
}

export const listExams = async (userId: string): Promise<Exam[]> => {
    return await db.select().from(exams).where(eq(exams.userId, userId)).orderBy(asc(exams.createdAt));
}

export const getExam = async (userId: string, examId: string): Promise<ExamWithUnits> => {
    const [exam] = await db.select().from(exams).where(and(eq(exams.id, examId), eq(exams.userId, userId)));
    
    if(!exam) {
        throw new AppError(404, 'Esame non trovato')
    }

    const units = await db.select().from(studyUnits).where(eq(studyUnits.examId, examId));

    return {
        ...exam,
        units
    }
}

export const deleteExam = async (userId: string, examId: string): Promise<void> => {
    const examsDeleted = await db.delete(exams).where(and(eq(exams.id, examId), eq(exams.userId, userId))).returning({id: exams.id});

    if(examsDeleted.length === 0) {
        throw new AppError(404, 'Nessun esame trovato')
    }

    return;
}