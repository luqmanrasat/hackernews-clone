const info = () => `This is the API of a Hackernews Clone`;

const feed = (root, args, context) => context.prisma.links();

const link = (root, args, context) => context.prisma.link({ id: args.id });

module.exports = {
  info,
  feed,
  link,
}