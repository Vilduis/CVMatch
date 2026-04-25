CREATE TABLE "analyses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"cv_text" text NOT NULL,
	"job_description" text NOT NULL,
	"match_score" integer NOT NULL,
	"strengths" text NOT NULL,
	"gaps" text NOT NULL,
	"cv_suggestions" text NOT NULL,
	"interview_questions" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image" text,
	"credits" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;