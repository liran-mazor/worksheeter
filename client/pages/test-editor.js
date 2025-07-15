import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' }
];

const SAMPLE_CODE = {
  javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

// Test the function
const result = twoSum([2, 7, 11, 15], 9);
console.log("Result:", result);`,
  
  python: `def two_sum(nums, target):
    """
    Find two numbers in the array that add up to target
    """
    hash_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    return []

# Test the function
result = two_sum([2, 7, 11, 15], 9)
print(f"Result: {result}")`,

  java: `import java.util.*;

public class Solution {
    /**
     * Find two numbers in the array that add up to target
     */
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
    
    // Test method
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] result = solution.twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println("Result: " + Arrays.toString(result));
    }
}`,

  cpp: `#include <vector>
#include <unordered_map>
#include <iostream>

class Solution {
public:
    /**
     * Find two numbers in the array that add up to target
     */
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};

// Test the function
int main() {
    Solution solution;
    std::vector<int> nums = {2, 7, 11, 15};
    std::vector<int> result = solution.twoSum(nums, 9);
    std::cout << "Result: [" << result[0] << ", " << result[1] << "]" << std::endl;
    return 0;
}`
};

export default function TestEditor() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(SAMPLE_CODE.javascript);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    console.log('🔄 Language changed to:', language);
    setCode(SAMPLE_CODE[language]);
    
    // If editor exists, update its language model
    if (editorInstance) {
      console.log('🔧 Updating editor language model...');
      const model = editorInstance.getModel();
      if (model && window.monaco) {
        console.log('📝 Setting model language from', model.getLanguageId(), 'to', language);
        window.monaco.editor.setModelLanguage(model, language);
        
        // Force refresh
        setTimeout(() => {
          console.log('🔄 Forcing editor refresh...');
          editorInstance.updateOptions({});
        }, 100);
      }
    }
  }, [language, editorInstance]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: '#f1f5f9',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.95), rgba(71, 85, 105, 0.9))',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            marginBottom: '1rem'
          }}>
            Monaco Editor Test
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#e2e8f0',
            margin: 0
          }}>
            Testing syntax highlighting for different programming languages
          </p>
        </div>

        {/* Language Selector */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.95), rgba(71, 85, 105, 0.9))',
          borderRadius: '20px 20px 0 0',
          padding: '1.5rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderBottom: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            fontSize: '1.2rem'
          }}>
            <i className="fas fa-code" style={{ color: '#6366f1' }}></i>
            Language:
          </label>
          <select 
            value={language} 
            onChange={e => setLanguage(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              background: 'rgba(51, 65, 85, 0.8)',
              color: '#f1f5f9',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            {LANGUAGES.map(l => (
              <option 
                key={l.value} 
                value={l.value}
                style={{
                  background: '#334155',
                  color: '#f1f5f9'
                }}
              >
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Monaco Editor */}
        <div 
          id="monaco-container"
          style={{
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderTop: 'none',
            borderRadius: '0 0 20px 20px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Editor
            height="600px"
            language={language}
            value={code}
            onChange={setCode}
            theme="debug-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
              fontLigatures: true,
              wordWrap: 'on',
              cursorBlinking: 'smooth',
              renderLineHighlight: 'all',
              bracketPairColorization: { enabled: true },
              suggest: {
                enabled: true,
                showKeywords: true,
                showSnippets: true,
              },
              // DISABLE Error Detection - Clean editor experience
              renderValidationDecorations: 'off', // No error squiggles
              showUnused: false, // Don't show unused variables
              showDeprecated: false, // Don't show deprecated warnings
              codeLens: false // Disable code lens
            }}
            onMount={(editor, monaco) => {
              console.log('🚀 Monaco Editor mounted');
              console.log('📋 Current language prop:', language);
              console.log('🌍 Available languages:', monaco.languages.getLanguages().map(l => ({ id: l.id, aliases: l.aliases })));
              
              // DISABLE all error checking and validation - Clean editor experience
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
              
              // Store editor instance and make monaco globally available
              setEditorInstance(editor);
              window.monaco = monaco;
              
              // Log the model and its language
              const model = editor.getModel();
              if (model) {
                console.log('📄 Model language ID:', model.getLanguageId());
                console.log('📝 Model content preview:', model.getValue().substring(0, 100));
                console.log('🔤 Model total lines:', model.getLineCount());
              }

              // Check if tokenization is working
              setTimeout(() => {
                console.log('🎨 Checking tokenization after 1 second...');
                const model = editor.getModel();
                if (model) {
                  try {
                    // Get tokens for first few lines
                    for (let lineNumber = 1; lineNumber <= Math.min(5, model.getLineCount()); lineNumber++) {
                      const lineTokens = monaco.editor.tokenize(model.getLineContent(lineNumber), model.getLanguageId());
                      console.log(`🎯 Line ${lineNumber} tokens:`, lineTokens);
                    }
                  } catch (error) {
                    console.error('❌ Error getting tokens:', error);
                  }

                  // Check theme (fix the method call)
                  try {
                    console.log('🎭 Current theme data:', {
                      themeName: 'debug-dark',
                      monacoInstance: !!monaco,
                      editorInstance: !!editor
                    });
                  } catch (e) {
                    console.log('🎭 Theme check error:', e.message);
                  }
                  
                  // Check language services
                  const languageId = model.getLanguageId();
                  console.log('🔧 Language ID:', languageId);
                  console.log('🌍 Available languages:', monaco.languages.getLanguages().map(l => l.id).slice(0, 10));
                }
              }, 1000);

              // Check DOM elements
              setTimeout(() => {
                console.log('🔍 Checking DOM elements...');
                const editorElement = document.querySelector('.monaco-editor');
                if (editorElement) {
                  console.log('📐 Editor element found:', editorElement);
                  const viewLines = editorElement.querySelectorAll('.view-line');
                  console.log('📏 View lines found:', viewLines.length);
                  
                  if (viewLines.length > 0) {
                    const firstLine = viewLines[0];
                    console.log('🎨 First line HTML:', firstLine.innerHTML);
                    const spans = firstLine.querySelectorAll('span');
                    console.log('🏷️ Spans in first line:', spans.length);
                    spans.forEach((span, index) => {
                      const computedStyle = window.getComputedStyle(span);
                      console.log(`   Span ${index}:`, {
                        text: span.textContent,
                        className: span.className,
                        color: computedStyle.color,
                        backgroundColor: computedStyle.backgroundColor,
                        cssRules: {
                          fontWeight: computedStyle.fontWeight,
                          fontStyle: computedStyle.fontStyle
                        }
                      });
                      
                      // Check what CSS rules are being applied
                      if (span.className.includes('mtk')) {
                        console.log(`     🎨 CSS for .${span.className}:`);
                        // Try to get matching CSS rules
                        const allRules = Array.from(document.styleSheets).flatMap(sheet => {
                          try {
                            return Array.from(sheet.cssRules || sheet.rules || []);
                          } catch (e) {
                            return [];
                          }
                        });
                        
                        const matchingRules = allRules.filter(rule => {
                          if (rule.selectorText) {
                            return span.className.split(' ').some(cls => 
                              rule.selectorText.includes(`.${cls}`)
                            );
                          }
                          return false;
                        });
                        
                        matchingRules.forEach(rule => {
                          console.log(`       Rule: ${rule.selectorText} -> color: ${rule.style.color || 'none'}`);
                        });
                      }
                    });
                  }
                } else {
                  console.log('❌ Monaco editor element not found');
                }
              }, 2000);
              
              // AUTO-APPLY SYNTAX HIGHLIGHTING - No button required!
              const setupAutoSyntaxHighlighting = () => {
                console.log('🎨 Setting up automatic syntax highlighting...');
                
                // SUPER COMPREHENSIVE Monaco token color mapping - EXPANDED!
                const tokenColors = {
                  // Basic tokens - ENHANCED for better contrast
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
                  
                  // EXTENDED token types for even more colors
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
                  
                  // Even more variants for maximum color diversity
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
                  const monacoEditor = document.querySelector('#monaco-container .monaco-editor');
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
                  
                  if (fixed > 0) {
                    console.log(`✨ Auto-applied colors to ${fixed} spans`);
                  }
                  return fixed;
                }
                
                // Apply colors immediately after Monaco fully renders
                const applyWithDelay = (delay = 50) => {
                  setTimeout(applyColors, delay);
                };
                
                // Initial application
                applyWithDelay(500); // Give Monaco time to render
                
                // Set up observer to reapply when DOM changes
                const monacoContainer = document.querySelector('#monaco-container');
                if (monacoContainer && !window.autoColorObserver) {
                  window.autoColorObserver = new MutationObserver(() => {
                    applyWithDelay(10);
                  });
                  
                  window.autoColorObserver.observe(monacoContainer, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                  });
                }
                
                // Hook into editor events
                if (editor) {
                  editor.onDidChangeModelContent(() => applyWithDelay(30));
                  editor.onDidScrollChange(() => applyWithDelay(10));
                  
                  // Also apply when language changes
                  editor.onDidChangeModel(() => applyWithDelay(100));
                }
                
                return applyColors;
              };
              
              // Start automatic syntax highlighting
              setTimeout(setupAutoSyntaxHighlighting, 600);
              
              // AUTO-SETUP SELECTION STYLING (since CSS doesn't work due to specificity)
              const setupAutoSelectionStyling = () => {
                console.log('🎯 Setting up automatic selection styling...');
                
                // Function to apply selection styling via JavaScript
                function styleSelections() {
                  const editor = document.querySelector('#monaco-container .monaco-editor');
                  if (!editor) return 0;
                  
                  // Find and style all selection elements
                  const selections = editor.querySelectorAll('.selected-text, .cslr, [class*="selected-text"]');
                  let styled = 0;
                  
                  selections.forEach(selection => {
                    selection.style.setProperty('background', '#ff6b35', 'important');
                    selection.style.setProperty('background-color', '#ff6b35', 'important');
                    selection.style.setProperty('opacity', '1', 'important');
                    styled++;
                  });
                  
                  if (styled > 0) {
                    console.log(`🎨 Auto-styled ${styled} selections`);
                  }
                  return styled;
                }
                
                // Apply styling with delay to catch selections
                const styleWithDelay = (delay = 10) => {
                  setTimeout(styleSelections, delay);
                };
                
                // Set up observer to catch new selections
                const editor = document.querySelector('#monaco-container .monaco-editor');
                if (editor && !window.autoSelectionObserver) {
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
                  
                  window.autoSelectionObserver.observe(editor, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'style']
                  });
                  
                  console.log('👁️ Auto selection observer active');
                }
                
                // Hook into Monaco selection events
                if (editor) {
                  editor.onDidChangeCursorSelection?.(() => styleWithDelay(20));
                  
                  // Also hook into editor events
                  if (editorInstance) {
                    editorInstance.onDidChangeCursorSelection(() => styleWithDelay(20));
                    editorInstance.onDidChangeModel(() => styleWithDelay(100));
                  }
                }
                
                return styleSelections;
              };
              
              // Start automatic selection styling
              setTimeout(setupAutoSelectionStyling, 700);
            }}
            beforeMount={(monaco) => {
              console.log('🔧 Monaco before mount');
              console.log('🌍 Available languages before:', monaco.languages.getLanguages().map(l => l.id));
              
              // Define a custom theme for better debugging
              monaco.editor.defineTheme('debug-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                  { token: '', foreground: 'ffffff' }, // default text
                  { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                  { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
                  { token: 'string', foreground: 'CE9178' },
                  { token: 'number', foreground: 'B5CEA8' },
                  { token: 'regexp', foreground: 'D16969' },
                  { token: 'type', foreground: '4EC9B0' },
                  { token: 'class', foreground: '4EC9B0' },
                  { token: 'function', foreground: 'DCDCAA' },
                  { token: 'variable', foreground: '9CDCFE' },
                  { token: 'constant', foreground: '4FC1FF' },
                  { token: 'delimiter', foreground: 'D4D4D4' },
                  { token: 'operator', foreground: 'D4D4D4' },
                ],
                colors: {
                  'editor.background': '#1e1e1e',
                  'editor.foreground': '#d4d4d4',
                  'editorLineNumber.foreground': '#858585',
                  'editorLineNumber.activeForeground': '#c6c6c6',
                }
              });
              
              console.log('🎭 Custom theme defined');
            }}
          />
        </div>

                 {/* Debug Info */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.95), rgba(71, 85, 105, 0.9))',
          borderRadius: '20px',
          padding: '1.5rem',
          marginTop: '2rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#f1f5f9' }}>Debug Info</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <strong>Current Language:</strong> {language}
            </div>
            <div>
              <strong>Code Length:</strong> {code.length} characters
            </div>
            <div>
              <strong>Lines:</strong> {code.split('\n').length}
            </div>
          </div>
          
          {/* Debug Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                console.log('🔄 Force debugging...');
                if (editorInstance && window.monaco) {
                  const model = editorInstance.getModel();
                  if (model) {
                    console.log('🎯 Current model language:', model.getLanguageId());
                    console.log('🎭 Monaco editor instance:', editorInstance);
                    console.log('🎨 Monaco themes available:', window.monaco.editor._themes || 'Themes not accessible');
                    
                    // Get current editor theme
                    const editorElement = editorInstance.getDomNode();
                    const computedStyle = window.getComputedStyle(editorElement);
                    console.log('🖼️ Editor background color:', computedStyle.backgroundColor);
                    console.log('🖼️ Editor color:', computedStyle.color);
                    
                    // Force re-tokenization
                    console.log('🔄 Forcing re-tokenization...');
                    window.monaco.editor.setModelLanguage(model, language);
                    editorInstance.updateOptions({});
                    
                    // Get tokenization info
                    const lineCount = model.getLineCount();
                    console.log('📊 Total lines in model:', lineCount);
                    if (lineCount > 0) {
                      const firstLineTokens = window.monaco.editor.tokenize(model.getLineContent(1), language);
                      console.log('🎯 First line tokens:', firstLineTokens);
                    }
                    
                    // Check DOM again
                    setTimeout(() => {
                      const firstLine = document.querySelector('.view-line');
                      if (firstLine) {
                        console.log('🎨 Updated first line HTML:', firstLine.innerHTML);
                        const spans = firstLine.querySelectorAll('span');
                        spans.forEach((span, index) => {
                          const computedSpanStyle = window.getComputedStyle(span);
                          console.log(`Span ${index}:`, {
                            text: span.textContent,
                            className: span.className,
                            color: computedSpanStyle.color,
                            backgroundColor: computedSpanStyle.backgroundColor
                          });
                        });
                      }
                    }, 500);
                  }
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🔄 Force Re-tokenize
            </button>
            
            <button
              onClick={() => {
                console.log('🎨 Applying new theme...');
                if (window.monaco) {
                  window.monaco.editor.setTheme('debug-dark');
                  console.log('✅ Theme applied');
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🎭 Apply Theme
            </button>
            
            <button
              onClick={() => {
                console.log('🔍 Inspecting DOM...');
                const editor = document.querySelector('.monaco-editor');
                if (editor) {
                  const lines = editor.querySelectorAll('.view-line');
                  console.log('📏 Total lines in DOM:', lines.length);
                  lines.forEach((line, index) => {
                    if (index < 3) { // Log first 3 lines
                      console.log(`Line ${index + 1}:`, line.innerHTML);
                    }
                  });
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🔍 Inspect DOM
            </button>
            
            <button
              onClick={() => {
                console.log('💉 Injecting direct Monaco CSS...');
                
                // Remove existing Monaco override styles
                const existingStyle = document.getElementById('monaco-override-css');
                if (existingStyle) {
                  existingStyle.remove();
                }
                
                // Inject high-specificity CSS to override everything
                const style = document.createElement('style');
                style.id = 'monaco-override-css';
                style.textContent = `
                  /* High specificity Monaco overrides */
                  .monaco-editor .view-line .mtk1 { color: #d4d4d4 !important; } /* Default text */
                  .monaco-editor .view-line .mtk11 { color: #569cd6 !important; } /* Keywords */
                  .monaco-editor .view-line .mtk11.mtkb { color: #569cd6 !important; font-weight: bold !important; } /* Bold keywords */
                  .monaco-editor .view-line .mtk6 { color: #d4d4d4 !important; } /* Delimiters */
                  .monaco-editor .view-line .mtk17 { color: #ce9178 !important; } /* Strings */
                  .monaco-editor .view-line .mtk7 { color: #6a9955 !important; } /* Comments */
                  .monaco-editor .view-line .mtk8 { color: #b5cea8 !important; } /* Numbers */
                  .monaco-editor .view-line .mtk9 { color: #9cdcfe !important; } /* Variables */
                  .monaco-editor .view-line .mtk22 { color: #4ec9b0 !important; } /* Types */
                  .monaco-editor .view-line .mtk24 { color: #dcdcaa !important; } /* Functions */
                  
                  /* Override any conflicting global styles */
                  .monaco-editor .view-line span,
                  .monaco-editor .view-line span[class*="mtk"] {
                    color: inherit !important;
                    background: transparent !important;
                  }
                `;
                document.head.appendChild(style);
                console.log('✅ Direct CSS injected');
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              💉 Inject CSS
            </button>
            
            <button
              onClick={() => {
                console.log('🕵️ CSS Detective - Finding what\'s overriding...');
                
                const firstLine = document.querySelector('.view-line');
                if (firstLine) {
                  const keywordSpan = firstLine.querySelector('.mtk11');
                  if (keywordSpan) {
                    console.log('🎯 Analyzing keyword span (.mtk11)...');
                    console.log('📋 Element:', keywordSpan);
                    console.log('🏷️ Classes:', keywordSpan.className);
                    console.log('📍 Text:', keywordSpan.textContent);
                    
                    // Get ALL CSS rules that apply to this element
                    const computedStyle = window.getComputedStyle(keywordSpan);
                    console.log('🎨 Computed color:', computedStyle.color);
                    
                    // Try to find what's setting this color
                    console.log('🔍 Checking for inline styles...');
                    console.log('📝 Inline style:', keywordSpan.style.cssText || 'No inline styles');
                    
                    // Check parent styles
                    let parent = keywordSpan.parentElement;
                    let level = 0;
                    while (parent && level < 5) {
                      const parentStyle = window.getComputedStyle(parent);
                      console.log(`👆 Parent ${level} (${parent.tagName}.${parent.className}):`, {
                        color: parentStyle.color,
                        classes: parent.className
                      });
                      parent = parent.parentElement;
                      level++;
                    }
                    
                    // Try to force inline styles as ultimate override
                    console.log('💪 Trying inline style override...');
                    keywordSpan.style.setProperty('color', '#569cd6', 'important');
                    
                    setTimeout(() => {
                      const newComputedStyle = window.getComputedStyle(keywordSpan);
                      console.log('✅ After inline override:', newComputedStyle.color);
                    }, 100);
                  }
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🕵️ CSS Detective
            </button>
            
            <button
              onClick={() => {
                console.log('🔧 Starting Syntax Highlighter Fixer...');
                
                // Comprehensive Monaco token color mapping
                const tokenColors = {
                  // Basic tokens - ENHANCED for better contrast
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
                };
                
                // Function to apply colors to all Monaco spans
                function applyMonacoColors() {
                  const monacoEditor = document.querySelector('#monaco-container .monaco-editor');
                  if (!monacoEditor) return;
                  
                  // Find all token spans
                  const spans = monacoEditor.querySelectorAll('.view-line span[class*="mtk"]');
                  let fixed = 0;
                  let missed = [];
                  
                  spans.forEach(span => {
                    // Get ALL mtk classes from this span
                    const classes = span.className.split(' ');
                    const mtkClasses = classes.filter(cls => cls.startsWith('mtk'));
                    
                    let applied = false;
                    
                    // Try each mtk class until we find a color match
                    for (const mtkClass of mtkClasses) {
                      if (tokenColors[mtkClass]) {
                        span.style.setProperty('color', tokenColors[mtkClass], 'important');
                        fixed++;
                        applied = true;
                        break;
                      }
                    }
                    
                    // Track missed token classes
                    if (!applied && mtkClasses.length > 0) {
                      mtkClasses.forEach(cls => {
                        if (!missed.includes(cls) && cls !== 'mtkb' && cls !== 'mtki') {
                          missed.push(cls);
                        }
                      });
                    }
                  });
                  
                  console.log(`🎨 Fixed ${fixed} spans`);
                  if (missed.length > 0) {
                    console.log(`❌ Missed token classes:`, missed.join(', '));
                    console.log(`💡 Adding fallback colors for missed classes...`);
                    
                    // Apply fallback colors for missed classes
                    missed.forEach(missedClass => {
                      const fallbackColor = '#d4d4d4'; // Default text color
                      const missedSpans = monacoEditor.querySelectorAll(`.view-line span.${missedClass}`);
                      missedSpans.forEach(span => {
                        if (!span.style.color) {
                          span.style.setProperty('color', fallbackColor, 'important');
                        }
                      });
                    });
                  }
                  
                  return fixed;
                }
                
                // Apply colors immediately
                const initialFixed = applyMonacoColors();
                console.log(`✅ Initial fix: ${initialFixed} spans colored`);
                
                // Set up observer to watch for Monaco DOM changes
                const monacoContainer = document.querySelector('#monaco-container');
                if (monacoContainer && !window.monacoObserver) {
                  console.log('👁️ Setting up Monaco DOM observer...');
                  
                  window.monacoObserver = new MutationObserver((mutations) => {
                    let shouldReapply = false;
                    mutations.forEach((mutation) => {
                      if (mutation.type === 'childList' || 
                          (mutation.type === 'attributes' && mutation.attributeName === 'class')) {
                        shouldReapply = true;
                      }
                    });
                    
                    if (shouldReapply) {
                      setTimeout(applyMonacoColors, 10); // Small delay to let Monaco finish
                    }
                  });
                  
                  window.monacoObserver.observe(monacoContainer, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'style']
                  });
                  
                  console.log('✅ Monaco observer active');
                }
                
                // Also apply on scroll/resize (sometimes Monaco re-renders)
                const editor = editorInstance;
                if (editor) {
                  editor.onDidChangeModelContent(() => {
                    setTimeout(applyMonacoColors, 50);
                  });
                  
                  editor.onDidScrollChange(() => {
                    setTimeout(applyMonacoColors, 10);
                  });
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🔧 Fix Syntax Highlighting
            </button>
            
            <button
              onClick={() => {
                console.log('📊 Analyzing token distribution...');
                
                const monacoEditor = document.querySelector('#monaco-container .monaco-editor');
                if (!monacoEditor) return;
                
                const tokenStats = {};
                const colorStats = {};
                
                // Analyze all spans
                const spans = monacoEditor.querySelectorAll('.view-line span[class*="mtk"]');
                
                spans.forEach(span => {
                  const classes = span.className.split(' ');
                  const mtkClasses = classes.filter(cls => cls.startsWith('mtk'));
                  const computedColor = window.getComputedStyle(span).color;
                  
                  mtkClasses.forEach(mtkClass => {
                    if (mtkClass !== 'mtkb' && mtkClass !== 'mtki') {
                      tokenStats[mtkClass] = (tokenStats[mtkClass] || 0) + 1;
                      
                      if (!colorStats[mtkClass]) {
                        colorStats[mtkClass] = {
                          computedColor,
                          text: span.textContent.trim().substring(0, 10),
                          hasInlineStyle: span.style.color ? 'Yes' : 'No'
                        };
                      }
                    }
                  });
                });
                
                console.log('📈 Token class usage:');
                Object.entries(tokenStats)
                  .sort(([,a], [,b]) => b - a)
                  .forEach(([token, count]) => {
                    const info = colorStats[token];
                    console.log(`${token}: ${count} uses, Color: ${info.computedColor}, Example: "${info.text}", Inline: ${info.hasInlineStyle}`);
                  });
                
                console.log('\n🎨 Unique colors found:');
                const uniqueColors = [...new Set(Object.values(colorStats).map(s => s.computedColor))];
                uniqueColors.forEach(color => {
                  const tokens = Object.entries(colorStats)
                    .filter(([, info]) => info.computedColor === color)
                    .map(([token]) => token);
                  console.log(`${color}: ${tokens.join(', ')}`);
                });
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              📊 Analyze Tokens
            </button>
            
            <button
              onClick={() => {
                console.log('🔍 Selection Debug - Testing selection visibility...');
                
                if (editorInstance) {
                  // Force a selection programmatically for testing
                  const model = editorInstance.getModel();
                  if (model && model.getLineCount() > 0) {
                    const range = {
                      startLineNumber: 1,
                      startColumn: 1,
                      endLineNumber: 1,
                      endColumn: 8
                    };
                    
                    editorInstance.setSelection(range);
                    console.log('📝 Set selection on first 7 characters');
                    
                    setTimeout(() => {
                      // Check what selection elements exist
                      const editor = document.querySelector('#monaco-container .monaco-editor');
                      const selections = editor.querySelectorAll('.selected-text, .monaco-selection, .selection, .current-selection');
                      console.log('🎯 Found selection elements:', selections.length);
                      
                      selections.forEach((sel, index) => {
                        console.log(`Selection ${index}:`, {
                          className: sel.className,
                          style: sel.style.cssText,
                          computedStyle: window.getComputedStyle(sel).background
                        });
                      });
                      
                      // Check Monaco's selection layer
                      const selectionLayer = editor.querySelector('.monaco-selection-layer');
                      if (selectionLayer) {
                        console.log('🎨 Selection layer found:', selectionLayer);
                        const selections = selectionLayer.children;
                        console.log('🎯 Selections in layer:', selections.length);
                        
                        Array.from(selections).forEach((sel, index) => {
                          console.log(`Layer selection ${index}:`, {
                            className: sel.className,
                            style: sel.style.cssText,
                            computedBackground: window.getComputedStyle(sel).backgroundColor
                          });
                        });
                      }
                    }, 100);
                  }
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🔍 Debug Selection
            </button>
            
            <button
              onClick={() => {
                console.log('🔧 Force Selection Style - Direct JavaScript override...');
                
                // Function to apply selection styling via JavaScript
                function forceSelectionStyle() {
                  const editor = document.querySelector('#monaco-container .monaco-editor');
                  if (!editor) return;
                  
                  // Find and style all selection elements
                  const selections = editor.querySelectorAll('.selected-text, .cslr, [class*="selected-text"]');
                  let styled = 0;
                  
                  selections.forEach(selection => {
                    selection.style.setProperty('background', '#ff6b35', 'important');
                    selection.style.setProperty('background-color', '#ff6b35', 'important');
                    selection.style.setProperty('opacity', '1', 'important');
                    styled++;
                  });
                  
                  console.log(`🎨 Force-styled ${styled} selection elements`);
                  return styled;
                }
                
                // Apply styling immediately
                forceSelectionStyle();
                
                // Set up observer to catch new selections
                if (!window.selectionObserver) {
                  const editor = document.querySelector('#monaco-container .monaco-editor');
                  if (editor) {
                    window.selectionObserver = new MutationObserver((mutations) => {
                      mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                          if (node.nodeType === 1) { // Element node
                            if (node.classList && (node.classList.contains('selected-text') || node.classList.contains('cslr'))) {
                              console.log('🎯 New selection element detected:', node.className);
                              node.style.setProperty('background', '#ff6b35', 'important');
                              node.style.setProperty('background-color', '#ff6b35', 'important');
                              node.style.setProperty('opacity', '1', 'important');
                            }
                          }
                        });
                      });
                    });
                    
                    window.selectionObserver.observe(editor, {
                      childList: true,
                      subtree: true
                    });
                    
                    console.log('👁️ Selection observer started');
                  }
                }
                
                // Test with programmatic selection
                if (editorInstance) {
                  const model = editorInstance.getModel();
                  if (model && model.getLineCount() > 0) {
                    const range = {
                      startLineNumber: 1,
                      startColumn: 1,
                      endLineNumber: 1,
                      endColumn: 10
                    };
                    
                    editorInstance.setSelection(range);
                    
                    // Force style the selection after a delay
                    setTimeout(() => {
                      forceSelectionStyle();
                      
                      // Check result
                      const selection = document.querySelector('.monaco-editor .selected-text');
                      if (selection) {
                        const computed = window.getComputedStyle(selection);
                        console.log('✅ Selection after JS override:', {
                          background: computed.backgroundColor,
                          opacity: computed.opacity,
                          display: computed.display
                        });
                      }
                    }, 100);
                  }
                }
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🔧 Force Selection Style
            </button>
            

            

          </div>
          
          <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Open browser console (F12) to see detailed Monaco editor debug information. Use the buttons above to force operations.
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Override only for test page */
        .test-editor-page .dark-mode span {
          color: inherit !important;
        }
        
        /* Fix Monaco Error Indicators - CRITICAL! */
        
        /* Error squiggly underlines - force visibility */
        #monaco-container .monaco-editor .cdr.squiggly-error {
          border-bottom: 2px wavy #ff1212 !important;
          background: transparent !important;
        }
        
        #monaco-container .monaco-editor .squiggly-error {
          border-bottom: 2px wavy #ff1212 !important;
        }
        
        #monaco-container .monaco-editor .squiggly-warning {
          border-bottom: 2px wavy #ffcc02 !important;
        }
        
        #monaco-container .monaco-editor .squiggly-info {
          border-bottom: 2px wavy #0099ff !important;
        }
        
        /* Error decorations */
        #monaco-container .monaco-editor .view-overlays .current-line-error {
          background: rgba(255, 18, 18, 0.1) !important;
        }
        
        /* Ensure Monaco editor is not affected by global styles (but allow errors) */
        #monaco-container .monaco-editor,
        #monaco-container .monaco-editor .view-line,
        #monaco-container .monaco-editor .view-line span:not(.squiggly-error):not(.squiggly-warning) {
          color: inherit !important;
          background: inherit !important;
        }
        
        /* FIX MONACO UI ELEMENTS */
        
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
        
        /* TARGET THE EXACT CLASSES FROM DEBUG: cslr selected-text */
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
        
        /* Alternative: Force via attribute selector */
        .monaco-editor div[class*="cslr"] {
          background: #ff6b35 !important;
          background-color: #ff6b35 !important;
          opacity: 1 !important;
        }
        
        /* Monaco selection layer fallbacks */
        .monaco-editor .monaco-selection-layer .selection,
        .monaco-editor .view-overlay-widgets .current-selection,
        .monaco-editor .view-overlays .current-selection,
        .monaco-editor .view-overlays .selection {
          background: #ff6b35 !important;
          background-color: #ff6b35 !important;
          opacity: 1 !important;
        }
        
        /* CSS Variables override */
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
        
        /* 4. Clean Editor - No Error Indicators */
        
        /* HIDE any error indicators that might still appear */
        .monaco-editor .view-overlays .current-line-error,
        .monaco-editor .view-overlays .error-decoration,
        .monaco-editor .margin .glyph-margin .codicon-error,
        .monaco-editor .margin .line-numbers .error-marker,
        .monaco-editor .squiggly-error,
        .monaco-editor .squiggly-warning,
        .monaco-editor .squiggly-info,
        .monaco-editor .view-overlays .monaco-error-decoration,
        .monaco-editor .decorationsOverviewRuler .error,
        .monaco-editor .decorationsOverviewRuler .warning {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Hide hover tooltips for errors (not needed anymore) */
        .monaco-hover,
        .monaco-hover-content {
          display: none !important;
          visibility: hidden !important;
        }
      `}</style>
    </div>
  );
} 