import * as z from 'zod'

export const studyUnitInputSchema = z.object({
    title: z.string().trim().nonempty(),
    estimatedMinutes: z.int().max(600)
});

export const createExamSchema = z.object({
    name: z.string().max(50).nonempty(),
    examDate: z.iso.date().refine((date: any) => {
        if(date < Date.now()){
            throw new Error('Data passata')
        }
    }),
    cfu: z.int().optional(),
    units: z.array(studyUnitInputSchema).min(1).max(200)
});

export const examIdParamsSchema = z.object({
    id: z.uuid()
})

export type CreateExamInput = z.infer<typeof createExamSchema>
export type ExamIdParams = z.infer<typeof examIdParamsSchema>