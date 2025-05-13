const axios = require('axios');

// 配置AI服务API
const AI_API_KEY = process.env.AI_API_KEY || 'your_api_key_here';
const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';

/**
 * 生成AI聊天回复
 * @param {string} message - 用户消息
 * @param {Array} history - 聊天历史
 * @returns {Object} - 返回AI回复和可能的灵感建议
 */
exports.generateChatResponse = async (message, history = []) => {
  try {
    console.log('生成AI聊天回复，消息:', message);
    
    // 构建与AI服务的请求
    const response = await callAIAPI({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一位专业的内容创作顾问，擅长提供视频创作建议、内容策略和创意灵感。请提供有用、具体且专业的回答。"
        },
        ...history,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 800
    });
    
    // 提取AI回复内容
    const aiResponse = response.choices[0].message.content;
    
    // 尝试从回复中提取可能的创作灵感
    const inspiration = extractInspirations(aiResponse);
    
    return {
      response: aiResponse,
      inspiration
    };
  } catch (error) {
    console.error('生成聊天回复失败:', error);
    throw new Error('AI服务暂时不可用');
  }
};

/**
 * 生成创作灵感
 * @param {string} topic - 创作主题
 * @returns {Array} - 返回灵感建议列表
 */
exports.generateInspirations = async (topic) => {
  try {
    console.log('生成创作灵感，主题:', topic);
    
    // 构建与AI服务的请求
    const response = await callAIAPI({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一位创意灵感生成器。请针对给定主题，生成3-5个具体、有创意且实用的内容创作灵感建议。每个建议应包含标题、简短描述和相关标签。以JSON格式返回。"
        },
        {
          role: "user",
          content: `请为以下创作主题提供灵感建议: ${topic}`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });
    
    // 提取AI回复内容
    const aiResponse = response.choices[0].message.content;
    
    // 解析回复中的灵感建议
    const inspirations = parseInspirations(aiResponse);
    
    return inspirations;
  } catch (error) {
    console.error('生成灵感建议失败:', error);
    throw new Error('灵感生成服务暂时不可用');
  }
};

/**
 * 分析内容
 * @param {string} content - 要分析的内容
 * @returns {Object} - 返回分析结果
 */
