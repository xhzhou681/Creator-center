import api from './api';

/**
 * 向AI助手发送消息并获取回复
 * @param {string} message - 用户发送的消息
 * @param {Array} history - 聊天历史记录
 * @returns {Promise} - 返回AI助手的回复
 */
const sendMessage = async (message, history = []) => {
  try {
    console.log('发送消息到AI助手:', message);
    const response = await api.post('/ai/chat', { message, history });
    console.log('AI助手回复:', response);
    return response;
  } catch (error) {
    console.error('发送消息失败:', error);
    console.log('错误详情:', error.response || error.message || error);
    
    // 如果API不可用，返回模拟数据
    console.log('使用备用模拟回复');
    return {
      response: "很抱歉，AI助手暂时无法连接。请稍后再试。",
      inspiration: []
    };
  }
};

/**
 * 获取创作灵感建议
 * @param {string} topic - 创作主题
 * @returns {Promise} - 返回创作灵感建议
 */
const getInspirations = async (topic) => {
  try {
    console.log('获取创作灵感:', topic);
    const response = await api.post('/ai/inspirations', { topic });
    console.log('获取到灵感建议:', response);
    return response;
  } catch (error) {
    console.error('获取灵感建议失败:', error);
    console.log('错误详情:', error.response || error.message || error);
    
    // 如果API不可用，返回模拟数据
    console.log('使用备用模拟灵感建议');
    return {
      inspirations: [
        {
          title: "如何制作吸引人的视频开场",
          description: "开场白对于吸引观众至关重要，建议使用悬念或有趣的问题开场。",
          tags: ["视频制作", "内容创作", "开场技巧"]
        },
        {
          title: "视频内容结构优化",
          description: "使用三段式结构：引入问题、展示解决方案、总结关键点。",
          tags: ["内容结构", "视频脚本", "叙事技巧"]
        },
        {
          title: "增加观众互动的方法",
          description: "在视频中提出问题，鼓励观众在评论区分享看法。",
          tags: ["观众互动", "社区建设", "评论引导"]
        }
      ]
    };
  }
};

/**
 * 分析内容表现
 * @param {string} content - 要分析的内容
 * @returns {Promise} - 返回内容分析结果
 */
const analyzeContent = async (content) => {
  try {
    console.log('分析内容:', content);
    const response = await api.post('/ai/analyze', { content });
    console.log('内容分析结果:', response);
    return response;
  } catch (error) {
    console.error('内容分析失败:', error);
    console.log('错误详情:', error.response || error.message || error);
    
    // 如果API不可用，返回模拟数据
    console.log('使用备用模拟分析结果');
    return {
      analysis: {
        strengths: ["内容结构清晰", "主题明确", "视觉效果好"],
        weaknesses: ["可以增加更多互动元素", "结尾部分可以更加吸引人"],
        suggestions: ["考虑添加号召性用语", "增加一些数据支持论点", "优化缩略图以提高点击率"]
      }
    };
  }
};

const aiChatService = {
  sendMessage,
  getInspirations,
  analyzeContent
};

export default aiChatService; 