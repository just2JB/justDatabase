type Column = { name: string; key?: 'PK' | 'FK' | 'PK·FK'; references?: { table: string; column: string } }
export type ExampleRelation = { id: string; name: string; columns: Column[]; rows: (string | number | null)[][]; note: string }
export type ExampleScenario = { id: string; title: string; description: string; relations: ExampleRelation[] }

export const relationScenarios: ExampleScenario[] = [
  { id: 'school', title: '학교: 학생이 과목을 수강하는 관계', description: '학생·학과·과목을 각각 저장하고, 수강 릴레이션이 학생과 과목을 연결합니다.', relations: [
    { id: 'department', name: '학과', columns: [{ name: '학과번호', key: 'PK' }, { name: '학과명' }], rows: [[10, '컴퓨터학과'], [20, '경영학과']], note: '학과번호가 각 학과를 유일하게 구별합니다.' },
    { id: 'student', name: '학생', columns: [{ name: '학생번호', key: 'PK' }, { name: '이름' }, { name: '학년' }, { name: '학과번호', key: 'FK', references: { table: 'department', column: '학과번호' } }], rows: [[101, '김하늘', 1, 10], [102, '이서준', 2, 20], [103, '박지우', 1, 10]], note: '이름이나 학년은 중복될 수 있습니다. 학과번호는 학과 릴레이션을 참조합니다.' },
    { id: 'course', name: '과목', columns: [{ name: '과목번호', key: 'PK' }, { name: '과목명' }, { name: '학점' }], rows: [['DB01', '데이터베이스', 3], ['AL01', '알고리즘', 3]], note: '과목명과 학점은 과목에 관한 속성입니다.' },
    { id: 'enrollment', name: '수강', columns: [{ name: '학생번호', key: 'PK·FK', references: { table: 'student', column: '학생번호' } }, { name: '과목번호', key: 'PK·FK', references: { table: 'course', column: '과목번호' } }, { name: '성적' }], rows: [[101, 'DB01', 'A'], [101, 'AL01', 'B'], [102, 'DB01', null]], note: '학생번호 + 과목번호를 복합 기본키로 정한 예시입니다. 한 학생·과목 조합은 한 번만 저장하며 성적 NULL은 아직 성적을 모르는 상태입니다.' },
  ] },
  { id: 'shop', title: '쇼핑: 고객이 상품을 주문하는 관계', description: '주문과 주문상품을 나누면 한 주문에 여러 상품을 담아도 각 칸에 하나의 값만 저장할 수 있습니다.', relations: [
    { id: 'customer', name: '고객', columns: [{ name: '고객번호', key: 'PK' }, { name: '고객명' }, { name: '연락처' }], rows: [['C01', '김하늘', '010-0000-1001'], ['C02', '이서준', null]], note: '연락처 NULL은 아직 연락처를 모른다는 뜻이며, 기본키인 고객번호는 NULL이 아닙니다.' },
    { id: 'product', name: '상품', columns: [{ name: '상품번호', key: 'PK' }, { name: '상품명' }, { name: '가격' }], rows: [['P01', '노트', 3000], ['P02', '펜', 1500], ['P03', '파일', 2000]], note: '가격이 같더라도 상품번호로 상품을 구별할 수 있습니다.' },
    { id: 'order', name: '주문', columns: [{ name: '주문번호', key: 'PK' }, { name: '고객번호', key: 'FK', references: { table: 'customer', column: '고객번호' } }, { name: '주문일' }], rows: [['O01', 'C01', '2026-10-01'], ['O02', 'C02', '2026-10-02']], note: '고객번호를 통해 누가 주문했는지 연결합니다.' },
    { id: 'order-item', name: '주문상품', columns: [{ name: '주문번호', key: 'PK·FK', references: { table: 'order', column: '주문번호' } }, { name: '상품번호', key: 'PK·FK', references: { table: 'product', column: '상품번호' } }, { name: '수량' }], rows: [['O01', 'P01', 2], ['O01', 'P02', 1], ['O02', 'P03', 3]], note: '주문번호 + 상품번호를 기본키로 정했습니다. O01의 두 상품을 하나의 칸에 넣지 않고 별도 투플로 저장합니다.' },
  ] },
  { id: 'library', title: '도서관: 책과 대출 기록의 관계', description: '책의 정보와 대출 기록은 서로 다른 개체의 데이터이므로 별도 릴레이션으로 저장합니다.', relations: [
    { id: 'book', name: '도서', columns: [{ name: '도서번호', key: 'PK' }, { name: '제목' }, { name: '저자' }], rows: [['B01', '데이터베이스 입문', '저자 A'], ['B02', '알고리즘 입문', '저자 B']], note: '이 예시에서는 도서번호로 대출 가능한 책을 구별합니다.' },
    { id: 'loan', name: '대출', columns: [{ name: '대출번호', key: 'PK' }, { name: '도서번호', key: 'FK', references: { table: 'book', column: '도서번호' } }, { name: '대출자' }, { name: '반납일' }], rows: [['L01', 'B01', '김하늘', '2026-10-05'], ['L02', 'B02', '이서준', null], ['L03', 'B01', '박지우', null]], note: 'B01은 서로 다른 대출 기록에서 참조할 수 있습니다. 이 예시에서 반납일 NULL은 아직 반납일이 정해지지 않은 상태입니다.' },
  ] },
]
