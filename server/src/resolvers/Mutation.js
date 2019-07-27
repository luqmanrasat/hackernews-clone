const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function signup(root, args, context) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(root, args, context) {
  const user = await context.prisma.user({ email: args.email });
  if (!user) { throw new Error('No such user found') }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) { throw new Error('Invalid password') }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

function post(root, args, context) {
  const userId = getUserId(context);

  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  });
}

async function updateLink(root, args, context) {
  const userId = getUserId(context);
  const postedBy = await context.prisma.link({ id: args.id }).postedBy();
  if (userId !== postedBy.id) { throw new Error('User not authorized to update post') }

  return context.prisma.updateLink({
    data: { 
      url: args.url,
      description: args.description,
    },
    where: { id: args.id },
  })
}

async function deleteLink(root, args, context) {
  const userId = getUserId(context);
  const postedBy = await context.prisma.link({ id: args.id }).postedBy();
  if (userId !== postedBy.id) { throw new Error('User not authorized to delete post') }

  return context.prisma.deleteLink({ id: args.id })
}

module.exports = {
  signup,
  login,
  post,
  updateLink,
  deleteLink,
}