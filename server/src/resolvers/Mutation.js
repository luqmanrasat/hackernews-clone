const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function signup(root, args, { prisma }) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await prisma.createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(root, args, { prisma }) {
  const user = await prisma.user({ email: args.email });
  if (!user) { throw new Error('No such user found') }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) { throw new Error('Invalid password') }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

function post(root, args, { request, prisma }) {
  const userId = getUserId(request);

  return prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  });
}

async function updateLink(root, args, { request, prisma }) {
  const userId = getUserId(request);
  const linkExist = await prisma.$exists.link({
    id: args.id,
    postedBy: { id: userId },
  });
  if (!linkExist) { throw new Error('User not authorized to update post') }

  return prisma.updateLink({
    data: { 
      url: args.url,
      description: args.description,
    },
    where: { id: args.id },
  })
}

async function deleteLink(root, args, { request, prisma }) {
  const userId = getUserId(request);
  const linkExist = await prisma.$exists.link({
    id: args.id,
    postedBy: { id: userId },
  });
  if (!linkExist) { throw new Error('User not authorized to delete post') }

  return prisma.deleteLink({ id: args.id })
}

async function vote(root, args, { request, prisma }) {
  const userId = getUserId(request);
  const voteExist = await prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  });
  if (voteExist) { throw new Error(`Already voted for link: ${args.linkId}`) }

  return prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  });
}

module.exports = {
  signup,
  login,
  post,
  updateLink,
  deleteLink,
  vote,
}