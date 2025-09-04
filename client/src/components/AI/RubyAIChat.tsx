import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Paper,
  Avatar,
  CircularProgress,
  Chip,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  SmartToy as RubyIcon,
  Send,
  Clear,
  Person,
  Refresh,
  Close,
  School,
  Assignment,
  Quiz,
  Help
} from '@mui/icons-material';
import { useAIChat } from '../../hooks/useAIChat';
import type { AIMessage } from '../../services/aiService';
import { formatDistanceToNow } from 'date-fns';

interface RubyAIChatProps {
  open: boolean;
  onClose: () => void;
}

const RubyAIChat: React.FC<RubyAIChatProps> = ({ open, onClose }) => {
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage, clearConversation, retryLastMessage } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      
      
      console.log('🤖 Ruby AI Assistant initialized with Gemini AI');
    }
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    setInput(prompt);
    await sendMessage(prompt);
  };

  const quickPrompts = [
    { icon: <School />, text: "Help me study effectively", prompt: "Can you give me some effective study strategies?" },
    { icon: <Assignment />, text: "Assignment help", prompt: "I need help with my assignment. Can you guide me?" },
    { icon: <Quiz />, text: "Exam preparation", prompt: "How should I prepare for my upcoming exam?" },
    { icon: <Help />, text: "General help", prompt: "Hello! I need some academic support." }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          borderRadius: 3,
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(0,0,0,0.6)' 
            : '0 8px 32px rgba(0,0,0,0.12)',
          bgcolor: isDarkMode ? '#1a1a1a' : 'background.paper',
          border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1, 
        borderBottom: '1px solid', 
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider',
        bgcolor: isDarkMode ? '#1a1a1a' : 'background.paper'
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
                background: 'linear-gradient(45deg, #e91e63 30%, #ff4081 90%)',
              }}
            >
              <RubyIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" color="secondary">
                Ruby AI Assistant
              </Typography>
              <Typography variant="body2" color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
                Your AI-powered learning companion • Powered by Gemini
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={1}>
            {messages.length > 0 && (
              <IconButton onClick={clearConversation} size="small" title="Clear conversation">
                <Clear />
              </IconButton>
            )}
            <IconButton onClick={onClose} size="small" title="Close">
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        p: 0, 
        height: '100%',
        bgcolor: isDarkMode ? '#0d1117' : 'background.default'
      }}>
        {}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          bgcolor: isDarkMode ? '#0d1117' : 'background.default'
        }}>
          {messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Zoom in timeout={800}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'secondary.main',
                    background: 'linear-gradient(45deg, #e91e63 30%, #ff4081 90%)',
                  }}
                >
                  <RubyIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Zoom>
              <Typography variant="h6" gutterBottom color={isDarkMode ? '#ffffff' : 'text.primary'}>
                Hello! I'm Ruby 👋
              </Typography>
              <Typography variant="body2" color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'} paragraph>
                I'm here to help you with your learning journey. Ask me about study strategies, 
                assignment help, course recommendations, or any academic questions!
              </Typography>
              
              {}
              <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }} color={isDarkMode ? '#ffffff' : 'text.primary'}>
                Quick prompts to get started:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                {quickPrompts.map((prompt, index) => (
                  <Chip
                    key={index}
                    icon={prompt.icon}
                    label={prompt.text}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    variant="outlined"
                    clickable
                    sx={{
                      '&:hover': {
                        bgcolor: 'secondary.light',
                        color: 'white',
                      },
                      bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'background.paper',
                      color: isDarkMode ? '#ffffff' : 'text.primary',
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'divider'
                    }}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Box>
              {messages.map((message: AIMessage, index: number) => (
                <Fade in timeout={300} key={message.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                        maxWidth: '80%',
                        flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                          background: message.role === 'user' 
                            ? undefined 
                            : 'linear-gradient(45deg, #e91e63 30%, #ff4081 90%)',
                        }}
                      >
                        {message.role === 'user' ? <Person /> : <RubyIcon />}
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          bgcolor: message.role === 'user' 
                            ? (isDarkMode ? '#0969da' : 'primary.main')
                            : (isDarkMode ? '#21262d' : '#f5f5f5'),
                          color: message.role === 'user' 
                            ? '#ffffff' 
                            : (isDarkMode ? '#ffffff' : 'text.primary'),
                          borderRadius: 2,
                          border: isDarkMode && message.role === 'assistant' 
                            ? '1px solid rgba(255,255,255,0.1)' 
                            : 'none'
                        }}
                      >
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 1,
                            opacity: 0.7,
                            textAlign: message.role === 'user' ? 'right' : 'left',
                            color: message.role === 'user' 
                              ? 'rgba(255,255,255,0.8)' 
                              : (isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary')
                          }}
                        >
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </Fade>
              ))}
              
              {}
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'secondary.main',
                        background: 'linear-gradient(45deg, #e91e63 30%, #ff4081 90%)',
                      }}
                    >
                      <RubyIcon />
                    </Avatar>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        bgcolor: isDarkMode ? '#21262d' : 'grey.100', 
                        borderRadius: 2,
                        border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} color="secondary" />
                        <Typography variant="body2" color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}>
                          Ruby is thinking...
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              )}

              {}
              {error && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Button
                    startIcon={<Refresh />}
                    onClick={retryLastMessage}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  >
                    Retry last message
                  </Button>
                </Box>
              )}
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {}
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid', 
          borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'divider',
          bgcolor: isDarkMode ? '#1a1a1a' : 'background.paper'
        }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Ruby anything about your studies..."
              variant="outlined"
              size="small"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: isDarkMode ? '#21262d' : 'background.paper',
                  '& fieldset': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.4)' : 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
                '& .MuiInputBase-input': {
                  color: isDarkMode ? '#ffffff' : 'text.primary',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'text.secondary',
                  opacity: 1,
                },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              color="secondary"
              sx={{
                bgcolor: 'secondary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'secondary.dark',
                },
                '&:disabled': {
                  bgcolor: 'grey.300',
                },
              }}
            >
              <Send />
            </IconButton>
          </Box>
          <Typography variant="caption" color={isDarkMode ? 'rgba(255,255,255,0.6)' : 'text.secondary'} sx={{ display: 'block', mt: 1 }}>
            Press Enter to send • Shift+Enter for new line
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RubyAIChat;
