const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function signup(root, { email, password, name }, { prisma }) {
  password = await bcrypt.hash(password, 10);
  const user = await prisma.createUser({ email, password, name });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}

async function login(root, { email, password }, { prisma }) {
  const user = await prisma.user({ email });
  if (!user) { throw new Error('No such user found') }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) { throw new Error('Invalid password') }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}

function post(root, { url, description }, { request, prisma }) {
  const userId = getUserId(request);

  return prisma.createLink({
    url,
    description,
    postedBy: { connect: { id: userId } },
  });
}

async function updateLink(root, { id, url, description }, { request, prisma }) {
  const userId = getUserId(request);
  const linkExist = await prisma.$exists.link({
    id,
    postedBy: { id: userId },
  });
  if (!linkExist) { throw new Error('User not authorized to update post') }

  return prisma.updateLink({
    data: { url, description },
    where: { id },
  });
}

async function deleteLink(root, { id }, { request, prisma }) {
  const userId = getUserId(request);
  const linkExist = await prisma.$exists.link({
    id,
    postedBy: { id: userId },
  });
  if (!linkExist) { throw new Error('User not authorized to delete post') }

  return prisma.deleteLink({ id });
}

async function vote(root, { linkId }, { request, prisma }) {
  const userId = getUserId(request);
  const voteExist = await prisma.$exists.vote({
    user: { id: userId },
    link: { id: linkId },
  });
  if (voteExist) { throw new Error(`Already voted for link: ${linkId}`) }

  return prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: linkId } },
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