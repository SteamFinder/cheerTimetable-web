import _ from 'lodash'
import prisma from '../../lib/prisma'

const { map, mapKeys } = _

export async function searchOwner(name: string) {
  const students = prisma.student.findMany({
    where: { name: { equals: name } },
    orderBy: { grade: 'desc' },
  })

  const teachers = prisma
    .$transaction([
      prisma.teacher.findMany({
        where: {
          name: { equals: name },
        },
        orderBy: {
          facultyName: 'desc',
        },
      }),
      prisma.teacher.findMany({
        where: {
          name: {
            contains: name + '（',
          },
        },
        orderBy: {
          facultyName: 'desc',
        },
      }),
    ])
    .then((e) => e.flat())

  const locations = prisma.location.findMany({
    where: {
      name: { contains: name },
    },
    orderBy: {
      building: 'desc',
    },
  })

  const subjects = prisma.subject.findMany({
    where: {
      name: { contains: name },
    },
    orderBy: {
      credit: 'desc',
    },
  })

  // todo: transaction 里面可以套 transaction 吗
  return await Promise.all([students, teachers, locations, subjects])
}