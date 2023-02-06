import { commentRouter } from "./comment";
import { postRouter } from "./post";
import { router } from "../utils";
import exploreRouter from "./explore";
import groupRouter from "./group";

export const appRouter = router({
  post: postRouter,
  explore: exploreRouter,
  group: groupRouter,
  comment: commentRouter,
});

export type IAppRouter = typeof appRouter;
