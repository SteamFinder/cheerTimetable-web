import { TERMS } from '../constants'
import STUDENTS from '../_data/students.json'

const date = new Date()
export const getTermsByStudent = (id) => {
  const grade = id.slice(-6, -4)
  const year = String(date.getFullYear()).slice(2)

  if (!!grade && grade > '10' && grade < year) {
    const fullGrade = '20' + grade
    const yearNum = parseInt(fullGrade, 10)
    const startTerm = `${yearNum}-${yearNum + 1}-1`
    const endTerm = `${yearNum + 3}-${yearNum + 3 + 1}-2`
    const startIndex = TERMS.baseTerms.indexOf(startTerm)
    const endIndex = TERMS.baseTerms.indexOf(endTerm)

    // TERMS 按时间倒序
    return TERMS.baseTerms.slice(endIndex === -1 ? 0 : endIndex, startIndex + 1)
  } else {
    return TERMS.baseTerms
  }
}