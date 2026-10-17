import type { AdditionalCourse } from './courses'

export default function CourseOverview({ course }: { course: AdditionalCourse }) {
  return <main id="main" className="course-main page-enter">
    <div className="home-intro">
      <span className="course-eyebrow">{course.english}</span>
      <h1>{course.title}</h1>
      <p>수업 자료와 학습 내용을 정리할 공간입니다.</p>
    </div>
    <section className="course-card" aria-labelledby="course-status" style={{ marginTop: 32 }}>
      <span className="course-tag">준비 중</span>
      <h2 id="course-status">학습 내용을 준비하고 있어요</h2>
      <p>아직 등록된 수업 자료가 없습니다. 자료가 추가되면 이곳에서 확인할 수 있어요.</p>
      <a className="course-card-link" href="/">전체 과목 보기 <span aria-hidden="true">→</span></a>
    </section>
  </main>
}
