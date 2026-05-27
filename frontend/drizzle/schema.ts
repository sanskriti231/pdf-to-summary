import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email"),
  name: text("name"),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").default(sql`(current_timestamp)`),
});

export const summaries = sqliteTable("summaries", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  originalFilename: text("original_filename").notNull(),
  pageCount: integer("page_count").notNull(),
  originalWordCount: integer("original_word_count").notNull(),
  summaryWordCount: integer("summary_word_count").notNull(),
  chunksProcessed: integer("chunks_processed").notNull(),
  summary: text("summary").notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").default(sql`(current_timestamp)`),
});
