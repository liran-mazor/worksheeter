import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import useRequest from '../../../hooks/use-request';

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' }
];

const MONACO_LANGUAGE_MAP = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp'
};

const createDefaultTemplate = (language, functionName) => {
  const templates = {
    javascript: `function ${functionName}() {\n    // Your code here\n    \n}`,
    python: `def ${functionName}():\n    # Your code here\n    pass`,
    java: `public class Solution {\n    public returnType ${functionName}() {\n        // Your code here\n        \n    }\n}`,
    cpp: `class Solution {\npublic:\n    returnType ${functionName}() {\n        // Your code here\n        \n    }\n};`
  };
  return templates[language] || templates.javascript;
};

export default function ProblemPage({ problem }) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [editorRef, setEditorRef] = useState(null);

  useEffect(() => {
    if (problem?.functionName) {
      setCode(createDefaultTemplate(language, problem.functionName));
    }
  }, [language, problem]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Update editor language when language changes
  useEffect(() => {
    if (editorRef) {
      const model = editorRef.getModel();
      if (model) {
        const monaco = window.monaco;
        if (monaco) {
          monaco.editor.setModelLanguage(model, MONACO_LANGUAGE_MAP[language]);
          // Force refresh to update syntax highlighting
          editorRef.updateOptions({});
          setTimeout(() => {
            editorRef.setValue(editorRef.getValue());
          }, 50);
        }
      }
    }
  }, [language, editorRef]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const { doRequest, errors: requestErrors } = useRequest({
    url: '/api/coding/execute',
    method: 'post',
    onSuccess: (response) => {
      setResults(response);
      setLoading(false);
    },
    onError: (err) => {
      setErrors(err);
      setLoading(false);
    }
  });

  const runCode = async () => {
    setLoading(true);
    setErrors(null);
    setResults(null);
    
    await doRequest({
      code,
      language,
      problemId: problem.id
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6366f1';
    }
  };

  if (!problem) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        color: '#1e293b',
        fontSize: '1.25rem'
      }}>
        Problem not found
      </div>
    );
  }

  return (
    <div 
      className={`coding-problem-page-root ${isVisible ? 'coding-problem-visible' : ''}`}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header Section */}
        <div 
          className="coding-problem-header-section"
          style={{
            background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.95) 0%, rgba(71, 85, 105, 0.9) 100%)',
            borderRadius: '24px',
            padding: '3rem 2rem',
            margin: '2rem 0 3rem 0',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                lineHeight: 1.2
              }}>
            {problem.title}
          </h1>
              <div style={{
            backgroundColor: getDifficultyColor(problem.difficulty) + '20',
            color: getDifficultyColor(problem.difficulty),
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: '2px solid ' + getDifficultyColor(problem.difficulty) + '40',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            {problem.difficulty}
                </div>
            </div>
            <p style={{
              fontSize: '1.25rem',
              lineHeight: 1.6,
              color: '#e2e8f0',
              marginLeft: '1rem'
            }}>
              {problem.description}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.8fr 1fr',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          
          {/* Left Panel - Code Editor */}
        <div>
            
            {/* Editor Header */}
            <div 
              className="coding-problem-editor-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.95), rgba(71, 85, 105, 0.9))',
                padding: '1.5rem',
                borderRadius: '20px 20px 0 0',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderBottom: 'none',
                boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
                color: '#f1f5f9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600',
                  color: '#f1f5f9',
                  fontSize: '1.3rem'
                }}>
                  <i className="fas fa-code" style={{ color: '#6366f1', fontSize: '1.25rem' }}></i>
                  Language:
                </label>
                <select 
                  value={language} 
                  onChange={e => handleLanguageChange(e.target.value)}
                  style={{ 
                    padding: '0.5rem 1rem',
                    border: '3px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.03))',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {LANGUAGES.map(l => (
                    <option 
                      key={l.value} 
                      value={l.value}
                      style={{
                        background: '#334155',
                        color: '#f1f5f9',
                        padding: '0.5rem'
                      }}
                    >
                      {l.label}
                    </option>
                  ))}
                </select>
            </div>
            
            <button 
              onClick={runCode} 
              disabled={loading}
              style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1.5rem',
                  background: loading 
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                    : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Running...
                  </>
                ) : (
                  <>
                    <i className="fas fa-play"></i>
                    Run Code
                  </>
                )}
            </button>
          </div>

          {/* Code Editor */}
            <div style={{
               border: '1px solid rgba(139, 92, 246, 0.3)',
              borderTop: 'none',
              borderRadius: '0 0 20px 20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
          <Editor
                key={language}
                height="700px"
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
                  fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
                  fontLigatures: true,
                  cursorBlinking: 'smooth',
                  renderLineHighlight: 'all',
                  semanticHighlighting: { enabled: true },
                  colorDecorators: true,
                  bracketPairColorization: { enabled: true },
                  suggest: {
                    enabled: true,
                    showKeywords: true,
                    showSnippets: true,
                  },
                  quickSuggestions: {
                    other: true,
                    comments: true,
                    strings: true
                  },
                  // Disable error detection - execution feedback handles errors
                  renderValidationDecorations: 'off',
                  showFoldingControls: 'mouseover',
                  smoothScrolling: true,
                  contextmenu: true,
                  mouseWheelZoom: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  autoIndent: 'full',
                  insertSpaces: true,
                  detectIndentation: true,
                  trimAutoWhitespace: true,
                  occurrencesHighlight: true,
                  selectionHighlight: true,
                  codeLens: false,
                  folding: true,
                  foldingHighlight: true,
                  unfoldOnClickAfterEndOfLine: true,
                  showUnused: false,
                  showDeprecated: false
                }}
                beforeMount={(monaco) => {
                  // DISABLE all error checking and validation
                  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                    noSemanticValidation: true,
                    noSyntaxValidation: true,
                    noSuggestionDiagnostics: true
                  });
                  
                  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                    noSemanticValidation: true,
                    noSyntaxValidation: true,
                    noSuggestionDiagnostics: true
                  });
                  
                  // Configure Monaco theme for syntax highlighting
                  monaco.editor.defineTheme('darkTheme', {
                    base: 'vs-dark',
                    inherit: true,
                    rules: [
                      { token: 'comment', foreground: '6A9955' },
                      { token: 'keyword', foreground: '569CD6' },
                      { token: 'string', foreground: 'CE9178' },
                      { token: 'number', foreground: 'B5CEA8' },
                      { token: 'regexp', foreground: 'D16969' },
                      { token: 'type', foreground: '4EC9B0' },
                      { token: 'class', foreground: '4EC9B0' },
                      { token: 'function', foreground: 'DCDCAA' },
                      { token: 'variable', foreground: '9CDCFE' },
                      { token: 'constant', foreground: '4FC1FF' },
                    ],
                    colors: {
                      'editor.background': '#1e1e1e',
                      'editor.foreground': '#d4d4d4',
                      'editorLineNumber.foreground': '#858585',
                      'editorLineNumber.activeForeground': '#c6c6c6',
                    }
                  });
                  monaco.editor.setTheme('darkTheme');
                }}
                onMount={(editor, monaco) => {
                  // Store editor reference for language updates
                  setEditorRef(editor);
                  
                  // Make monaco globally available
                  window.monaco = monaco;
                  
                  // Force language mode and highlighting
                  const model = editor.getModel();
                  if (model) {
                    monaco.editor.setModelLanguage(model, MONACO_LANGUAGE_MAP[language]);
                  }
                  
                  // Apply theme and trigger syntax highlighting
                  setTimeout(() => {
                    monaco.editor.setTheme('darkTheme');
                    editor.updateOptions({});
                    // Trigger a model change to force syntax highlighting
                    editor.setValue(editor.getValue());
                  }, 200);
                  
                  // Auto-apply syntax highlighting
                  const setupAutoSyntaxHighlighting = () => {
                    // Monaco token color mapping
                    const tokenColors = {
                      // Basic tokens
                      'mtk1': '#9cdcfe',     // Variables/identifiers - Light blue
                      'mtk2': '#569cd6',     // Keywords, operators (alternative)
                      'mtk3': '#ce9178',     // Strings (alternative)
                      'mtk4': '#6a9955',     // Comments (alternative)
                      'mtk5': '#ce9178',     // Strings - Orange
                      'mtk6': '#ffd700',     // Delimiters, punctuation - Gold/Yellow
                      'mtk7': '#6a9955',     // Comments
                      'mtk8': '#b5cea8',     // Numbers
                      'mtk9': '#9cdcfe',     // Variables, identifiers
                      'mtk10': '#d7ba7d',    // String escapes
                      'mtk11': '#569cd6',    // Keywords (function, let, const, etc.)
                      'mtk12': '#4fc1ff',    // Constants, boolean values
                      'mtk13': '#dcdcaa',    // Functions
                      'mtk14': '#4ec9b0',    // Types, classes
                      'mtk15': '#d4d4d4',    // Default text (alternative)
                      'mtk16': '#ff6b6b',    // Error tokens
                      'mtk17': '#ce9178',    // Strings
                      'mtk18': '#569cd6',    // Keywords (alternative)
                      'mtk19': '#9cdcfe',    // Variables (alternative)
                      'mtk20': '#dcdcaa',    // Functions (alternative)
                      'mtk21': '#4ec9b0',    // Types (alternative)
                      'mtk22': '#4ec9b0',    // Types, interfaces
                      'mtk23': '#d7ba7d',    // String interpolation
                      'mtk24': '#dcdcaa',    // Functions, methods
                      'mtk25': '#ffcb6b',    // Constants, enums
                      'mtk26': '#82aaff',    // Control flow (if, else, etc.)
                      'mtk27': '#c792ea',    // Storage modifiers (public, private)
                      'mtk28': '#f78c6c',    // Numbers (alternative)
                      'mtk29': '#89ddff',    // Operators
                      'mtk30': '#eeffff',    // Default (alternative)
                      
                      // Extended token types
                      'mtk31': '#ff79c6',    // Magenta for special keywords
                      'mtk32': '#50fa7b',    // Green for success/positive
                      'mtk33': '#ffb86c',    // Orange for warnings
                      'mtk34': '#8be9fd',    // Cyan for special identifiers
                      'mtk35': '#f1fa8c',    // Yellow for constants
                      'mtk36': '#bd93f9',    // Purple for special types
                      'mtk37': '#ff5555',    // Red for errors/dangerous
                      'mtk38': '#44475a',    // Dark gray for disabled
                      'mtk39': '#6272a4',    // Blue gray for metadata
                      'mtk40': '#f8f8f2',    // Off white for primary text
                      'mtk41': '#0066cc',    // Blue for links/references
                      'mtk42': '#00cc66',    // Green for success states
                      'mtk43': '#cc6600',    // Orange for warnings
                      'mtk44': '#6600cc',    // Purple for special
                      'mtk45': '#cc0066',    // Pink for emphasis
                      'mtk46': '#66cc00',    // Lime for nature/growth
                      'mtk47': '#0066ff',    // Bright blue for info
                      'mtk48': '#ff6600',    // Orange red for alerts
                      'mtk49': '#6666ff',    // Light purple for magic
                      'mtk50': '#66ffcc',    // Aqua for cool elements
                      
                      // Additional color variants
                      'mtk51': '#ff6b9d',    // Pink for special strings
                      'mtk52': '#6bff9d',    // Light green for nature
                      'mtk53': '#9d6bff',    // Light purple for mystical
                      'mtk54': '#ff9d6b',    // Peach for warm elements
                      'mtk55': '#6b9dff',    // Sky blue for air elements
                      'mtk56': '#9dff6b',    // Bright lime for energy
                      'mtk57': '#ff6b6b',    // Coral for attention
                      'mtk58': '#6bffff',    // Cyan for water elements
                      'mtk59': '#ffff6b',    // Bright yellow for sun
                      'mtk60': '#ff6bff',    // Bright magenta for magic
                    };
                    
                    // Function to apply colors to all Monaco spans
                    function applyColors() {
                      const monacoEditor = document.querySelector('.monaco-editor');
                      if (!monacoEditor) return 0;
                      
                      const spans = monacoEditor.querySelectorAll('.view-line span[class*="mtk"]');
                      let fixed = 0;
                      
                      spans.forEach(span => {
                        const classes = span.className.split(' ');
                        const mtkClasses = classes.filter(cls => cls.startsWith('mtk') && cls !== 'mtkb' && cls !== 'mtki');
                        
                        for (const mtkClass of mtkClasses) {
                          if (tokenColors[mtkClass]) {
                            span.style.setProperty('color', tokenColors[mtkClass], 'important');
                            fixed++;
                            break;
                          }
                        }
                      });
                      
                      return fixed;
                    }
                    
                    // Apply colors immediately after Monaco fully renders
                    const applyWithDelay = (delay = 50) => {
                      setTimeout(applyColors, delay);
                    };
                    
                    // Initial application with delays for Monaco rendering
                    applyWithDelay(300);
                    applyWithDelay(600);
                    applyWithDelay(1000);
                    
                    // Set up observer to reapply when DOM changes
                    const monacoContainer = document.querySelector('.monaco-editor');
                    if (monacoContainer && !window.autoColorObserver) {
                      window.autoColorObserver = new MutationObserver(() => {
                        applyWithDelay(10);
                      });
                      
                      // Observe the Monaco editor and its parent
                      window.autoColorObserver.observe(monacoContainer, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['class']
                      });
                      
                      // Also observe the parent container
                      const parentContainer = monacoContainer.closest('div');
                      if (parentContainer) {
                        window.autoColorObserver.observe(parentContainer, {
                          childList: true,
                          subtree: true,
                          attributes: true,
                          attributeFilter: ['class']
                        });
                      }
                    }
                    
                    // Hook into editor events
                    if (editor) {
                      editor.onDidChangeModelContent(() => {
                        applyWithDelay(30);
                        applyWithDelay(100);
                      });
                      editor.onDidScrollChange(() => applyWithDelay(10));
                      editor.onDidChangeModel(() => {
                        applyWithDelay(100);
                        applyWithDelay(300);
                      });
                      editor.onDidChangeCursorPosition(() => applyWithDelay(20));
                      editor.onDidLayoutChange(() => applyWithDelay(50));
                    }
                    
                    // Set up periodic reapplication to ensure colors persist
                    if (!window.colorReapplicationInterval) {
                      window.colorReapplicationInterval = setInterval(() => {
                        const spanCount = document.querySelectorAll('.monaco-editor .view-line span[class*="mtk"]').length;
                        if (spanCount > 0) {
                          applyColors();
                        }
                      }, 2000);
                    }
                    
                    return applyColors;
                  };
                  
                  // Start automatic syntax highlighting
                  setTimeout(setupAutoSyntaxHighlighting, 600);
                  
                  // Auto-setup selection styling
                  const setupAutoSelectionStyling = () => {
                    // Function to apply selection styling via JavaScript
                    function styleSelections() {
                      const monacoEditor = document.querySelector('.monaco-editor');
                      if (!monacoEditor) return 0;
                      
                      // Find and style all selection elements
                      const selections = monacoEditor.querySelectorAll('.selected-text, .cslr, [class*="selected-text"]');
                      let styled = 0;
                      
                      selections.forEach(selection => {
                        selection.style.setProperty('background', '#ff6b35', 'important');
                        selection.style.setProperty('background-color', '#ff6b35', 'important');
                        selection.style.setProperty('opacity', '1', 'important');
                        styled++;
                      });
                      
                      return styled;
                    }
                    
                    // Apply styling with delay to catch selections
                    const styleWithDelay = (delay = 10) => {
                      setTimeout(styleSelections, delay);
                    };
                    
                    // Set up observer to catch new selections
                    const monacoEditor = document.querySelector('.monaco-editor');
                    if (monacoEditor && !window.autoSelectionObserver) {
                      window.autoSelectionObserver = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                          mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1 && node.classList) {
                              if (node.classList.contains('selected-text') || node.classList.contains('cslr')) {
                                node.style.setProperty('background', '#ff6b35', 'important');
                                node.style.setProperty('background-color', '#ff6b35', 'important');
                                node.style.setProperty('opacity', '1', 'important');
                              }
                            }
                          });
                        });
                        
                        // Also check for existing selections after DOM changes
                        styleWithDelay(10);
                      });
                      
                      window.autoSelectionObserver.observe(monacoEditor.closest('div'), {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['class', 'style']
                      });
                      
                    }
                    
                    // Hook into Monaco selection events
                    if (editor) {
                      editor.onDidChangeCursorSelection(() => styleWithDelay(20));
                      editor.onDidChangeModel(() => styleWithDelay(100));
                    }
                    
                    return styleSelections;
                  };
                  
                  // Start automatic selection styling
                  setTimeout(setupAutoSelectionStyling, 700);
                }}
              />
            </div>

          {/* Error Display */}
          {errors && (
            <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1rem',
                padding: '1rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                border: '2px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                color: '#dc2626'
              }}>
                <div style={{ fontSize: '1.25rem', color: '#ef4444' }}>
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
              {errors}
                </div>
            </div>
          )}

          </div>

          {/* Right Panel - Examples and Feedback */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Examples Section */}
            {problem.examples && problem.examples.length > 0 && (
              <div 
                className="coding-problem-examples-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.95), rgba(71, 85, 105, 0.9))',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#f1f5f9'
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: '#f1f5f9',
                    margin: 0
                  }}>
                    <i className="fas fa-lightbulb" style={{ color: '#6366f1', fontSize: '1.5rem' }}></i>
                    Examples
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {problem.examples.map((example, idx) => (
                    <div 
                      key={idx}
                      className="coding-problem-example-item"
                      style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.3))',
                        border: '2px solid rgba(99, 102, 241, 0.6)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: '600', color: '#f1f5f9', minWidth: '60px', fontSize: '1.1rem' }}>Input:</span>
                        <code style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          background: 'rgba(51, 65, 85, 0.3)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '1rem',
                          color: '#f1f5f9'
                        }}>{example.input}</code>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: '600', color: '#f1f5f9', minWidth: '60px', fontSize: '1.1rem' }}>Output:</span>
                        <code style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          background: 'rgba(51, 65, 85, 0.3)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '1rem',
                          color: '#f1f5f9'
                        }}>{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div style={{
                          paddingTop: '0.75rem',
                          borderTop: '1px solid rgba(99, 102, 241, 0.3)',
                          color: '#e2e8f0',
                          fontSize: '1.2rem'
                        }}>
                          <span style={{ fontWeight: '600', color: '#f1f5f9' }}>Explanation:</span>
                          <span style={{ marginLeft: '0.5rem' }}>{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Display Section */}
            {errors && (
              <div 
                className="coding-problem-error-section"
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.3))',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: '2px solid rgba(239, 68, 68, 0.7)',
                  color: '#f1f5f9',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <i className="fas fa-exclamation-triangle" style={{ color: '#ef4444', fontSize: '1.5rem' }}></i>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444', margin: 0 }}>
                    Execution Error
                  </h3>
                </div>
                <div style={{ fontSize: '1.1rem', lineHeight: 1.5 }}>
                  {Array.isArray(errors) ? (
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                      {errors.map((error, idx) => (
                        <li key={idx} style={{ marginBottom: '0.5rem' }}>{error.message}</li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: 0 }}>{errors}</p>
                  )}
                </div>
              </div>
            )}

            {/* Judge0 Feedback Section */}
            {results ? (
              <div 
                className="coding-problem-results-section"
                style={{
                  background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.95), rgba(71, 85, 105, 0.9))',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#f1f5f9'
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: '#f1f5f9',
                    margin: 0,
                    marginBottom: '1rem'
                  }}>
                    <i className={`fas ${results.overallStatus === 'passed' ? 'fa-check-circle' : 'fa-times-circle'}`} 
                       style={{ color: results.overallStatus === 'passed' ? '#10b981' : '#ef4444', fontSize: '1.5rem' }}></i>
                    Test Results
                  </h3>
                  {results.totalPassed !== undefined && results.totalFailed !== undefined && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1.5rem',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ color: '#10b981' }}>
                        <i className="fas fa-check" style={{ marginRight: '0.5rem' }}></i>
                        {results.totalPassed} Passed
                      </span>
                      <span style={{ color: '#ef4444' }}>
                        <i className="fas fa-times" style={{ marginRight: '0.5rem' }}></i>
                        {results.totalFailed} Failed
                      </span>
                      <span style={{ color: '#f1f5f9' }}>
                        Overall: <span style={{ color: results.overallStatus === 'passed' ? '#10b981' : '#ef4444' }}>
                          {results.overallStatus.toUpperCase()}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Global Error Display - Show only once if there's a common error */}
                {results.testResults && results.testResults.some(tr => tr.error) && (
                  <div style={{ 
                    marginBottom: '1.5rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.3))',
                    borderRadius: '12px',
                    border: '2px solid rgba(239, 68, 68, 0.7)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <i className="fas fa-exclamation-triangle" style={{ color: '#ef4444', fontSize: '1.25rem' }}></i>
                      <h4 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700', 
                        color: '#ef4444', 
                        margin: 0 
                      }}>
                        Runtime Error
                      </h4>
                    </div>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      background: 'rgba(239, 68, 68, 0.2)',
                      padding: '1rem',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      lineHeight: 1.4,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {results.testResults.find(tr => tr.error)?.error}
                    </div>
                  </div>
                )}

                {/* Test Cases Display */}
                {results.testResults && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {results.testResults.map((tr, idx) => (
                      <div 
                        key={idx}
                        className="coding-problem-test-result"
                        style={{
                          borderRadius: '12px',
                          padding: '1.5rem',
                          border: '2px solid',
                          transition: 'all 0.3s ease',
                          background: tr.passed 
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(5, 150, 105, 0.3))'
                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.4), rgba(220, 38, 38, 0.3))',
                          borderColor: tr.passed ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <span style={{ fontWeight: '600', color: '#f1f5f9', fontSize: '1.15rem' }}>Test {idx + 1}</span>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '600',
                            fontSize: '1rem',
                            color: tr.passed ? '#10b981' : '#ef4444'
                          }}>
                            {tr.passed ? (
                              <>
                                <i className="fas fa-check"></i>
                                Passed
                              </>
                            ) : (
                              <>
                                <i className="fas fa-times"></i>
                                Failed
                              </>
                            )}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontWeight: '600', color: '#f1f5f9', minWidth: '80px', fontSize: '1.05rem' }}>Input:</span>
                            <code style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              background: 'rgba(51, 65, 85, 0.3)',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '1rem',
                              color: '#f1f5f9',
                              flex: 1,
                              wordBreak: 'break-all'
                            }}>{tr.input}</code>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontWeight: '600', color: '#f1f5f9', minWidth: '80px', fontSize: '1.05rem' }}>Expected:</span>
                            <code style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              background: 'rgba(51, 65, 85, 0.3)',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '1rem',
                              color: '#f1f5f9',
                              flex: 1,
                              wordBreak: 'break-all'
                            }}>{tr.expectedOutput}</code>
                          </div>
                          {!tr.error && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ fontWeight: '600', color: '#f1f5f9', minWidth: '80px', fontSize: '1.05rem' }}>Output:</span>
                              <code style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                background: 'rgba(51, 65, 85, 0.3)',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                color: '#f1f5f9',
                                flex: 1,
                                wordBreak: 'break-all'
                              }}>{tr.actualOutput || 'No output'}</code>
                            </div>
                          )}
                          {(tr.executionTime || tr.memory) && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '0.5rem' }}>
                              {tr.executionTime && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <i className="fas fa-clock" style={{ color: '#6366f1', fontSize: '0.9rem' }}></i>
                                  <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                                    {tr.executionTime}s
                                  </span>
                                </div>
                              )}
                              {tr.memory && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <i className="fas fa-memory" style={{ color: '#6366f1', fontSize: '0.9rem' }}></i>
                                  <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                                    {tr.memory} KB
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="coding-problem-feedback-placeholder"
                style={{
                  background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.95), rgba(71, 85, 105, 0.9))',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#f1f5f9',
                  minHeight: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <i className="fas fa-code-branch" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#6366f1' }}></i>
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>Feedback will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Monaco Editor Fixes - All UI Elements */
        
        /* 1. Fix autocomplete/suggestions dropdown */
        .monaco-editor .suggest-widget {
          background: rgba(37, 37, 38, 0.95) !important;
          border: 1px solid #454545 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
          backdrop-filter: blur(8px) !important;
        }
        
        .monaco-editor .suggest-widget .monaco-list .monaco-list-row {
          background: transparent !important;
          color: #cccccc !important;
        }
        
        .monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused {
          background: rgba(14, 99, 156, 0.8) !important;
          color: white !important;
        }
        
        .monaco-editor .suggest-widget .monaco-list .monaco-list-row:hover {
          background: rgba(90, 93, 94, 0.5) !important;
        }
        
        .monaco-editor .suggest-widget .details {
          background: rgba(37, 37, 38, 0.95) !important;
          border-left: 1px solid #454545 !important;
          color: #cccccc !important;
        }
        
        /* 2. Fix text selection background - TARGET EXACT MONACO CLASSES */
        
        /* TARGET THE EXACT CLASSES: cslr selected-text */
        .monaco-editor .cslr.selected-text {
          background: #ff6b35 !important; /* Bright orange */
          background-color: #ff6b35 !important;
          opacity: 1 !important;
          display: block !important;
          visibility: visible !important;
        }
        
        /* Target all selected-text elements */
        .monaco-editor .selected-text {
          background: #ff6b35 !important;
          background-color: #ff6b35 !important;
          opacity: 1 !important;
        }
        
        /* Target cslr class specifically */
        .monaco-editor .cslr {
          background: #ff6b35 !important;
          background-color: #ff6b35 !important;
          opacity: 1 !important;
        }
        
        /* Handle all radius combinations */
        .monaco-editor .selected-text.top-left-radius,
        .monaco-editor .selected-text.bottom-left-radius,
        .monaco-editor .selected-text.top-right-radius,
        .monaco-editor .selected-text.bottom-right-radius {
          background: #ff6b35 !important;
          background-color: #ff6b35 !important;
        }
        
        /* Force override any inline styles */
        .monaco-editor div[class*="selected-text"] {
          background: #ff6b35 !important;
          background-color: #ff6b35 !important;
          opacity: 1 !important;
        }
        
        /* Selection styling fallbacks */
        .monaco-editor div[class*="cslr"],
        .monaco-editor .monaco-selection-layer .selection,
        .monaco-editor .view-overlay-widgets .current-selection,
        .monaco-editor .view-overlays .current-selection,
        .monaco-editor .view-overlays .selection {
          background: #ff6b35 !important;
          background-color: #ff6b35 !important;
          opacity: 1 !important;
        }
        
        .monaco-editor {
          --monaco-selection-background: #ff6b35 !important;
          --vscode-editor-selectionBackground: #ff6b35 !important;
          --vscode-editor-selectionHighlightBackground: #ff6b35 !important;
        }
        
        /* 3. Fix cursor/caret visibility */
        .monaco-editor .cursor {
          background: #ffffff !important;
          border-left: 2px solid #ffffff !important;
          opacity: 1 !important;
          animation: monaco-cursor-blink 1s linear infinite !important;
        }
        
        .monaco-editor .cursors-layer .cursor {
          background: #ffffff !important;
          width: 2px !important;
          opacity: 1 !important;
        }
        
        /* Cursor blink animation */
        @keyframes monaco-cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        /* Fix current line highlight */
        .monaco-editor .current-line {
          background: rgba(255, 255, 255, 0.04) !important;
        }
        
        /* Fix line numbers */
        .monaco-editor .line-numbers {
          color: rgba(133, 133, 133, 0.8) !important;
        }
        
        .monaco-editor .line-numbers.active-line-number {
          color: #c6c6c6 !important;
        }
        
        /* 4. Clean Editor - Hide All Error Indicators */
        .monaco-editor .view-overlays .current-line-error,
        .monaco-editor .view-overlays .error-decoration,
        .monaco-editor .margin .glyph-margin .codicon-error,
        .monaco-editor .margin .line-numbers .error-marker,
        .monaco-editor .squiggly-error,
        .monaco-editor .squiggly-warning,
        .monaco-editor .squiggly-info,
        .monaco-editor .view-overlays .monaco-error-decoration,
        .monaco-editor .decorationsOverviewRuler .error,
        .monaco-editor .decorationsOverviewRuler .warning,
        .monaco-hover,
        .monaco-hover-content {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Ensure Monaco editor is not affected by global styles */
        .monaco-editor,
        .monaco-editor .view-line,
        .monaco-editor .view-line span {
          color: inherit !important;
          background: inherit !important;
        }
      `}</style>
      
      <style jsx>{`
        .coding-problem-page-root {
          min-height: 100vh;
        }

        .coding-problem-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .coding-problem-test-cases-examples-card:hover {
          border-color: rgba(139, 92, 246, 0.5) !important;
        }

        .coding-problem-editor-header button:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669, #047857) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4) !important;
        }

        .coding-problem-test-result:hover {
          transform: translateY(-1px);
        }

        /* Language selector dropdown styling */
        .coding-problem-editor-header select option {
          background: #334155 !important;
          color: #f1f5f9 !important;
          padding: 0.5rem !important;
        }
        
        .coding-problem-editor-header select:focus {
          outline: none;
          border-color: rgba(99, 102, 241, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .coding-problem-page-root > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          
          .coding-problem-page-root > div > div:nth-child(2) > div:nth-child(2) {
            position: static !important;
          }
          
          .coding-problem-page-root > div {
            padding: 0 1rem !important;
          }
          
          .coding-problem-header-section h1 {
            font-size: 2rem !important;
          }
          
          .coding-problem-header-section > div {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
        }

        @media (max-width: 768px) {
          .coding-problem-editor-header {
            flex-direction: column !important;
            gap: 1rem !important;
            align-items: stretch !important;
          }
          
          .coding-problem-editor-header > div:first-child {
            justify-content: space-between !important;
          }
          
          .coding-problem-test-cases-examples-card,
          .coding-problem-constraints-card,
          .coding-problem-results-section {
            padding: 1.5rem !important;
          }
          
          .coding-problem-header-section {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

ProblemPage.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    if (context.res) {
      context.res.writeHead(302, { Location: '/auth/signup' });
      context.res.end();
    }
  }
  const { problemId } = context.query;
  
  try {
    const { data } = await client.get(`/api/coding/problem/${problemId}`);
    return { problem: data };
  } catch (error) {
    return { problem: null };
  }
};