import { date, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
})

export const exams = pgTable('exams', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, {onDelete: 'cascade'}),
    name: text('name').notNull(),
    examDate: date('exam_date').notNull(),
    cfu: integer('cfu'),
    createdAt: timestamp('create_at').notNull().defaultNow()
})

export const studyUnits = pgTable('study_units', {
    id: uuid('id').primaryKey().defaultRandom(),
    examId: uuid('exam_id').notNull().references(() => exams.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    estimatedMinutes: integer('estimated_minutes').notNull(),
    position: integer('position').notNull(),
    completedAt: timestamp('completed_at')
})