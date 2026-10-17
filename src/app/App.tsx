import { additionalCourses } from '../features/home/courses'
import CourseOverview from '../features/home/CourseOverview'
import { lazy, Suspense, useEffect } from 'react'
import CourseHome, { CourseHeader } from '../features/home/CourseHome'
import AlgorithmPage from '../features/algorithm/pages/AlgorithmPage'

const DatabaseApp = lazy(() => import('../features/database/DatabaseApp'))
const EngineeringCourse = lazy(() => import('../features/engineering/EngineeringCourse'))

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const course = params.get('course')
  const additionalCourse = additionalCourses.find(item => item.id === course)
  // 기존 단원·문제 풀이 주소도 데이터베이스 페이지로 연결합니다.
  const database = course === 'database' || (!course && params.has('page'))
  useEffect(() => {
    if (!database) document.title = `${course === 'algorithm' ? '컴퓨터 알고리즘' : additionalCourse?.title ?? '학습 홈'} · justStudy`
  }, [course, database, additionalCourse])
  if (database) return <Suspense fallback={<div className="course-loading" role="status">학습 페이지를 불러오고 있어요.</div>}><DatabaseApp /></Suspense>
  if (course === 'algorithm') return <AlgorithmPage />
  if (course === 'engineering-project') return <Suspense fallback={<div className="course-loading" role="status">학습 내용을 불러오고 있어요.</div>}><EngineeringCourse /></Suspense>
  return <div className="course-shell"><a className="skip-link" href="#main">본문으로 이동</a><CourseHeader course={additionalCourse?.id ?? 'home'} />{additionalCourse ? <CourseOverview course={additionalCourse} /> : <CourseHome />}</div>
}
