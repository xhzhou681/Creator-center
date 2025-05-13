import api from './api';

// 获取热门内容（热门话题和视频）
const getPopularContent = async () => {
  try {
    console.log('正在获取热门内容...');
    const response = await api.get('/inspiration/popular');
    console.log('成功获取热门内容:', response);
    return response.data || response;
  } catch (error) {
    console.error('获取热门内容失败:', error);
    console.log('错误详情:', error.response || error.message || error);
    
    // 如果API不可用，返回模拟数据
    console.log('使用备用模拟数据');
    return {
      topics: [
        { id: 1, name: '美食探店', count: 1250 },
        { id: 2, name: '生活日常', count: 980 },
        { id: 3, name: '旅行攻略', count: 870 },
        { id: 4, name: '健身运动', count: 750 },
        { id: 5, name: '穿搭分享', count: 680 },
        { id: 6, name: '学习技巧', count: 520 },
        { id: 7, name: '科技数码', count: 480 },
        { id: 8, name: '职场经验', count: 420 },
        { id: 9, name: '宠物日常', count: 380 },
        { id: 10, name: '育儿经验', count: 320 }
      ],
      videos: [
        {
          id: 1,
          title: '10分钟快手早餐，健康又美味',
          thumbnail: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300',
          duration: '10:25',
          views: 12500,
          creator: { name: '美食达人', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
        },
        {
          id: 2,
          title: '2023最火的10个旅游目的地',
          thumbnail: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=300',
          duration: '15:10',
          views: 9800,
          creator: { name: '旅行家', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
        },
        {
          id: 3,
          title: '家庭健身指南：不需要器械的全身锻炼',
          thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300',
          duration: '20:15',
          views: 8700,
          creator: { name: '健身教练', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' }
        },
        {
          id: 4,
          title: '2023秋冬穿搭趋势分析',
          thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300',
          duration: '12:30',
          views: 7500,
          creator: { name: '时尚博主', avatar: 'https://randomuser.me/api/portraits/women/23.jpg' }
        },
        {
          id: 5,
          title: '高效学习的5个关键技巧',
          thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300',
          duration: '18:45',
          views: 6800,
          creator: { name: '学习达人', avatar: 'https://randomuser.me/api/portraits/men/86.jpg' }
        },
        {
          id: 6,
          title: '最新手机评测：性价比之王',
          thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02ff9?w=400&h=300',
          duration: '22:10',
          views: 6200,
          creator: { name: '科技评测', avatar: 'https://randomuser.me/api/portraits/men/42.jpg' }
        }
      ]
    };
  }
};

// 获取推荐创作者
const getRecommendedCreators = async () => {
  try {
    console.log('正在获取推荐创作者...');
    const response = await api.get('/inspiration/creators');
    console.log('成功获取推荐创作者:', response);
    return response.data || response;
  } catch (error) {
    console.error('获取推荐创作者失败:', error);
    console.log('错误详情:', error.response || error.message || error);
    
    // 如果API不可用，返回模拟数据
    console.log('使用备用模拟数据');
    return [
      {
        id: 1,
        name: '美食达人',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        category: '美食',
        description: '专注分享家常菜谱和美食探店，已有5年美食博主经验',
        followers: 125000
      },
      {
        id: 2,
        name: '旅行家',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        category: '旅行',
        description: '环球旅行者，已去过40多个国家，分享旅行攻略和小众景点',
        followers: 98000
      },
      {
        id: 3,
        name: '健身教练',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        category: '健身',
        description: '专业健身教练，提供科学的健身计划和饮食建议',
        followers: 87000
      },
      {
        id: 4,
        name: '时尚博主',
        avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
        category: '时尚',
        description: '时尚杂志编辑，分享穿搭技巧和时尚趋势分析',
        followers: 75000
      },
      {
        id: 5,
        name: '学习达人',
        avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
        category: '教育',
        description: '教育学博士，分享高效学习方法和考试技巧',
        followers: 68000
      }
    ];
  }
};

// 获取内容趋势分析
const getContentTrends = async () => {
  try {
    console.log('正在获取内容趋势分析...');
    const response = await api.get('/inspiration/trends');
    console.log('成功获取内容趋势分析:', response);
    return response.data || response;
  } catch (error) {
    console.error('获取内容趋势分析失败:', error);
    console.log('错误详情:', error.response || error.message || error);
    
    // 如果API不可用，返回模拟数据
    console.log('使用备用模拟数据');
    return {
      categories: ['美食', '旅行', '健身', '时尚', '教育', '科技', '生活'],
      viewsByCategory: [12500, 9800, 8700, 7500, 6800, 6200, 5800],
      engagementByCategory: [8200, 7500, 6300, 5800, 4900, 4200, 3800],
      recentTrends: [
        { name: '短视频美食教程', growthRate: 85, engagement: 78 },
        { name: '国内小众旅游目的地', growthRate: 72, engagement: 65 },
        { name: '居家健身指南', growthRate: 68, engagement: 72 },
        { name: '可持续时尚', growthRate: 62, engagement: 58 },
        { name: '高效学习方法', growthRate: 55, engagement: 60 },
        { name: '科技产品评测', growthRate: 48, engagement: 52 },
        { name: '生活整理技巧', growthRate: 42, engagement: 45 }
      ]
    };
  }
};

const inspirationService = {
  getPopularContent,
  getRecommendedCreators,
  getContentTrends
};

export default inspirationService; 