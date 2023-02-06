import { handleError } from "./../../../utils/errorHandler";
import {
  fetchNumLikesSchema,
  fetchPostFeedSchema,
  toggleLikedPostSchema,
  createPostSchema,
} from "./../../../schema/post.schema";
import { protectedProcedure, router } from "./../utils";
export const postRouter = router({
  mainFeed: protectedProcedure
    .input(fetchPostFeedSchema)
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const userId = ctx.session.user.id as string;
      try {
        const posts = await ctx.prisma.post.findMany({
          take: limit + 1,
          where: {
            Group: { GroupMembers: { some: { userId } } },
          },
          include: { author: true, Group: true },
          orderBy: { createdAt: "desc" },
          cursor: cursor ? { id: cursor } : undefined,
        });
        let newCursor: typeof cursor | undefined;
        if (posts.length > limit) {
          const nextItem = posts.pop();
          newCursor = nextItem?.id;
        }
        const resPosts = posts.map((post) => ({
          id: post.id,
          authorName: post.anonymous ? "Anonymous" : post.author.name,
          groupName: post.Group.name,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt,
          groupId: post.groupId,
          authorImage: post.anonymous
            ? undefined
            : post.author.image ?? undefined,
        }));
        return {
          posts: resPosts,
          cursor: newCursor,
        };
      } catch (e) {
        throw handleError(e);
      }
    }),
  postLikes: protectedProcedure
    .input(fetchNumLikesSchema)
    .query(async ({ ctx, input }) => {
      const { postId } = input;
      try {
        const likes = await ctx.prisma.likedPost.count({
          where: {
            AND: [{ postId }, { liked: true }],
          },
        });
        return { likes };
      } catch (e) {
        throw handleError(e);
      }
    }),
  likePost: protectedProcedure
    .input(toggleLikedPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const userId = ctx.session.user.id as string;
      try {
        let likedPost = await ctx.prisma.likedPost.findUnique({
          where: {
            postId_userId: {
              postId,
              userId,
            },
          },
        });
        if (!likedPost) {
          likedPost = await ctx.prisma.likedPost.create({
            data: {
              userId,
              postId,
              liked: true,
            },
          });
        } else {
          await ctx.prisma.likedPost.update({
            where: { id: likedPost.id },
            data: { liked: !likedPost.liked },
          });
        }
        return { liked: likedPost.liked };
      } catch (e) {
        throw handleError(e);
      }
    }),
  userLikedPost: protectedProcedure
    .input(toggleLikedPostSchema)
    .query(async ({ ctx, input }) => {
      const { postId } = input;
      const userId = ctx.session.user.id as string;
      try {
        const likedPost = await ctx.prisma.likedPost.findUnique({
          where: { postId_userId: { postId, userId } },
        });
        return { liked: likedPost?.liked ?? false };
      } catch (e) {
        throw handleError(e);
      }
    }),
  createPost: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, content, groupId, anonymous } = input;
      const userId = ctx.session.user.id as string;
      try {
        const post = await ctx.prisma.post.create({
          data: {
            title,
            content,
            groupId,
            anonymous,
            Duration: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
            authorId: userId,
          },
        });

        await ctx.prisma.user.update({
          where: { id: userId },
          data: { Posts: { connect: { id: post.id } } },
        });
        await ctx.prisma.group.update({
          where: { id: groupId },
          data: { posts: { connect: { id: post.id } } },
        });
        return { id: post.id };
      } catch (e) {
        throw handleError(e);
      }
    }),
});
