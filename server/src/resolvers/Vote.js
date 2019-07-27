function link(root, args, { prisma }) {
  return prisma.vote({ id: root.id }).link()
}

function user(root, args, { prisma }) {
  return prisma.vote({ id: root.id }).user()
}

module.exports = {
  link,
  user,
}