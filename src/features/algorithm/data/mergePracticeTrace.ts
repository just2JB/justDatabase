export type MergePracticeFrame = { values: number[]; round: number; done: boolean; text: string; left: number[]; right: number[]; merged: number[]; range?: [number, number] }

export function mergePracticeTrace(input: number[]): MergePracticeFrame[] {
  const a = [...input]
  const frames: MergePracticeFrame[] = [{ values: [...a], round: 0, done: false, text: '왼쪽 구간부터 원소 한 개까지 나눕니다. 두 정렬 구간을 합칠 때마다 한 번의 병합으로 셉니다.', left: [], right: [], merged: [] }]
  let completed = 0
  function visit(lo: number, hi: number) {
    if (hi-lo <= 1) return
    const mid = Math.floor((lo+hi)/2)
    visit(lo,mid)
    visit(mid,hi)
    const l = a.slice(lo,mid), r = a.slice(mid,hi), merged: number[] = []
    let i = 0, j = 0
    function record(text: string) { frames.push({ values: [...a], round: completed+1, done: false, text, left: l.slice(i), right: r.slice(j), merged: [...merged], range: [lo, hi-1] }) }
    record(`구간 [${lo}~${hi-1}]의 병합 시작: 왼쪽 [${l.join(', ')}], 오른쪽 [${r.join(', ')}]. 양쪽 첫 값을 비교합니다.`)
    while (i<l.length && j<r.length) {
      const takeLeft = l[i] <= r[j]
      record(`${l[i]}와 ${r[j]} 비교: ${l[i]===r[j] ? '같으므로 왼쪽 값을 먼저 선택합니다.' : `${takeLeft ? l[i] : r[j]}가 더 작습니다.`}`)
      const chosen = takeLeft ? l[i++] : r[j++]
      merged.push(chosen)
      record(`${chosen}를 병합 결과 뒤에 붙입니다. 전체 배열은 이번 병합이 끝나면 갱신합니다.`)
    }
    merged.push(...l.slice(i),...r.slice(j))
    i=l.length; j=r.length
    record('한쪽 구간이 비었으므로 남은 원소를 비교 없이 이어 붙입니다.')
    for (let k=0;k<merged.length;k++) a[lo+k]=merged[k]
    completed++
    frames.push({ values: [...a], round: completed, done: true, text: `${completed}회 병합 완료: 구간 [${lo}~${hi-1}]을 [${merged.join(', ')}]로 바꿨습니다. 표에는 지금의 전체 배열을 적습니다.`, left: [], right: [], merged: [...merged], range: [lo, hi-1] })
  }
  visit(0,a.length)
  return frames
}
