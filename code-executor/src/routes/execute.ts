import express, { Request, Response } from 'express';
import { requireAuth, CodeExecutionError } from '@liranmazor/common';
import { judge0Client } from '../lib/judge0-client';
import { CodeExecutedPublisher } from '../events/code-executed-publisher';
import { natsClient } from '../lib/nats-client';
import { randomBytes } from 'crypto';

const router = express.Router();

// Server-side problems and test cases
const problems: Record<string, {
  description: string;
  testCases: { input: string; expectedOutput: string }[];
}> = {
  'reverse-string': {
    description: 'Reverse a string',
    testCases: [
      { input: 'hello', expectedOutput: 'olleh' },
      { input: 'aba', expectedOutput: 'aba' },
      { input: 'a', expectedOutput: 'a' },
    ]
  }
};

// Template wrappers for different languages
const codeTemplates: Record<string, (userCode: string) => string> = {
  javascript: (userCode: string) => `
const readline = require('readline');

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  console.log(reverseString(input));
  rl.close();
});
`,
  python: (userCode: string) => `
# ***--- USER CODE START ***
${userCode}
# ***--- USER CODE END ***

# Read input from stdin and print result
input_str = input()
print(reverseString(input_str))
`,
  java: (userCode: string) => `
import java.util.Scanner;

public class Main {
    // ***--- USER CODE START ***
    ${userCode}
    // ***--- USER CODE END ***
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        System.out.println(reverseString(input));
        scanner.close();
    }
}
`,
  cpp: (userCode: string) => `
#include <iostream>
#include <string>
#include <algorithm>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    std::string input;
    std::getline(std::cin, input);
    std::cout << reverseString(input) << std::endl;
    return 0;
}
`,
  c: (userCode: string) => `
#include <stdio.h>
#include <string.h>

// ***--- USER CODE START ***
${userCode}
// ***--- USER CODE END ***

int main() {
    char input[1000];
    fgets(input, sizeof(input), stdin);
    input[strcspn(input, "\\n")] = 0; // Remove newline
    reverseString(input);
    printf("%s\\n", input);
    return 0;
}
`
};

router.post(
  '/api/code-executor/execute',
  requireAuth,
  async (req: Request, res: Response) => {
    const { code, language, problemId } = req.body;
    
    // Validate problem exists
    const problem = problems[problemId];
    if (!problem) {
      throw new CodeExecutionError('Unknown problem', problemId);
    }

    // Validate language support
    const template = codeTemplates[language];
    if (!template) {
      throw new CodeExecutionError('Unsupported language', language);
    }

    // Execute code
    const wrappedCode = template(code);
    
    let judge0Response;
    try {
      judge0Response = await judge0Client.executeCodeWithTestCases(
        wrappedCode,
        language,
        problem.testCases
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new CodeExecutionError('code execution', errorMessage);
    }

    try {
      await new CodeExecutedPublisher(natsClient.client).publish({
        id: randomBytes(4).toString('hex'),
        userId: req.currentUser!.id,
        problemId,
        language,
        wrappedCode,
        judge0Response,
        executedAt: new Date().toISOString(),
        version: 0
      });
    } catch (error) {
      console.error('Failed to publish code execution event:', error);
    }

    res.status(200).send({
      status: 'completed',
      message: 'Code executed and tested',
      results: judge0Response
    });
  }
);

export { router as executeCodeRouter };