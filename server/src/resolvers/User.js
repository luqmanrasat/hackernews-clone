function links(root, args, { prisma }) {
  return prisma.user({ id: root.id }).links()
}

module.exports = {
  links,
}