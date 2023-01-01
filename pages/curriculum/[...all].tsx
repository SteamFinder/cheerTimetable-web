import { Switch } from '@headlessui/react'
import Layout from 'components/common/Layout'
import TermSelect from 'components/TermSelect'
import {
  usePreference,
  usePreferenceDispatch,
} from 'contexts/preferenceContext'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Content } from '../../components/Content'
import { getTimetable } from '../../lib/api/getTimetable'
import { TERMS } from '../../constants'
import { CourseItem } from 'lib/types/CourseItem'

const TimetablePage = (props) => {
  const router = useRouter()
  const dispath = usePreferenceDispatch()
  const { show7DaysOnMobile } = usePreference()

  const [type, id] = (router.query.all || []) as string[]
  const { term = TERMS[0] } = router.query

  const { owner, courses } = props
  const title = router.isFallback
    ? '课表'
    : `${owner.label} ${owner.name}`

  const terms = Array.from(new Set(courses?.map((e) => e.term)))?.sort(
    (a: string, b: string) => b.localeCompare(a)
  )

  useEffect(() => {
    if (!terms.length) return
    if (!router.query.term) {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, term: terms?.[0] },
        },
        undefined,
        { shallow: true }
      )
    }
  }, [])

  return (
    <Layout
      title={title}
      menuItems={
        (process.browser && (
          <>
            <TermSelect terms={terms} />
            {show7DaysOnMobile}
            <div className="flex items-center justify-between">
              <div className="text-gray-700">展示7天</div>
              <Switch
                checked={show7DaysOnMobile}
                onChange={(v) => {
                  dispath({ type: `SHOW_7_DAYS_ON_MOBILE`, payload: v })
                }}
                className={`${show7DaysOnMobile ? 'bg-blue-500' : 'bg-blue-200'}
          relative inline-flex h-[24px] w-[48px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">展示7天</span>
                <span
                  aria-hidden="true"
                  className={`${
                    show7DaysOnMobile ? 'translate-x-6' : 'translate-x-0'
                  }
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>
          </>
        )) ||
        null
      }
      sidebarContent={<>{process.browser && <TermSelect terms={terms} />}</>}
    >
      {(!router.isFallback || (router.isFallback && router.isReady)) && (
        <>
          <div className="mb-2 flex flex-col items-center overflow-y-auto">
            {process.browser && courses && (
              <Content
                // https://nextjs.org/docs/basic-features/data-fetching/get-static-paths#how-does-getstaticprops-run-with-regards-to-getstaticpaths
                // getStaticProps runs in the background when using fallback: true
                courses={courses.filter((e) => e.term === term)}
                icsUrl={`${window.location.origin}/api/ical/${type}/${id}/${term}.ics`}
                title={title}
              />
            )}
          </div>
        </>
      )}
    </Layout>
  )
}

export async function getStaticProps(context) {
  const { all } = context.params
  const [type, id] = all

  const { courses, owner } = await getTimetable(type, id)

  return {
    props: {
      courses: JSON.parse(JSON.stringify(courses)) as CourseItem[],
      owner,
    },
    revalidate: 60 * 60 * 48,
  }
}

export async function getStaticPaths() {
  const paths = [
    {
      all: ['student', '8305180722'],
    },
  ].map((e) => ({ params: e }))

  return { paths, fallback: true }
}

export default TimetablePage
