import { randomBytes } from 'crypto';
import { SupportedLanguage } from '../types/types';

export class CodeService {
  // Generates a unique submission ID
  static generateSubmissionId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = randomBytes(8).toString('hex');
    return `code_${timestamp}_${randomPart}`;
  }

  // Extracts user code from wrapped code using delimiters
  static extractUserCode(wrappedCode: string): string {
    const startMarker = '// ***--- USER CODE START ***';
    const endMarker = '// ***--- USER CODE END ***';
    
    const startIndex = wrappedCode.indexOf(startMarker);
    const endIndex = wrappedCode.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
      // Try Python-style comments
      const pythonStartMarker = '# ***--- USER CODE START ***';
      const pythonEndMarker = '# ***--- USER CODE END ***';
      
      const pythonStartIndex = wrappedCode.indexOf(pythonStartMarker);
      const pythonEndIndex = wrappedCode.indexOf(pythonEndMarker);
      
      if (pythonStartIndex === -1 || pythonEndIndex === -1) {
        return wrappedCode; // Fallback to full code if markers not found
      }
      
      return wrappedCode.substring(pythonStartIndex + pythonStartMarker.length, pythonEndIndex).trim();
    }
    
    return wrappedCode.substring(startIndex + startMarker.length, endIndex).trim();
  }

  // Parses and cleans up error messages from Judge0
  static parseError(error: string): string {
    if (!error) return '';
    
    // Remove file paths and line numbers for cleaner display
    let cleanedError = error
      // Remove /box/script.js:line:column patterns
      .replace(/\/box\/[^:]+:\d+:\d+/g, '')
      // Remove at Interface.<anonymous> patterns
      .replace(/at Interface\.<anonymous>.*$/gm, '')
      // Remove at ReadStream.onend patterns
      .replace(/at ReadStream\.onend.*$/gm, '')
      // Remove at ReadStream.emit patterns
      .replace(/at ReadStream\.emit.*$/gm, '')
      // Remove at endReadableNT patterns
      .replace(/at endReadableNT.*$/gm, '')
      // Remove at processTicksAndReject patterns
      .replace(/at processTicksAndReject.*$/gm, '')
      // Remove at Object.<anonymous> patterns
      .replace(/at Object\.<anonymous>.*$/gm, '')
      // Remove at emit patterns
      .replace(/at emit.*$/gm, '')
      // Remove at events.js patterns
      .replace(/at events\.js.*$/gm, '')
      // Remove at readline.js patterns
      .replace(/at readline\.js.*$/gm, '')
      // Remove at _stream_readable.js patterns
      .replace(/at _stream_readable\.js.*$/gm, '')
      // Remove at internal/process patterns
      .replace(/at internal\/process.*$/gm, '')
      // Remove at Module._compile patterns
      .replace(/at Module\._compile.*$/gm, '')
      // Remove at Object.Module._extensions patterns
      .replace(/at Object\.Module\._extensions.*$/gm, '')
      // Remove at Module.load patterns
      .replace(/at Module\.load.*$/gm, '')
      // Remove at Function.Module._load patterns
      .replace(/at Function\.Module\._load.*$/gm, '')
      // Remove at Function.executeUserEntryPoint patterns
      .replace(/at Function\.executeUserEntryPoint.*$/gm, '')
      // Remove at internal/main patterns
      .replace(/at internal\/main.*$/gm, '')
      // Remove at /box/script.js patterns
      .replace(/at \/box\/script\.js.*$/gm, '')
      // Remove at /box/script.py patterns
      .replace(/at \/box\/script\.py.*$/gm, '')
      // Remove at /box/Main.java patterns
      .replace(/at \/box\/Main\.java.*$/gm, '')
      // Remove at /box/main.cpp patterns
      .replace(/at \/box\/main\.cpp.*$/gm, '')
      // Remove at /box/main.c patterns
      .replace(/at \/box\/main\.c.*$/gm, '')
      // Remove multiple newlines
      .replace(/\n\s*\n/g, '\n')
      // Remove leading/trailing whitespace
      .trim();
    
    // If the error is just a TypeError or ReferenceError, make it more user-friendly
    if (cleanedError.includes('TypeError:') || cleanedError.includes('ReferenceError:')) {
      const lines = cleanedError.split('\n');
      const errorLine = lines[0];
      const message = errorLine.split(':').slice(1).join(':').trim();
      
      // Common error patterns
      if (message.includes('is not a function')) {
        const methodName = message.match(/(\w+) is not a function/)?.[1];
        if (methodName) {
          return `Error: "${methodName}" is not a valid method. Check your spelling and make sure you're using the correct method name.`;
        }
      }
      
      if (message.includes('Cannot read property')) {
        const propertyName = message.match(/Cannot read property '([^']+)'/)?.[1];
        if (propertyName) {
          return `Error: Cannot access property "${propertyName}". The object might be null or undefined.`;
        }
      }
      
      if (message.includes('is not defined')) {
        const variableName = message.match(/(\w+) is not defined/)?.[1];
        if (variableName) {
          return `Error: Variable "${variableName}" is not defined. Make sure you've declared it before using it.`;
        }
      }
      
      return `Error: ${message}`;
    }
    
    return cleanedError;
  }

  // Formats Judge0 response to clean structure
  static formatJudge0Response(judge0Response: any) {
    return {
      overallStatus: judge0Response.overallStatus,
      testResults: judge0Response.testResults.map((test: any) => ({
        input: test.input,
        expectedOutput: test.expectedOutput,
        actualOutput: test.actualOutput || '',
        passed: test.passed,
        executionTime: test.executionTime,
        memory: test.memory,
        error: test.error ? this.parseError(test.error) : undefined
      })),
      totalPassed: judge0Response.totalPassed,
      totalFailed: judge0Response.totalFailed
    };
  }

  // Problem input type definitions
  private static readonly PROBLEM_INPUT_PATTERNS: Record<string, InputType> = {
    // Single integer input
    'n-queens': 'single-integer',
    'factorial': 'single-integer',
    'fibonacci': 'single-integer',
    'fibonacci-recursive': 'single-integer',
    'prime-check': 'single-integer',
    'generate-parentheses': 'single-integer',
    
    // Single string input
    'reverse-string': 'single-string',
    'palindrome-check': 'single-string',
    'count-vowels': 'single-string',
    'capitalize-first': 'single-string',
    'longest-word': 'single-string',
    'reverse-string-recursive': 'single-string',
    'longest-palindromic-substring': 'single-string',
    
    // Array of integers
    'find-max': 'array-of-integers',
    'array-sum': 'array-of-integers',
    'bubble-sort': 'array-of-integers',
    'sum-array': 'array-of-integers',
    
    // Array of strings (can handle mixed types)
    'remove-duplicates': 'array-of-strings',
    'array-reverse': 'array-of-strings',
    
    // Two integers (comma-separated)
    'power': 'two-integers',
    'gcd': 'two-integers',
    
    // Array and target (two-sum pattern)
    'two-sum': 'array-and-target',
    'binary-search': 'array-and-target',
    
    // Multi-line string inputs
    'regex-matching': 'multi-line-string',
    'minimum-window-substring': 'multi-line-string',
  };

  // Creates code template based on problem and language
  static createCodeTemplate(
    language: SupportedLanguage, 
    userCode: string, 
    functionName: string,
    problemId?: string
  ): string {
    if (!problemId) {
      // Fallback to default single string template
      return this.createTemplateForInputType('single-string', language, userCode, functionName);
    }
    
    const inputType = this.PROBLEM_INPUT_PATTERNS[problemId] || 'single-string';
    return this.createTemplateForInputType(inputType, language, userCode, functionName);
  }

  private static createTemplateForInputType(
    inputType: InputType,
    language: SupportedLanguage,
    userCode: string,
    functionName: string
  ): string {
    const templates: Record<InputType, Record<SupportedLanguage, string>> = {
      'single-integer': {
        javascript: `
const readline = require('readline');

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const n = parseInt(input.trim());
  console.log(${functionName}(n));
  rl.close();
});
`,
        python: `
# ***--- USER CODE START ***
${userCode}
# ***--- USER CODE END ***

n = int(input().strip())
print(${functionName}(n))
`,
        java: `
import java.util.Scanner;

public class Main {
    // ***--- USER CODE START ***
    ${userCode}
    // ***--- USER CODE END ***
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(${functionName}(n));
        scanner.close();
    }
}
`,
        cpp: `
#include <iostream>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    int n;
    std::cin >> n;
    std::cout << ${functionName}(n) << std::endl;
    return 0;
}
`,
        c: `
#include <stdio.h>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", ${functionName}(n));
    return 0;
}
`
      },
      
      'single-string': {
        javascript: `
const readline = require('readline');

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  console.log(${functionName}(input.trim()));
  rl.close();
});
`,
        python: `
# ***--- USER CODE START ***
${userCode}
# ***--- USER CODE END ***

input_str = input().strip()
print(${functionName}(input_str))
`,
        java: `
import java.util.Scanner;

public class Main {
    // ***--- USER CODE START ***
    ${userCode}
    // ***--- USER CODE END ***
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine().trim();
        System.out.println(${functionName}(input));
        scanner.close();
    }
}
`,
        cpp: `
#include <iostream>
#include <string>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    std::string input;
    std::getline(std::cin, input);
    std::cout << ${functionName}(input) << std::endl;
    return 0;
}
`,
        c: `
#include <stdio.h>
#include <string.h>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    char input[1000];
    fgets(input, sizeof(input), stdin);
    input[strcspn(input, "\\n")] = 0;
    printf("%s\\n", ${functionName}(input));
    return 0;
}
`
      },
      
      'array-of-integers': {
        javascript: `
const readline = require('readline');

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const arr = input.trim().split(',').map(x => parseInt(x.trim()));
  const result = ${functionName}(arr);
  if (Array.isArray(result)) {
    console.log(result.join(','));
  } else {
    console.log(result);
  }
  rl.close();
});
`,
        python: `
# ***--- USER CODE START ***
${userCode}
# ***--- USER CODE END ***

arr = [int(x.strip()) for x in input().strip().split(',')]
result = ${functionName}(arr)
if isinstance(result, list):
    print(','.join(map(str, result)))
else:
    print(result)
`,
        java: `
import java.util.Scanner;
import java.util.Arrays;

public class Main {
    // ***--- USER CODE START ***
    ${userCode}
    // ***--- USER CODE END ***
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] input = scanner.nextLine().trim().split(",");
        int[] arr = Arrays.stream(input).mapToInt(s -> Integer.parseInt(s.trim())).toArray();
        System.out.println(${functionName}(arr));
        scanner.close();
    }
}
`,
        cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    std::string line;
    std::getline(std::cin, line);
    
    std::vector<int> arr;
    std::stringstream ss(line);
    std::string token;
    while (std::getline(ss, token, ',')) {
        arr.push_back(std::stoi(token));
    }
    
    std::cout << ${functionName}(arr) << std::endl;
    return 0;
}
`,
        c: `
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    char line[1000];
    fgets(line, sizeof(line), stdin);
    line[strcspn(line, "\\n")] = 0;
    
    int arr[100], count = 0;
    char *token = strtok(line, ",");
    while (token != NULL) {
        arr[count++] = atoi(token);
        token = strtok(NULL, ",");
    }
    
    printf("%d\\n", ${functionName}(arr, count));
    return 0;
}
`
      },
      
      'array-of-strings': {
        javascript: `
const readline = require('readline');

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const arr = input.trim().split(',').map(x => x.trim());
  const result = ${functionName}(arr);
  if (Array.isArray(result)) {
    console.log(result.join(','));
  } else {
    console.log(result);
  }
  rl.close();
});
`,
        python: `
