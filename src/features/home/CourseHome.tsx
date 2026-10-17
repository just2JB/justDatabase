import { additionalCourses } from "./courses";
import { Icon } from "../../shared/components/StudyComponents";

export function CourseHeader({
  course,
}: {
  course: "home" | "algorithm" | (typeof additionalCourses)[number]["id"];
}) {
  return (
    <header className="course-header">
      <a className="study-brand" href="/">
        just<span>Study</span>
      </a>
      <nav aria-label="과목 선택">
        <a href="/" aria-current={course === "home" ? "page" : undefined}>
          홈
        </a>
        <a href="?course=database">데이터베이스</a>
        <a
          href="?course=algorithm"
          aria-current={course === "algorithm" ? "page" : undefined}>
          컴퓨터 알고리즘
        </a>
        {additionalCourses.map((item) => (
          <a
            key={item.id}
            href={`?course=${item.id}`}
            aria-current={course === item.id ? "page" : undefined}>
            {item.title}
          </a>
        ))}
      </nav>
    </header>
  );
}

export default function CourseHome() {
  return (
    <main id="main" className="course-main page-enter">
      <div className="course-card-grid">
        <a className="course-card database-card" href="?course=database">
          <div className="course-card-top">
            <span className="course-symbol">
              <Icon kind="database" />
            </span>
            <span className="course-tag">학습 · 실습 · 문제 풀이</span>
          </div>
          <span className="course-eyebrow">DATABASE</span>
          <h2>데이터베이스</h2>
          <p>
            데이터의 의미부터 관계 데이터 모델과 SQL까지.
            <br />
            릴레이션과 질의 결과를 직접 살펴봅니다.
          </p>
          <div className="course-chips">
            <span>관계 데이터 모델</span>
            <span>SQL</span>
            <span>무결성</span>
          </div>
          <strong className="course-card-link">
            공부 시작하기 <Icon kind="arrow" />
          </strong>
        </a>
        <a className="course-card algorithm-card" href="?course=algorithm">
          <div className="course-card-top">
            <span className="course-symbol">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true">
                <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18" />
              </svg>
            </span>
            <span className="course-tag">Python 실행 · 과제 연습</span>
          </div>
          <span className="course-eyebrow">COMPUTER ALGORITHM</span>
          <h2>컴퓨터 알고리즘</h2>
          <p>
            문제를 해결하는 방법과 알고리즘의 효율성.
            <br />
            Python 코드를 작성하고 결과를 확인합니다.
          </p>
          <div className="course-chips">
            <span>복잡도 분석</span>
            <span>정렬·탐색</span>
            <span>재귀</span>
          </div>
          <strong className="course-card-link">
            공부 시작하기 <Icon kind="arrow" />
          </strong>
        </a>
        {additionalCourses.map((item) => (
          <a className="course-card" key={item.id} href={`?course=${item.id}`}>
            <div className="course-card-top">
              <span className="course-symbol">
                <Icon kind={item.icon} />
              </span>
              <span className="course-tag">{item.id === 'engineering-project' ? '개념 · 예제 · 직접 체험' : '학습 내용 준비 중'}</span>
            </div>
            <span className="course-eyebrow">{item.english}</span>
            <h2>{item.title}</h2>
            <p>
              {item.id === 'engineering-project' ? 'AI 개발 패러다임부터 명세·설계까지.' : '수업 자료와 학습 내용을 정리할 공간입니다.'}
              <br />
              {item.id === 'engineering-project' ? '1~7주차 개념을 라면 앱 예제로 이해합니다.' : '아직 등록된 수업 자료가 없습니다.'}
            </p>
            <strong className="course-card-link">
              {item.id === 'engineering-project' ? '공부 시작하기' : '과목 둘러보기'} <Icon kind="arrow" />
            </strong>
          </a>
        ))}
      </div>
    </main>
  );
}
