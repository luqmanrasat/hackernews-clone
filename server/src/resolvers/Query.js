function info() {
  return `This is the API of a Hackernews Clone`
}

async function feed(root, { filter, skip, first, orderBy }, { prisma }){
  const where = filter ? {
    OR: [
      { description_contains: filter },
      { url_contains: filter },
    ],
  } : {};
  const links = await prisma.links({
    where,
    skip,
    first,
    orderBy,
  });
  const count = await prisma.linksConnection({ where }).aggregate().count();

  return { links, count };
}

function link(root, { id }, { prisma }){
  return prisma.link({ id })
}

module.exports = {
  info,
  feed,
  link,
}