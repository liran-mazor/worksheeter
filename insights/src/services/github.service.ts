import { githubClient } from '../lib/github-client';

export class GitHubService {
  
  async searchForLearningContent(query: string): Promise<string> {
    try {
      console.log(`🔍 Searching GitHub for: "${query}"`);
      
      // Search GitHub repositories
      const repoResults = await githubClient.searchRepositories(query);
      
      if (!repoResults.items || repoResults.items.length === 0) {
        return `🐙 I searched GitHub for "${query}" but didn't find any relevant repositories. 

Try being more specific with your search terms. You can also ask me about your learning progress instead!`;
      }

      // Format the response with top repositories
      return this.formatRepositoryResults(repoResults, query);
      
    } catch (error) {
      console.error('🚨 GitHub search failed:', error);
      return `🐙 Sorry, I'm having trouble accessing GitHub right now. This might be due to rate limiting or network issues.

Let me help you with your learning progress instead! How are you doing with your recent coding challenges or quizzes?`;
    }
  }

  private formatRepositoryResults(repoResults: any, query: string): string {
    const topRepos = repoResults.items.slice(0, 3);
    let response = `🐙 GitHub Search Results for "${query}"\n\n`;
    
    topRepos.forEach((repo: any, index: number) => {
      response += `${index + 1}. ${repo.name} ⭐ ${repo.stargazers_count}\n`;
      response += `📝 ${repo.description || 'No description available'}\n`;
      response += `💻 Language: ${repo.language || 'Not specified'}\n`;
      response += `${repo.html_url}\n`;  // URL on its own line
      response += `\n`;
    });
  
    response += `💡 Educational Tip: These repositories contain code examples and library usage patterns you can learn from!\n\n`;
    response += `Would you like me to analyze your recent coding progress or quiz performance instead?`;
  
    return response;
  }
}

export const githubService = new GitHubService();