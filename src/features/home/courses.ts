export const additionalCourses = [
  { id: 'engineering-project', icon: 'puzzle', title: '공학융합프로젝트', english: 'ENGINEERING CONVERGENCE PROJECT' },
  { id: 'ergonomics', icon: 'person', title: '인간공학', english: 'ERGONOMICS' },
] as const

export type AdditionalCourse = typeof additionalCourses[number]
