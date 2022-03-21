import { prisma } from './seed';


async function clearStorage() {
  await prisma.tuition.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.subject.deleteMany({});
}