import { fetchGroupDataSchema } from "~/schema/group.schema";
import { joinGroupSchema } from "./../../../schema/explore.schema";
import { router, protectedProcedure } from "./../utils";
const groupRouter = router({
  getUserGroups: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id || "";
    const groups = await ctx.prisma.group.findMany({
      where: { GroupMembers: { some: { userId } } },
      include: { _count: { select: { GroupMembers: true } } },
    });
    return groups;
  }),
  joinExploreGroup: protectedProcedure
    .input(joinGroupSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id || "";
      const group = await ctx.prisma.group.findUniqueOrThrow({
        where: { id: input.groupId },
        include: { GroupMembers: true },
      });
      if (group.GroupMembers.some((member) => member.userId === userId))
        throw new Error("You are already a member of this group");
      await ctx.prisma.group.update({
        where: { id: input.groupId },
        data: { GroupMembers: { create: { userId } } },
      });
      await ctx.prisma.user.update({
        where: { id: userId },
        data: { GroupMember: { connect: { id: input.groupId } } },
      });
      return true;
    }),
  getGroupData: protectedProcedure
    .input(fetchGroupDataSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id || "";
      const group = await ctx.prisma.group.findUniqueOrThrow({
        where: { id: input.groupId },
        include: { GroupMembers: true, posts: { include: { author: true } } },
      });
      if (!group.GroupMembers.some((member) => member.userId === userId))
        throw new Error("You are not a member of this group");
      const posts = group.posts.map((post) => ({
        ...post,
        anonymous: post.anonymous,
        author: {
          ...post.author,
          name: post.anonymous ? "Anonymous" : post.author.name,
          email: post.anonymous ? undefined : post.author.email,
          image: post.anonymous ? undefined : post.author.image,
        },
      }));

      const res = { ...group, posts };
      return res;
    }),
  getGroupPosts: protectedProcedure
    .input(fetchGroupDataSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id || "";
      const group = await ctx.prisma.group.findUniqueOrThrow({
        where: { id: input.groupId },
        include: { GroupMembers: true, posts: { include: { author: true } } },
      });
      if (!group.GroupMembers.some((member) => member.userId === userId))
        throw new Error("You are not a member of this group");
      const posts = group.posts.map((post) => ({
        ...post,
        anonymous: post.anonymous,
        authorName: post.anonymous ? "Anonymous" : post.author.name,
        authorImage: post.anonymous
          ? undefined
          : post.author.image ?? undefined,
        groupName: group.name,
      }));
      return posts;
    }),
});

export default groupRouter;
