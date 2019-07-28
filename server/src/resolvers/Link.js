function postedBy({ id }, args, { prisma }) {
  return prisma.link({ id }).postedBy()
}

function votes({ id }, args, { prisma }) {
  return prisma.link({ id }).votes()
}

module.exports = {
  postedBy,
  votes,
}