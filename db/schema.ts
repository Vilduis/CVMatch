import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  credits: integer("credits").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const analyses = pgTable("analyses", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  cvText: text("cv_text").notNull(),
  jobDescription: text("job_description").notNull(),
  matchScore: integer("match_score").notNull(),
  strengths: text("strengths").notNull(),
  gaps: text("gaps").notNull(),
  cvSuggestions: text("cv_suggestions").notNull(),
  interviewQuestions: text("interview_questions"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const tailoredCvs = pgTable("tailored_cvs", {
  analysisId: text("analysis_id")
    .primaryKey()
    .references(() => analyses.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  data: text("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const stripeEvents = pgTable("stripe_events", {
  eventId: text("event_id").primaryKey(),
  processedAt: timestamp("processed_at").notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Analysis = typeof analyses.$inferSelect
export type NewAnalysis = typeof analyses.$inferInsert
