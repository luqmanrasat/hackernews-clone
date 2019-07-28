function link({ id }, args, { prisma }) {
  return prisma.vote({ id }).link()
}

function user({ id }, args, { prisma }) {
  return prisma.vote({ id }).user()
}

module.exports = {
  link,
  user,
}