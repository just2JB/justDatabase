const names = ['김하늘','이서준','박민서']
export default function RelationPropertyVisual({ property }: { property: number }) {
  const leftRows = property===3 ? [['101','010-1111, 010-2222']] : names.map((name,index)=>[String(101+index),name])
  const rightRows = property===0 ? [...leftRows,leftRows[0]] : property===1 ? [...leftRows].reverse() : property===2 ? leftRows.map(row=>[row[1],row[0]]) : [['101','010-1111'],['101','010-2222']]
  const leftColumns = property===3 ? ['학생번호','연락처'] : ['학생번호','이름']
  const rightColumns = property===2 ? ['이름','학생번호'] : leftColumns
  const labels = [['서로 다른 투플','동일 투플을 추가하려는 경우'],['원래 표시 순서','표시 순서를 뒤집어도 같은 릴레이션'],['원래 열 배치','열의 이름과 값을 함께 옮긴 배치'],['한 칸에 연락처 두 개 · 부적절','연락처 릴레이션 · 한 칸에 한 값']][property]
  return <>
    <div className="relation-property-scene" key={property}>
      {[[leftColumns,leftRows],[rightColumns,rightRows]].map(([columns,rows],side)=><div key={side}><h5>{labels[side]}</h5><div className="table-wrap"><table><caption className="sr-only">{labels[side]}</caption><thead><tr>{(columns as string[]).map(column=><th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{(rows as string[][]).map((row,index)=><tr key={index} className={property===0&&side===1&&[0,3].includes(index)||property===3&&side===0?'property-bad':property===3&&side===1?'property-good':''}>{row.map((value,col)=><td key={col}>{value}</td>)}</tr>)}</tbody></table></div></div>)}
      <span aria-hidden="true">→</span>
    </div>
    <p className="property-explanation">{[
      '빨간 두 행은 모든 속성 값이 같습니다. 이론적인 릴레이션은 같은 투플을 중복 원소로 갖지 않습니다. SQL 테이블은 선언한 제약에 따라 중복을 허용할 수 있으므로 구별하세요.',
      '학생번호와 이름의 짝은 그대로입니다. 단순한 표시 순서가 바뀌어도 투플 집합은 같습니다. SQL 결과를 특정 순서로 보려면 ORDER BY를 사용합니다.',
      '열 이름과 그 아래 값이 함께 이동했습니다. 속성의 의미가 유지되면 표시 위치가 달라도 같은 관계를 표현합니다. 값만 바꾸는 것과 다릅니다.',
      '연락처를 별도 릴레이션의 두 투플로 표현했습니다. 이 예의 연락처 기본키는 (학생번호, 연락처)의 조합으로 정하므로 학생번호 101의 반복은 허용됩니다.',
    ][property]}</p>
  </>
}
