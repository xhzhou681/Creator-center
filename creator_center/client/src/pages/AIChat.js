import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Lightbulb,
  Refresh,
  Assessment,
  FormatQuote,
  LocalOffer,
  ThumbUp,
  ThumbDown,
  BarChart
} from '@mui/icons-material';
import aiChatService from '../services/aiChatService';

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [inspirations, setInspirations] = useState([]);
  const [contentToAnalyze, setContentToAnalyze] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzingContent, setAnalyzingContent] = useState(false);
  
  const messagesEndRef = useRef(null);

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 处理标签页变化
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 发送消息给AI助手
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
    
    try {
      // 准备聊天历史记录
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // 发送消息给AI助手
      const response = await aiChatService.sendMessage(input, history);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.response || "抱歉，我暂时无法回答这个问题。",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // 如果有灵感建议，更新灵感列表
      if (response.inspiration && response.inspiration.length > 0) {
        setInspirations(prev => [...response.inspiration, ...prev]);
      }
    } catch (err) {
      console.error('发送消息失败:', err);
      setError('发送消息失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 获取创作灵感
  const handleGetInspirations = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await aiChatService.getInspirations(input);
      
      if (response.inspirations && response.inspirations.length > 0) {
        setInspirations(response.inspirations);
        setTabValue(1); // 切换到灵感标签页
      } else {
        setError('没有找到相关灵感建议');
      }
    } catch (err) {
      console.error('获取灵感失败:', err);
      setError('获取灵感失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 分析内容
  const handleAnalyzeContent = async () => {
    if (!contentToAnalyze.trim()) return;
    
    setAnalyzingContent(true);
    setError('');
    
    try {
      const response = await aiChatService.analyzeContent(contentToAnalyze);
      
      if (response.analysis) {
        setAnalysisResult(response.analysis);
      } else {
        setError('内容分析失败');
      }
    } catch (err) {
      console.error('内容分析失败:', err);
      setError('内容分析失败，请稍后再试');
    } finally {
      setAnalyzingContent(false);
    }
  };

  // 渲染聊天消息
  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    
    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 2
        }}
      >
        {!isUser && (
          <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
            <SmartToy />
          </Avatar>
        )}
        
        <Paper
          elevation={1}
          sx={{
            p: 2,
            maxWidth: '70%',
            bgcolor: isUser ? 'primary.light' : 'grey.100',
            color: isUser ? 'white' : 'text.primary',
            borderRadius: 2
          }}
        >
          <Typography variant="body1">{message.text}</Typography>
          <Typography variant="caption" color={isUser ? "rgba(255,255,255,0.7)" : "text.secondary"} sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
        </Paper>
        
        {isUser && (
          <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>
            <Person />
          </Avatar>
        )}
      </Box>
    );
  };

  // 渲染灵感卡片
  const renderInspirationCard = (inspiration, index) => {
    return (
      <Card key={index} sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {inspiration.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {inspiration.description}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {inspiration.tags && inspiration.tags.map((tag, i) => (
              <Chip key={i} size="small" label={tag} icon={<LocalOffer fontSize="small" />} />
            ))}
          </Box>
        </CardContent>
        <CardActions>
          <IconButton size="small" aria-label="有用">
            <ThumbUp fontSize="small" />
          </IconButton>
          <IconButton size="small" aria-label="无用">
            <ThumbDown fontSize="small" />
          </IconButton>
          <Button 
            size="small" 
            startIcon={<FormatQuote />}
            onClick={() => {
              setInput(inspiration.title);
              setTabValue(0);
            }}
          >
            询问更多
          </Button>
        </CardActions>
      </Card>
    );
  };

  // 渲染内容分析结果
  const renderAnalysisResult = () => {
    if (!analysisResult) return null;
    
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>分析结果</Typography>
        
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            内容优势
          </Typography>
          <List dense>
            {analysisResult.strengths.map((item, index) => (
              <ListItem key={`strength-${index}`}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ThumbUp fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Paper>
        
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" color="error" gutterBottom>
            需要改进
          </Typography>
          <List dense>
            {analysisResult.weaknesses.map((item, index) => (
              <ListItem key={`weakness-${index}`}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ThumbDown fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Paper>
        
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" color="info.main" gutterBottom>
            改进建议
          </Typography>
          <List dense>
            {analysisResult.suggestions.map((item, index) => (
              <ListItem key={`suggestion-${index}`}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Lightbulb fontSize="small" color="info" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI创作助手
        </Typography>
        <Typography variant="body1" color="text.secondary">
          与AI助手交流，获取创作灵感和内容分析
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<Refresh />}
              onClick={() => setError('')}
            >
              重试
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="AI助手功能标签页"
        >
          <Tab icon={<SmartToy />} label="聊天助手" id="tab-0" />
          <Tab icon={<Lightbulb />} label="创作灵感" id="tab-1" />
          <Tab icon={<Assessment />} label="内容分析" id="tab-2" />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" aria-labelledby="tab-0">
        {tabValue === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper 
                elevation={3} 
                sx={{ 
                  height: 400, 
                  p: 2, 
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {messages.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    color: 'text.secondary'
                  }}>
                    <SmartToy sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                    <Typography variant="h6">
                      AI创作助手
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                      向我提问任何关于视频创作的问题，<br />
                      或者寻求创作灵感和内容建议
                    </Typography>
                  </Box>
                ) : (
                  messages.map(message => renderMessage(message))
                )}
                <div ref={messagesEndRef} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="输入消息..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  multiline
                  maxRows={3}
                />
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                >
                  发送
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  endIcon={<Lightbulb />}
                  onClick={handleGetInspirations}
                  disabled={loading || !input.trim()}
                >
                  获取灵感
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" aria-labelledby="tab-1">
        {tabValue === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="输入创作主题..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Lightbulb />}
                  onClick={handleGetInspirations}
                  disabled={loading || !input.trim()}
                >
                  获取灵感
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                创作灵感建议
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : inspirations.length > 0 ? (
                inspirations.map((inspiration, index) => renderInspirationCard(inspiration, index))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Lightbulb sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    输入创作主题，获取灵感建议
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        )}
      </Box>

      <Box role="tabpanel" hidden={tabValue !== 2} id="tabpanel-2" aria-labelledby="tab-2">
        {tabValue === 2 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                内容分析
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                输入你的视频脚本、简介或标题，AI将帮你分析内容优势和改进建议
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="输入要分析的内容..."
                value={contentToAnalyze}
                onChange={(e) => setContentToAnalyze(e.target.value)}
                disabled={analyzingContent}
                multiline
                rows={6}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={analyzingContent ? <CircularProgress size={20} color="inherit" /> : <BarChart />}
                onClick={handleAnalyzeContent}
                disabled={analyzingContent || !contentToAnalyze.trim()}
              >
                分析内容
              </Button>
            </Grid>
            <Grid item xs={12}>
              {analyzingContent ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : renderAnalysisResult()}
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
} 