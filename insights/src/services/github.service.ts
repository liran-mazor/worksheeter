import { githubClient } from '../lib/github-client';
import { claudeClient } from '../lib/claude-client';

export class GitHubService {
  
  async searchForLearningContent(query: string): Promise<string> {
    try {
      const repoResults = await githubClient.searchRepositories(query);
      
      if (!repoResults.items || repoResults.items.length === 0) {
        return `🐙 I searched GitHub for "${query}" but didn't find any relevant repositories. 

Try being more specific with your search terms. You can also ask me about your learning progress instead!`;
      }

      return await this.generateSimpleClaudeResponse(repoResults, query);
      
    } catch (error) {
      console.error('🚨 GitHub search failed:', error);
      return `🐙 Sorry, I'm having trouble accessing GitHub right now. This might be due to rate limiting or network issues.

Let me help you with your learning progress instead! How are you doing with your recent coding challenges or quizzes?`;
    }
  }

  private async generateSimpleClaudeResponse(repoResults: any, query: string): Promise<string> {
    try {
      const topRepos = repoResults.items.slice(0, 3);
      const repoData = topRepos.map((repo: any, index: number) => {
        return `${index + 1}. **${repo.name}**
   - URL: ${repo.html_url}`;
      }).join('\n\n');

      const prompt = `You are Thomas, a learning assistant. Format these GitHub repositories as simple title and link pairs.

The student searched for: "${query}"

Here are the repositories I found:

${repoData}

INSTRUCTIONS:
- Start with "🐙 Here are some great repositories for '${query}':"
- Format each repository as: REPO_TITLE|URL
- Use a pipe symbol | to separate title and URL
- Keep it simple - just repository name and URL
- Put each repository on a separate line with the | separator

Example format:
🐙 Here are some great repositories for 'react hooks':
hooks|https://github.com/alibaba/hooks
react-use|https://github.com/streamich/react-use`;

      const claudeResponse = await claudeClient.callClaude(prompt, 300, 'GitHub simple formatting');
      return claudeResponse;
      
    } catch (claudeError) {
      console.error('🤖 Claude formatting failed:', claudeError);
      const topRepos = repoResults.items.slice(0, 3);
      let response = `🐙 GitHub Search Results for "${query}"\n\n`;
      
      topRepos.forEach((repo: any) => {
        response += `${repo.name}|${repo.html_url}\n`;
      });
      
      return response;
    }
  }
}

export const githubService = new GitHubService();