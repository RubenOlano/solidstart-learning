import {
  createCommentSchema,
  fetchCommentsSchema,
} from "~/schema/comment.schema";
import { protectedProcedure, router } from "./../utils";
export const commentRouter = router({
  createComment: protectedProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const { body, postId } = input;
      const authorId = ctx.session.user.id || "";
      const comment = await ctx.prisma.postComment.create({
        data: {
          content: body,
          authorId,
          postId,
          createdAt: new Date(),
        },
      });
      await ctx.prisma.post.update({
        where: { id: postId },
        data: { PostComment: { connect: { id: comment.id } } },
      });
      await ctx.prisma.user.update({
        where: { id: authorId },
        data: { PostComment: { connect: { id: comment.id } } },
      });

      return comment;
    }),
  fetchComments: protectedProcedure
    .input(fetchCommentsSchema)
    .query(async ({ ctx, input }) => {
      const { postId } = input;
      const comments = await ctx.prisma.postComment.findMany({
        where: { postId },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      });
      return comments;
    }),
});
