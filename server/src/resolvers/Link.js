function postedBy(root, args, { prisma }) {
  return prisma.link({ id: root.id }).postedBy()
}

function votes(root, args, { prisma }) {
  return prisma.link({ id: root.id }).votes()
}

module.exports = {
  postedBy,
  votes,
}