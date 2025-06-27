import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import useRequest from '../../../hooks/use-request';
import buildClient from '../../../api/build-client';

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C', value: 'c' },
];

const MONACO_LANGUAGE_MAP = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c'
};

// Dynamic templates based on function name
const createDefaultTemplate = (language, functionName) => {
  const templates = {
    javascript: `function ${functionName}(input) {
  // Your code here
  return "";
}`,
    python: `def ${functionName}(input):
    # Your code here
    return ""`,
    java: `public static String ${functionName}(String input) {
    // Your code here
    return "";
}`,
    cpp: `std::string ${functionName}(std::string input) {
    // Your code here
    return "";
}`,
    c: `void ${functionName}(char* input) {
    // Your code here
}`
  };
  return templates[language] || templates.javascript;
};

export default function ProblemPage({ problem }) {
  const router = useRouter();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize code template when problem or language changes
  useEffect(() => {
    if (problem) {
      setCode(createDefaultTemplate(language, problem.functionName));
    }
  }, [language, problem]);

  const { doRequest, errors } = useRequest({
    url: '/api/coding/execute',
    method: 'post',
    onSuccess: (data) => setResults(data.results),
  });

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const runCode = async () => {
    setLoading(true);
    setResults(null);
    await doRequest({
      code,
      language,
      problemId: problem.id,
    });
    setLoading(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (!problem) {
    return (
      <div style={{ maxWidth: 1000, margin: '2rem auto', padding: 24, textAlign: 'center' }}>
        <h1>Problem not found</h1>
        <Link href="/coding">
          <button style={{ padding: '12px 24px', fontSize: 16 }}>
            ← Back to Problems
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: 24 }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, fontSize: 16 }}>
        <Link href="/coding" style={{ color: '#6366f1', textDecoration: 'none' }}>
          ← Back to Problems
        </Link>
      </div>

      {/* Problem Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
          <h1 style={{ fontSize: 36, margin: 0, color: '#111827' }}>
            {problem.title}
          </h1>
          <span style={{
            padding: '8px 16px',
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 600,
            backgroundColor: getDifficultyColor(problem.difficulty) + '20',
            color: getDifficultyColor(problem.difficulty),
            textTransform: 'uppercase'
          }}>
            {problem.difficulty}
          </span>
        </div>
        
        <p style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
          {problem.description}
        </p>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        
        {/* Left Column - Problem Details */}
        <div>
          {/* Examples */}
          {problem.examples && problem.examples.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>Examples</h3>
              {problem.examples.map((example, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 14 }}>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Input:</strong> <code>{example.input}</code>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <strong>Output:</strong> <code>{example.output}</code>
                    </div>
                    {example.explanation && (
                      <div style={{ color: '#6b7280', fontSize: 13 }}>
                        <strong>Explanation:</strong> {example.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Constraints */}
          {problem.constraints && problem.constraints.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>Constraints</h3>
              <ul style={{ paddingLeft: 20 }}>
                {problem.constraints.map((constraint, idx) => (
                  <li key={idx} style={{ marginBottom: 8, color: '#6b7280' }}>
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          <div style={{
            backgroundColor: '#f0f8ff',
            border: '1px solid #d1ecf1',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24
          }}>
            <div style={{ fontSize: 16 }}>
              <strong>💡 Instructions:</strong> Write the <code>{problem.functionName}</code> function. 
              The system will handle input/output automatically.
            </div>
          </div>
        </div>

        {/* Right Column - Code Editor */}
        <div>
          {/* Language Selector */}
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: 16, fontWeight: 600 }}>
                Language:{' '}
                <select 
                  value={language} 
                  onChange={e => handleLanguageChange(e.target.value)}
                  style={{ 
                    fontSize: 16, 
                    padding: '8px 12px',
                    marginLeft: 8,
                    borderRadius: 6,
                    border: '1px solid #d1d5db'
                  }}
                >
                  {LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </label>
            </div>
            
            <button 
              onClick={runCode} 
              disabled={loading}
              style={{
                fontSize: 16,
                padding: '12px 24px',
                backgroundColor: loading ? '#9ca3af' : '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 600
              }}
            >
              {loading ? 'Running...' : 'Run Code'}
            </button>
          </div>

          {/* Code Editor */}
          <Editor
            height="400px"
            language={MONACO_LANGUAGE_MAP[language]}
            value={code}
            onChange={setCode}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />

          {/* Error Display */}
          {errors && (
            <div style={{ 
              marginTop: 16, 
              padding: 12, 
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 6,
              color: '#dc2626',
              fontSize: 14
            }}>
              {errors}
            </div>
          )}

          {/* Results */}
          {results && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 20, marginBottom: 16 }}>Results</h3>
              {results.testResults && (
                <div>
                  {results.testResults.map((tr, idx) => (
                    <div key={idx} style={{
                      padding: 12,
                      marginBottom: 8,
                      borderRadius: 6,
                      border: '1px solid',
                      borderColor: tr.passed ? '#10b981' : '#ef4444',
                      backgroundColor: tr.passed ? '#f0fdf4' : '#fef2f2'
                    }}>
                      <div style={{ 
                        fontWeight: 600, 
                        color: tr.passed ? '#10b981' : '#ef4444',
                        marginBottom: 4
                      }}>
                        Test {idx + 1}: {tr.passed ? '✅ Passed' : '❌ Failed'}
                      </div>
                      <div style={{ fontSize: 14, fontFamily: 'monospace' }}>
                        <div>Input: {tr.input}</div>
                        <div>Expected: {tr.expectedOutput}</div>
                        <div>Output: {tr.actualOutput || tr.error}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Server-side data fetching
ProblemPage.getInitialProps = async (context, client) => {
  const { problemId } = context.query;
  
  try {
    const { data } = await client.get(`/api/coding/problem/${problemId}`);
    return { problem: data };
  } catch (error) {
    return { problem: null };
  }
};