import { useState } from 'react';
import Editor from '@monaco-editor/react';
import useRequest from '../../hooks/use-request';

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C', value: 'c' },
];

// Map our language values to Monaco Editor language identifiers
const MONACO_LANGUAGE_MAP = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c'
};

// Default code templates for each language
const DEFAULT_TEMPLATES = {
  javascript: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
  python: `def reverseString(str):
    return str[::-1]`,
  java: `public static String reverseString(String str) {
    return new StringBuilder(str).reverse().toString();
}`,
  cpp: `std::string reverseString(std::string str) {
    std::reverse(str.begin(), str.end());
    return str;
}`,
  c: `void reverseString(char* str) {
    int length = strlen(str);
    for (int i = 0; i < length / 2; i++) {
        char temp = str[i];
        str[i] = str[length - 1 - i];
        str[length - 1 - i] = temp;
    }
}`
};

export default function CodeExecutorPage() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_TEMPLATES.javascript);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/code-executor/execute',
    method: 'post',
    onSuccess: (data) => setResults(data.results),
  });

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_TEMPLATES[newLanguage]);
  };

  const runCode = async () => {
    setLoading(true);
    setResults(null);
    await doRequest({
      code,
      language,
      problemId: 'reverse-string',
    });
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto', padding: 24 }}>
      <h1 style={{ fontSize: 40 }}>Code Executor</h1>
      <div style={{ marginBottom: 24, fontSize: 18, backgroundColor: '#f0f8ff', padding: '16px', borderRadius: '8px', border: '1px solid #d1ecf1' }}>
        <b>💡 Instructions:</b> You only need to write the <code>reverseString</code> function. The system will automatically add the necessary boilerplate code (input/output handling) behind the scenes. Just focus on your algorithm!
      </div>
      <div style={{ marginBottom: 24, fontSize: 22 }}>
        <label>
          Language:{' '}
          <select value={language} onChange={e => handleLanguageChange(e.target.value)} style={{ fontSize: 20, padding: '6px 16px' }}>
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </label>
      </div>
      <Editor
        height="500px"
        language={MONACO_LANGUAGE_MAP[language]}
        value={code}
        onChange={setCode}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 20,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
      <br />
      <button onClick={runCode} disabled={loading} style={{ fontSize: 22, padding: '12px 36px', marginTop: 8 }}>
        {loading ? 'Running...' : 'Run Code'}
      </button>

      {errors && <div style={{ marginTop: 24, fontSize: 20 }}>{errors}</div>}
      {results && (
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 28 }}>Results</h3>
          {results.error && <div style={{ color: 'red', fontSize: 20 }}>{results.error}</div>}
          {results.testResults && (
            <ul>
              {results.testResults.map((tr, idx) => (
                <li key={idx} style={{ color: tr.passed ? 'green' : 'red', fontSize: 20, marginBottom: 12 }}>
                  <b>Test {idx + 1}:</b> {tr.passed ? 'Passed' : 'Failed'}
                  <br />
                  <small style={{ fontSize: 18 }}>
                    Input: {tr.input} | Expected: {tr.expectedOutput} | Output: {tr.actualOutput || tr.error}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 