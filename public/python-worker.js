// Python은 별도 작업 공간에서 실행해 화면 조작을 유지합니다.
let python;
self.onmessage = async ({ data }) => {
  try {
    if (!python) {
      self.postMessage({ type: 'loading' });
      const base = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/';
      importScripts(`${base}pyodide.js`);
      python = await loadPyodide({ indexURL: base });
    }
    self.postMessage({ type: 'started' });
    const namespace = python.toPy({ __name__: '__main__' });
    python.globals.set('_practice_code', data.code);
    python.globals.set('_practice_input', data.input);
    python.globals.set('_practice_namespace', namespace);
    // 출력량을 제한하고 input()에는 사용자가 미리 적은 줄을 공급합니다.
    const wrapper = `
import sys as _sys, io as _io, contextlib as _contextlib
class _LimitedOutput(_io.StringIO):
    def write(self, text):
        if self.tell() + len(text) > 50000:
            raise RuntimeError('출력이 너무 많습니다. 반복문과 print를 확인하세요.')
        return super().write(text)
_out = _LimitedOutput()
_err = _LimitedOutput()
_old_input = _sys.stdin
_sys.stdin = _io.StringIO(_practice_input)
try:
    with _contextlib.redirect_stdout(_out), _contextlib.redirect_stderr(_err):
        exec(compile(_practice_code, 'practice.py', 'exec'), _practice_namespace)
finally:
    _sys.stdin = _old_input
`;
    const start = performance.now();
    try {
      python.runPython(wrapper);
      self.postMessage({ type: 'done', output: python.runPython('_out.getvalue()'), error: python.runPython('_err.getvalue()'), milliseconds: performance.now() - start });
    } catch (error) {
      self.postMessage({ type: 'done', output: python.runPython('_out.getvalue()'), error: String(error) });
    } finally {
      namespace.destroy();
      python.globals.delete('_practice_namespace');
      python.globals.delete('_practice_code');
      python.globals.delete('_practice_input');
    }
  } catch (error) {
    self.postMessage({ type: 'failed', error: `Python 준비 또는 실행에 실패했습니다. 인터넷 연결을 확인하고 다시 실행해 주세요.\n${String(error)}` });
  }
};
