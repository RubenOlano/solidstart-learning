import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.string().min(1).max(1000),
  postId: z.string(),
});

export const fetchCommentsSchema = z.object({
  postId: z.string(),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
