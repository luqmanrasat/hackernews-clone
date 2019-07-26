const post = (root, args, context) => context.prisma.createLink({
  url: args.url,
  description: args.description,
});

const updateLink = (root, args, context) => context.prisma.updateLink({
  data: { url: args.url, description: args.description },
  where: { id: args.id }
});

const deleteLink = (root, args, context) => context.prisma.deleteLink({ id: args.id });

module.exports = {
  post,
  updateLink,
  deleteLink,
}