


import { getAIConfig, getSystemPrompt } from '../config/aiConfig';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'custom' | 'mock';
  apiKey?: string;
  model?: string;
  baseURL?: string;
}

class AIService {
  private config: AIServiceConfig;
  private conversations: Map<string, AIMessage[]> = new Map();

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  
  async sendToOpenAI(messages: AIMessage[]): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: getSystemPrompt()
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'OpenAI API error');
      }

      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  
  async sendToAnthropic(messages: AIMessage[]): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.model || 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          system: getSystemPrompt()
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Anthropic API error');
      }

      return data.content[0]?.text || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw error;
    }
  }

  
  async sendToGemini(messages: AIMessage[]): Promise<string> {
    console.log('🔷 Ruby AI: Sending to Gemini API...');
    
    if (!this.config.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      
      const conversationText = messages.map(msg => 
        `${msg.role === 'user' ? 'Student' : 'Ruby'}: ${msg.content}`
      ).join('\n');

      const systemPrompt = getSystemPrompt();
      const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationText}\n\nRuby:`;

      console.log('🔷 Ruby AI: Sending request to Gemini 1.5 Flash...');

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
            topP: 0.9,
            topK: 40
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      const data = await response.json();
      
      console.log('🔷 Ruby AI: Received response from Gemini:', data);
      
      if (!response.ok) {
        throw new Error(data.error?.message || `Gemini API error: ${response.status}`);
      }

      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No response generated from Gemini');
      }

      console.log('🔷 Ruby AI: Successfully generated response from Gemini');
      return generatedText.trim();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  
  async sendToCustomBackend(messages: AIMessage[]): Promise<string> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          messages: messages,
          context: 'lms_assistant'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Backend AI service error');
      }

      return data.response || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Custom Backend Error:', error);
      throw error;
    }
  }

  
  async sendToMockAI(messages: AIMessage[]): Promise<string> {
    const mockResponses = [
      "Hello! I'm Ruby, your AI learning assistant. How can I help you with your studies today?",
      "That's a great question! Let me help you understand this concept better...",
      "I'd be happy to help you with your assignment. Can you tell me more about what you're working on?",
      "Here's a study tip: Break down complex topics into smaller, manageable chunks and practice regularly.",
      "Remember, learning is a journey. Don't hesitate to ask questions and seek help when needed!",
      "Would you like me to explain this concept in a different way? I can provide examples or analogies.",
      "Great job on working through this problem! Keep up the excellent work!"
    ];

    
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
    
    
    if (lastMessage.includes('assignment') || lastMessage.includes('homework')) {
      return "I'd love to help you with your assignment! Can you share what subject it's for and what specific part you're struggling with? I can provide study strategies, help break down complex problems, or suggest resources.";
    } else if (lastMessage.includes('study') || lastMessage.includes('learn')) {
      return "Here are some effective study strategies I recommend: 1) Use active recall by testing yourself, 2) Space out your learning sessions, 3) Connect new concepts to what you already know, 4) Take regular breaks, 5) Teach the concept to someone else. Which subject are you studying?";
    } else if (lastMessage.includes('course') || lastMessage.includes('class')) {
      return "I can help you navigate your courses! Would you like suggestions for staying organized, managing deadlines, participating in class discussions, or understanding specific course material? What course are you taking?";
    } else if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
      return "Hello! I'm Ruby, your AI learning assistant. I'm here to help you succeed in your studies. I can assist with assignment guidance, study strategies, course recommendations, and answer questions about your learning materials. What would you like to work on today?";
    }

    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }

  
  async sendMessage(conversationId: string, userMessage: string): Promise<string> {
    const messageId = Date.now().toString();
    const userMsg: AIMessage = {
      id: messageId,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    
    let conversation = this.conversations.get(conversationId) || [];
    conversation.push(userMsg);

    try {
      let response: string;

      switch (this.config.provider) {
        case 'openai':
          response = await this.sendToOpenAI(conversation);
          break;
        case 'anthropic':
          response = await this.sendToAnthropic(conversation);
          break;
        case 'gemini':
          response = await this.sendToGemini(conversation);
          break;
        case 'custom':
          response = await this.sendToCustomBackend(conversation);
          break;
        default:
          response = await this.sendToMockAI(conversation);
      }

      
      const assistantMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      conversation.push(assistantMsg);

      
      this.conversations.set(conversationId, conversation);

      return response;
    } catch (error) {
      console.error('AI Service Error:', error);
      
      
      let fallbackMessage = "I'm having trouble connecting right now. ";
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          fallbackMessage += "There seems to be an issue with my configuration. Please try again in a moment.";
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          fallbackMessage += "I'm experiencing high demand right now. Please try again in a few minutes.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          fallbackMessage += "Please check your internet connection and try again.";
        } else {
          fallbackMessage += "Please try rephrasing your question or try again in a moment.";
        }
      }
      
      return fallbackMessage + "\n\nIn the meantime, feel free to ask about study strategies, time management, or any academic topics you'd like help with!";
    }
  }

  
  getConversation(conversationId: string): AIMessage[] {
    return this.conversations.get(conversationId) || [];
  }

  
  clearConversation(conversationId: string): void {
    this.conversations.delete(conversationId);
  }

  
  updateConfig(newConfig: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}


const config = getAIConfig();
export const aiService = new AIService(config);

export default AIService;