# ***--- USER CODE START ***
${userCode}
# ***--- USER CODE END ***

arr = [x.strip() for x in input().strip().split(',')]
result = ${functionName}(arr)
if isinstance(result, list):
    print(','.join(result))
else:
    print(result)
`,
        java: `
import java.util.Scanner;

public class Main {
    // ***--- USER CODE START ***
    ${userCode}
    // ***--- USER CODE END ***
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] arr = scanner.nextLine().trim().split(",");
        for (int i = 0; i < arr.length; i++) {
            arr[i] = arr[i].trim();
        }
        System.out.println(${functionName}(arr));
        scanner.close();
    }
}
`,
        cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    std::string line;
    std::getline(std::cin, line);
    
    std::vector<std::string> arr;
    std::stringstream ss(line);
    std::string token;
    while (std::getline(ss, token, ',')) {
        arr.push_back(token);
    }
    
    std::cout << ${functionName}(arr) << std::endl;
    return 0;
}
`,
        c: `
#include <stdio.h>
#include <string.h>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    char line[1000];
    fgets(line, sizeof(line), stdin);
    line[strcspn(line, "\\n")] = 0;
    
    char arr[100][100];
    int count = 0;
    char *token = strtok(line, ",");
    while (token != NULL && count < 100) {
        strcpy(arr[count++], token);
        token = strtok(NULL, ",");
    }
    
    printf("%s\\n", ${functionName}(arr, count));
    return 0;
}
`
      },
      
      'two-integers': {
        javascript: `
const readline = require('readline');

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const [a, b] = input.trim().split(',').map(x => parseInt(x.trim()));
  console.log(${functionName}(a, b));
  rl.close();
});
`,
        python: `
# ***--- USER CODE START ***
${userCode}
# ***--- USER CODE END ***

a, b = map(int, input().strip().split(','))
print(${functionName}(a, b))
`,
        java: `
import java.util.Scanner;

public class Main {
    // ***--- USER CODE START ***
    ${userCode}
    // ***--- USER CODE END ***
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] parts = scanner.nextLine().trim().split(",");
        int a = Integer.parseInt(parts[0].trim());
        int b = Integer.parseInt(parts[1].trim());
        System.out.println(${functionName}(a, b));
        scanner.close();
    }
}
`,
        cpp: `
#include <iostream>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    int a, b;
    char comma;
    std::cin >> a >> comma >> b;
    std::cout << ${functionName}(a, b) << std::endl;
    return 0;
}
`,
        c: `
#include <stdio.h>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    int a, b;
    scanf("%d,%d", &a, &b);
    printf("%d\\n", ${functionName}(a, b));
    return 0;
}
`
      },
      
      'array-and-target': {
        javascript: `
const readline = require('readline');

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
  lines.push(line);
  if (lines.length === 2) {
    const nums = lines[0].trim().split(',').map(x => parseInt(x.trim()));
    const target = parseInt(lines[1].trim());
    const result = ${functionName}(nums, target);
    if (Array.isArray(result)) {
      console.log(result.join(','));
    } else {
      console.log(result);
    }
    rl.close();
  }
});
`,
        python: `
# ***--- USER CODE START ***
${userCode}
# ***--- USER CODE END ***

nums = [int(x.strip()) for x in input().strip().split(',')]
target = int(input().strip())
result = ${functionName}(nums, target)
if isinstance(result, list):
    print(','.join(map(str, result)))
else:
    print(result)
`,
        java: `
import java.util.Scanner;
import java.util.Arrays;

public class Main {
    // ***--- USER CODE START ***
    ${userCode}
    // ***--- USER CODE END ***
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] numsStr = scanner.nextLine().trim().split(",");
        int[] nums = Arrays.stream(numsStr).mapToInt(s -> Integer.parseInt(s.trim())).toArray();
        int target = Integer.parseInt(scanner.nextLine().trim());
        int[] result = ${functionName}(nums, target);
        System.out.println(result[0] + "," + result[1]);
        scanner.close();
    }
}
`,
        cpp: `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    std::string line1, line2;
    std::getline(std::cin, line1);
    std::getline(std::cin, line2);
    
    std::vector<int> nums;
    std::stringstream ss(line1);
    std::string token;
    while (std::getline(ss, token, ',')) {
        nums.push_back(std::stoi(token));
    }
    int target = std::stoi(line2);
    
    std::vector<int> result = ${functionName}(nums, target);
    std::cout << result[0] << "," << result[1] << std::endl;
    return 0;
}
`,
        c: `
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    char line1[1000], line2[100];
    fgets(line1, sizeof(line1), stdin);
    fgets(line2, sizeof(line2), stdin);
    
    line1[strcspn(line1, "\\n")] = 0;
    line2[strcspn(line2, "\\n")] = 0;
    
    int nums[100], count = 0;
    char *token = strtok(line1, ",");
    while (token != NULL) {
        nums[count++] = atoi(token);
        token = strtok(NULL, ",");
    }
    int target = atoi(line2);
    
    int result[2];
    ${functionName}(nums, count, target, result);
    printf("%d,%d\\n", result[0], result[1]);
    return 0;
}
`
      },
      
      'multi-line-string': {
        javascript: `
const readline = require('readline');

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
  lines.push(line);
  if (lines.length === 2) {
    const str1 = lines[0].trim();
    const str2 = lines[1].trim();
    console.log(${functionName}(str1, str2));
    rl.close();
  }
});
`,
        python: `
# ***--- USER CODE START ***
${userCode}
# ***--- USER CODE END ***

str1 = input().strip()
str2 = input().strip()
print(${functionName}(str1, str2))
`,
        java: `
import java.util.Scanner;

public class Main {
    // ***--- USER CODE START ***
    ${userCode}
    // ***--- USER CODE END ***
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String str1 = scanner.nextLine().trim();
        String str2 = scanner.nextLine().trim();
        System.out.println(${functionName}(str1, str2));
        scanner.close();
    }
}
`,
        cpp: `
#include <iostream>
#include <string>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    std::string str1, str2;
    std::getline(std::cin, str1);
    std::getline(std::cin, str2);
    std::cout << ${functionName}(str1, str2) << std::endl;
    return 0;
}
`,
        c: `
#include <stdio.h>
#include <string.h>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    char str1[1000], str2[1000];
    fgets(str1, sizeof(str1), stdin);
    fgets(str2, sizeof(str2), stdin);
    
    str1[strcspn(str1, "\\n")] = 0;
    str2[strcspn(str2, "\\n")] = 0;
    
    printf("%s\\n", ${functionName}(str1, str2));
    return 0;
}
`
      }
    };
    
    return templates[inputType][language] || templates[inputType].javascript;
  }
}

// Input type definitions
type InputType = 'single-integer' | 'single-string' | 'array-of-integers' | 'array-of-strings' | 
                 'two-integers' | 'array-and-target' | 'multi-line-string';