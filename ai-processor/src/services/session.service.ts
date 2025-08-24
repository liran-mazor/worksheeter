import OpenAI from 'openai';
import { claudeClient } from '../lib/claude-client';
import { ClaudeApiError } from '@liranmazor/common';
import { AudioProcessingResult, VideoSessionProcessingData } from '../types/types';

export class SessionService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  // New method for Daily.co video recordings
  async processVideoSession(data: VideoSessionProcessingData): Promise<AudioProcessingResult> {
    try {
      console.log(`🎥 Processing Daily.co recording for session ${data.id}`);
      
      // Step 1: Download recording from Daily.co
      const audioBuffer = await this.downloadRecording(data.recordingUrl);
      
      // Step 2: Transcribe with Whisper
      const transcript = await this.transcribeAudio(audioBuffer, 'audio/mp4');
      
      if (!transcript || transcript.trim().length === 0) {
        throw new Error('Failed to generate transcript from recording');
      }

      // Step 3: Process with Claude for summary and key topics
      const { summary, keyTopics } = await this.analyzeTranscript(
        transcript, 
        data.title,
        data.duration
      );

      console.log(`✅ Successfully processed session ${data.id}`);

      return {
        transcript,
        summary,
        keyTopics
      };

    } catch (error) {
      console.error(`❌ Video session processing failed for ${data.id}:`, error);
      throw new Error(error as string);
    }
  }

  // New method to download Daily.co recordings
  private async downloadRecording(recordingUrl: string): Promise<Buffer> {
    try {
      console.log(`📥 Downloading recording from: ${recordingUrl}`);
      
      const response = await fetch(recordingUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download recording: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log(`✅ Downloaded recording: ${buffer.length} bytes`);
      return buffer;

    } catch (error) {
      throw new Error(error as string);
    }
  }

  private async transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      console.log(`🎙️ Transcribing audio with Whisper (${audioBuffer.length} bytes)`);
      
      // Convert Buffer to Uint8Array for File constructor
      const uint8Array = new Uint8Array(audioBuffer);
      
      // Create a File-like object from Uint8Array
      const audioFile = new File([uint8Array], 'session-recording', {
        type: mimeType
      });

      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        response_format: 'text',
        temperature: 0.2
      });

      console.log(`✅ Transcription completed: ${transcription.length} characters`);
      return transcription;

    } catch (error) {
      throw new Error(error as string);
    }
  }

  private async analyzeTranscript(
    transcript: string, 
    title: string, 
    duration?: number
  ): Promise<{ summary: string; keyTopics: string[] }> {
    const operation = 'session transcript analysis';
    const durationText = duration ? `Duration: ${duration} minutes` : '';
    
    console.log(`🧠 Analyzing transcript with Claude (${transcript.length} characters)`);
    
    const prompt = `You are analyzing a learning session transcript. Please provide:

TRANSCRIPT TO ANALYZE:
Title: "${title}"
${durationText}

Content:
${transcript}

Please provide:

1. **SUMMARY** (2-3 paragraphs): A comprehensive summary of the main points, key concepts, and important information covered in this session.

2. **KEY TOPICS** (5-8 topics): Extract the most important topics/concepts discussed. Return as a simple comma-separated list.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
SUMMARY:
[Your detailed summary here]

KEY_TOPICS:
topic1, topic2, topic3, topic4, topic5

Be specific and educational in your analysis. Focus on the learning content and key takeaways.`;

    try {
      const response = await claudeClient.callClaude(prompt, 1000, operation);
      
      // Parse the response to extract summary and key topics
      const summaryMatch = response.match(/SUMMARY:\s*(.*?)(?=KEY_TOPICS:|$)/s);
      const topicsMatch = response.match(/KEY_TOPICS:\s*(.*?)$/s);
      
      const summary = summaryMatch?.[1]?.trim() || 'Summary could not be generated';
      const topicsText = topicsMatch?.[1]?.trim() || '';
      
      const keyTopics = topicsText
        .split(',')
        .map(topic => topic.trim())
        .filter(topic => topic.length > 0)
        .slice(0, 8);

      // Fallback if parsing fails
      if (keyTopics.length === 0) {
        return {
          summary,
          keyTopics: ['General Discussion', 'Learning Content']
        };
      }

      console.log(`✅ Analysis completed: ${keyTopics.length} key topics identified`);

      return {
        summary,
        keyTopics
      };

    } catch (error) {
      throw new ClaudeApiError(operation, error);
    }
  }
}

export const sessionService = new SessionService();