import { sampleTables } from '../data/sqlLessonData'
import { SqlTable } from '../components/SqlLessonParts'

const tableNotes = [
  { name: 'Book', role: '도서의 기본 정보', key: 'bookid', detail: 'price는 책의 정가입니다.' },
  { name: 'Customer', role: '고객의 기본 정보', key: 'custid', detail: '주소 조건은 address에서 확인합니다.' },
  { name: 'Orders', role: '누가 어떤 책을 얼마에 샀는지 기록', key: 'orderid', detail: 'saleprice는 실제 판매가격입니다.' },
]

export default function SqlTablesPage() {
  return <section className="sql-tables-page" aria-labelledby="sql-tables-title">
    <div className="sql-table-relation" aria-label="테이블 연결 관계">
      <span>Customer.custid</span><strong>↔</strong><span>Orders.custid</span>
      <span>Orders.bookid</span><strong>↔</strong><span>Book.bookid</span>
    </div>
    <div className="sql-table-notes">{tableNotes.map(item => <article key={item.name}><h2>{item.name}</h2><p>{item.role}</p><dl><div><dt>기본키</dt><dd>{item.key}</dd></div><div><dt>기억하기</dt><dd>{item.detail}</dd></div></dl></article>)}</div>
    {sampleTables.map(table => <article className="sql-source-table" key={table.name}>
      <div><h2>{table.name}</h2><span>{table.result.rows.length}행</span></div>
      <SqlTable data={table.result} caption={`${table.name} 원본 데이터`} />
    </article>)}
    <p className="visual-caption">SQL 문제 실행기에 들어 있는 마당서점 원본 데이터입니다. Book.price는 정가, Orders.saleprice는 실제 판매가격으로 서로 다릅니다.</p>
  </section>
}
