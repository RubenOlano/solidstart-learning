import { fetchExploreSchema } from "~/schema/explore.schema";
import { handleError } from "~/utils/errorHandler";
import { router, procedure } from "./../utils";
const exploreRouter = router({
  explorePosts: procedure
    .input(fetchExploreSchema)
    .query(async ({ ctx, input }) => {
      // Infinite query for posts
      // (will be called again when user scrolls down)
      const limit = input.limit ?? 5;
      const userId = ctx.session?.user?.id || "";
      const { cursor } = input;
      try {
        const posts = await ctx.prisma.post.findMany({
          take: limit + 1,
          where: {
            AND: [
              { Group: { private: false } },
              { Group: { GroupMembers: { none: { userId } } } },
            ],
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
  exploreGroups: procedure
    .input(fetchExploreSchema)
    .query(async ({ ctx, input }) => {
      // Infinite query for groups
      // (will be called again when user scrolls down)
      const limit = input.limit ?? 5;
      const { cursor } = input;
      const userId = ctx.session?.user?.id || "";
      try {
        const groups = await ctx.prisma.group.findMany({
          take: limit + 1,
          where: {
            AND: [{ private: false }, { GroupMembers: { none: { userId } } }],
          },
          include: { _count: { select: { GroupMembers: true } } },
          orderBy: { createdAt: "desc" },
          cursor: cursor ? { id: cursor } : undefined,
        });
        let newCursor: typeof cursor | undefined;
        if (groups.length > limit) {
          const nextItem = groups.pop();
          newCursor = nextItem?.id;
        }
        const resGroups = groups.map((group) => ({
          id: group.id,
          name: group.name,
          description: group.description,
          createdAt: group.createdAt,
          members: group._count.GroupMembers,
        }));
        return {
          groups: resGroups,
          cursor: newCursor,
        };
      } catch (e) {
        throw handleError(e);
      }
    }),
});

export default exploreRouter;
