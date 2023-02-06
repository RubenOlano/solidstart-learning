import { z } from "zod";

export const fetchExploreSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
});

export const joinGroupSchema = z.object({
  groupId: z.string(),
});
