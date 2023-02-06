import { z } from "zod";

export const fetchGroupDataSchema = z.object({
  groupId: z.string(),
});