exports.analyzeContent = async (content) => {
  try {
    console.log('分析内容:', content.substring(0, 50) + '...');
    
    // 构建与AI服务的请求
    const response = await callAIAPI({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一位内容分析专家。请分析提供的内容，并给出内容优势、需要改进的地方和具体的改进建议。以JSON格式返回，包含strengths、weaknesses和suggestions三个数组。"
        },
        {
          role: "user",
          content: `请分析以下内容:\n\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    // 提取AI回复内容
    const aiResponse = response.choices[0].message.content;
    
    // 解析回复中的分析结果
    const analysis = parseAnalysis(aiResponse);
    
    return analysis;
  } catch (error) {
    console.error('内容分析失败:', error);
    throw new Error('内容分析服务暂时不可用');
  }
};

/**
 * 调用AI API
 * @param {Object} data - 请求数据
 * @returns {Object} - API响应
 */
async function callAIAPI(data) {
  try {
    console.log('调用AI API...');
    
    // 如果没有配置AI API，返回模拟数据
    if (AI_API_KEY === 'your_api_key_here') {
      console.log('使用模拟AI响应（未配置API密钥）');
      return getMockAIResponse(data);
    }
    
    const response = await axios.post(AI_API_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('AI API调用失败:', error);
    throw new Error('AI服务调用失败');
  }
}

/**
 * 从AI回复中提取可能的创作灵感
 * @param {string} response - AI回复内容
 * @returns {Array} - 提取的灵感列表
 */
function extractInspirations(response) {
  // 简单实现：检查回复中是否包含建议或灵感相关的关键词
  const keywords = ['建议', '可以尝试', '推荐', '灵感', '创意', '方法', '技巧'];
  
  // 如果包含关键词，尝试提取相关段落作为灵感
  const inspirations = [];
  const sentences = response.split(/[。！？.!?]/);
  
  for (const sentence of sentences) {
    if (keywords.some(keyword => sentence.includes(keyword)) && sentence.length > 15) {
      // 找到可能的灵感建议
      inspirations.push({
        title: sentence.trim().substring(0, 30) + (sentence.length > 30 ? '...' : ''),
        description: sentence.trim(),
        tags: extractTags(sentence)
      });
      
      // 最多提取3个灵感
      if (inspirations.length >= 3) break;
    }
  }
  
  return inspirations;
}

/**
 * 从文本中提取可能的标签
 * @param {string} text - 文本内容
 * @returns {Array} - 提取的标签列表
 */
function extractTags(text) {
  const commonTags = [
    '视频制作', '内容创作', '脚本编写', '剪辑技巧', '镜头语言',
    '叙事技巧', '视觉效果', '音频处理', '观众互动', '营销策略',
    '标题优化', '缩略图设计', '内容结构', '开场技巧', '结尾设计'
  ];
  
  // 简单实现：从常见标签中选择与文本相关的标签
  return commonTags.filter(tag => text.includes(tag.substring(0, 2)))
    .slice(0, 3); // 最多3个标签
}

/**
 * 解析AI回复中的灵感建议
 * @param {string} response - AI回复内容
 * @returns {Array} - 解析后的灵感列表
 */
function parseInspirations(response) {
  try {
    // 尝试从回复中提取JSON格式的灵感建议
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                      response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[0].replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);
      
      if (Array.isArray(data)) {
        return data;
      } else if (data.inspirations && Array.isArray(data.inspirations)) {
        return data.inspirations;
      } else if (data.suggestions && Array.isArray(data.suggestions)) {
        return data.suggestions;
      }
    }
    
    // 如果无法提取JSON，尝试从文本中提取结构化信息
    const inspirations = [];
    const sections = response.split(/\d+[\.\)]/);
    
    for (let i = 1; i < sections.length && inspirations.length < 5; i++) {
      const section = sections[i].trim();
      if (section.length > 20) {
        const lines = section.split('\n').filter(line => line.trim());
        
        if (lines.length > 0) {
          const title = lines[0].replace(/[:#\-*]/g, '').trim();
          const description = lines.length > 1 ? lines.slice(1).join(' ').trim() : title;
          
          inspirations.push({
            title: title.substring(0, 50),
            description: description.substring(0, 200),
            tags: extractTags(section)
          });
        }
      }
    }
    
    return inspirations.length > 0 ? inspirations : getMockInspirations();
  } catch (error) {
    console.error('解析灵感建议失败:', error);
    return getMockInspirations();
  }
}

/**
 * 解析AI回复中的分析结果
 * @param {string} response - AI回复内容
 * @returns {Object} - 解析后的分析结果
 */
function parseAnalysis(response) {
  try {
    // 尝试从回复中提取JSON格式的分析结果
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                      response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[0].replace(/```json|```/g, '').trim();
      const data = JSON.parse(jsonStr);
      
      if (data.strengths && data.weaknesses && data.suggestions) {
        return data;
      }
    }
    
    // 如果无法提取JSON，尝试从文本中提取结构化信息
    const analysis = {
      strengths: [],
      weaknesses: [],
      suggestions: []
    };
    
    // 查找优势部分
    let strengthsMatch = response.match(/优势|优点|内容优势|strengths?[：:]\s*([\s\S]*?)(?=缺点|不足|改进|weaknesses?|suggestions?[：:]|$)/i);
    if (strengthsMatch && strengthsMatch[1]) {
      analysis.strengths = extractListItems(strengthsMatch[1]);
    }
    
    // 查找不足部分
    let weaknessesMatch = response.match(/缺点|不足|需要改进|weaknesses?[：:]\s*([\s\S]*?)(?=建议|suggestions?[：:]|$)/i);
    if (weaknessesMatch && weaknessesMatch[1]) {
      analysis.weaknesses = extractListItems(weaknessesMatch[1]);
    }
    
    // 查找建议部分
    let suggestionsMatch = response.match(/建议|改进建议|suggestions?[：:]\s*([\s\S]*?)(?=$)/i);
    if (suggestionsMatch && suggestionsMatch[1]) {
      analysis.suggestions = extractListItems(suggestionsMatch[1]);
    }
    
    // 确保每个部分至少有一个项目
    if (analysis.strengths.length === 0) analysis.strengths = ["内容结构清晰"];
    if (analysis.weaknesses.length === 0) analysis.weaknesses = ["可以增加更多互动元素"];
    if (analysis.suggestions.length === 0) analysis.suggestions = ["考虑添加号召性用语"];
    
    return analysis;
  } catch (error) {
    console.error('解析分析结果失败:', error);
    return getMockAnalysis();
  }
}

/**
 * 从文本中提取列表项
 * @param {string} text - 文本内容
 * @returns {Array} - 提取的列表项
 */
function extractListItems(text) {
  const items = [];
  
  // 尝试匹配不同格式的列表项
  const patterns = [
    /\d+[\.\)]\s*([^\n]+)/g,  // 数字列表: 1. 项目 或 1) 项目
    /[\-\*]\s*([^\n]+)/g,     // 符号列表: - 项目 或 * 项目
    /[a-z][\.\)]\s*([^\n]+)/g // 字母列表: a. 项目 或 a) 项目
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].trim().length > 0) {
        items.push(match[1].trim());
      }
    }
  }
  
  // 如果没有找到列表项，尝试按行分割
  if (items.length === 0) {
    const lines = text.split('\n').map(line => line.trim())
      .filter(line => line.length > 0 && !line.match(/^[#\-\*=]+$/));
    
    for (const line of lines) {
      items.push(line);
    }
  }
  
  // 去重并限制数量
  return [...new Set(items)].slice(0, 5);
}

/**
 * 获取模拟的AI响应
 * @param {Object} data - 请求数据
 * @returns {Object} - 模拟的响应数据
 */
function getMockAIResponse(data) {
  // 根据请求内容生成不同的模拟响应
  const userMessage = data.messages.find(msg => msg.role === 'user')?.content || '';
  
  if (userMessage.includes('灵感') || userMessage.includes('创意')) {
    return {
      choices: [{
        message: {
          content: `以下是一些创作灵感建议：
          
1. 如何制作吸引人的视频开场 - 开场白对于吸引观众至关重要，建议使用悬念或有趣的问题开场。
2. 视频内容结构优化 - 使用三段式结构：引入问题、展示解决方案、总结关键点。
3. 增加观众互动的方法 - 在视频中提出问题，鼓励观众在评论区分享看法。`
        }
      }]
    };
  } else if (userMessage.includes('分析')) {
    return {
      choices: [{
        message: {
          content: `以下是内容分析结果：
          
优势:
- 内容结构清晰
- 主题明确
- 视觉效果好

不足:
- 可以增加更多互动元素
- 结尾部分可以更加吸引人

改进建议:
- 考虑添加号召性用语
- 增加一些数据支持论点
- 优化缩略图以提高点击率`
        }
      }]
    };
  } else {
    return {
      choices: [{
        message: {
          content: `作为内容创作顾问，我建议你可以尝试以下方法来提升视频质量：
          
1. 确保前30秒抓住观众注意力，这是决定观众是否继续观看的关键时间段。
2. 使用数据和故事相结合的方式，增强内容的可信度和感染力。
3. 保持一致的发布频率，帮助建立稳定的观众群。

希望这些建议对你有所帮助！如果有更具体的问题，欢迎继续咨询。`
        }
      }]
    };
  }
}

/**
 * 获取模拟的灵感建议
 * @returns {Array} - 模拟的灵感建议列表
 */
function getMockInspirations() {
  return [
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
  ];
}

/**
 * 获取模拟的分析结果
 * @returns {Object} - 模拟的分析结果
 */
function getMockAnalysis() {
  return {
    strengths: ["内容结构清晰", "主题明确", "视觉效果好"],
    weaknesses: ["可以增加更多互动元素", "结尾部分可以更加吸引人"],
    suggestions: ["考虑添加号召性用语", "增加一些数据支持论点", "优化缩略图以提高点击率"]
  };
} 