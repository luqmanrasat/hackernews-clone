function newLinkSubscribe(root, args, { prisma }) {
  return prisma.$subscribe.link({
    mutation_in: ['CREATED']
  }).node()
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: payload => payload,
}

function newVoteSubscribe(root, args, { prisma }) {
  return prisma.$subscribe.vote({
    mutation_in: ['CREATED']
  }).node()
}

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: payload => payload,
}

module.exports = {
  newLink,
  newVote,
}