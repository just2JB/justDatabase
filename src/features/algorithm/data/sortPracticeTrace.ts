export type SortPracticeFrame = {
  values: (number | string)[]; round: number; done: boolean; text: string
  focus?: number[]; fixed?: number; held?: number; move?: [number, number]
}

export function sortPracticeTrace(input: number[], method: 'selection' | 'insertion'): SortPracticeFrame[] {
  const a = [...input]
  const frames: SortPracticeFrame[] = [{ values: [...a], round: 0, done: false, text: '입력 배열입니다. 다음을 눌러 1회전을 시작하세요.' }]
  if (method === 'selection') {
    for (let i = 0; i < a.length - 1; i++) {
      let least = i
      frames.push({ values: [...a], round: i+1, done: false, fixed: i, focus: [i], text: `${i+1}회전: 인덱스 ${i}부터 끝까지 최솟값을 찾습니다. 현재 후보는 ${a[least]}입니다.` })
      for (let j = i+1; j < a.length; j++) {
        const previous = least
        const smaller = a[j] < a[least]
        const text = `${a[j]}와 현재 최솟값 ${a[least]} 비교: ${smaller ? `${a[j]}가 더 작아 후보를 인덱스 ${j}로 바꿉니다.` : '더 작지 않으므로 후보를 유지합니다.'}`
        if (smaller) least = j
        frames.push({ values: [...a], round: i+1, done: false, fixed: i, focus: [previous, j], text })
      }
      const first = a[i], minimum = a[least]
      ;[a[i], a[least]] = [a[least], a[i]]
      frames.push({ values: [...a], round: i+1, done: true, fixed: i === a.length-2 ? a.length : i+1, focus: [i, least], move: i === least ? undefined : [least, i], text: `${i+1}회전 완료: ${i === least ? '최솟값이 이미 제자리여서 교환하지 않습니다. 배열이 그대로여도 1회전입니다.' : `최솟값 ${minimum}와 맨 앞 ${first}을 교환합니다.`} 표의 ${i+1}회전에는 현재 전체 배열을 적습니다.` })
    }
  } else {
    for (let i = 1; i < a.length; i++) {
      const key = a[i]
      let j = i-1
      const view = (): (number|string)[] => { const values: (number|string)[] = [...a]; values[j+1] = '빈칸'; return values }
      frames.push({ values: view(), round: i, done: false, fixed: 0, held: key, focus: [i], text: `${i}회전: 인덱스 ${i}의 ${key}를 key로 따로 보관합니다. 앞쪽 정렬 구간에 넣을 자리를 찾습니다.` })
      while (j >= 0) {
        frames.push({ values: view(), round: i, done: false, held: key, focus: [j], text: `${a[j]}와 key ${key} 비교: ${a[j] > key ? '앞의 값이 더 커서 오른쪽으로 밀어야 합니다.' : 'key보다 크지 않으므로 여기서 멈춥니다. 같은 값도 밀지 않습니다.'}` })
        if (a[j] <= key) break
        const from = j, moved = a[j]
        a[j+1] = a[j]
        j--
        frames.push({ values: view(), round: i, done: false, held: key, focus: [from+1], move: [from, from+1], text: `${moved}를 인덱스 ${from}에서 ${from+1}로 한 칸 밉니다. 빈칸이 왼쪽으로 옮겨졌습니다.` })
      }
      a[j+1] = key
      frames.push({ values: [...a], round: i, done: true, fixed: i+1, focus: [j+1], text: `${i}회전 완료: 보관한 key ${key}를 인덱스 ${j+1}에 넣습니다. 표의 ${i}회전에는 현재 전체 배열을 적습니다.` })
    }
  }
  return frames
}
