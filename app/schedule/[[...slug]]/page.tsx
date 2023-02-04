import { getTimetable } from '@/lib/service/getTimetable'
import { OwnerType } from '@/lib/types/Owner'
import Schedule from '@/components/Timetable'
import dynamic from 'next/dynamic'

// https://beta.nextjs.org/docs/api-reference/segment-config#configrevalidate

// todo: 和 terms 合成一个
export default async function SchedulePage({ params }) {
  const { slug } = params
  const [type, id, term] = slug

  const { courses, owner, terms } = await getTimetable(
    type as OwnerType,
    id,
    term
  )
  return (
    <div className="bg-slate-50">
      {
        <Schedule
          terms={terms}
          title={owner?.label || '' + owner?.name}
          courses={courses}
          type={type}
          id={id}
        />
      }
    </div>
  )
}