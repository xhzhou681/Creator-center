const aiService = require('../services/ai');

/**
 * 与AI助手聊天
 * @param {Object} req - 请求对象，包含message和history
 * @param {Object} res - 响应对象
 */
exports.chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: '消息内容不能为空' });
    }
    
    // 调用AI服务
    const response = await aiService.generateChatResponse(message, history);
    
    return res.json(response);
  } catch (error) {
    console.error('AI聊天错误:', error);
    return res.status(500).json({ message: 'AI服务暂时不可用，请稍后再试' });
  }
};

/**
 * 获取创作灵感
 * @param {Object} req - 请求对象，包含topic
 * @param {Object} res - 响应对象
 */
exports.getInspirations = async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ message: '主题不能为空' });
    }
    
    // 调用AI服务
    const inspirations = await aiService.generateInspirations(topic);
    
    return res.json({ inspirations });
  } catch (error) {
    console.error('获取灵感错误:', error);
    return res.status(500).json({ message: '灵感生成服务暂时不可用，请稍后再试' });
  }
};

/**
 * 分析内容
 * @param {Object} req - 请求对象，包含content
 * @param {Object} res - 响应对象
 */
exports.analyzeContent = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: '内容不能为空' });
    }
    
    // 调用AI服务
    const analysis = await aiService.analyzeContent(content);
    
    return res.json({ analysis });
  } catch (error) {
    console.error('内容分析错误:', error);
    return res.status(500).json({ message: '内容分析服务暂时不可用，请稍后再试' });
  }
}; 