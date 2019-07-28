function links({ id }, args, { prisma }) {
  return prisma.user({ id }).links()
}

module.exports = {
  links,
}