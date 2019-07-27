function info() {
  return `This is the API of a Hackernews Clone`
}

function feed(root, args, { prisma }){
  return prisma.links()
}

function link(root, args, { prisma }){
  return prisma.link({ id: args.id })
}

module.exports = {
  info,
  feed,
  link,
}