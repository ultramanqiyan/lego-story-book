import { createSuccessResponse, createErrorResponse, handleCORS } from './utils.js';

export async function onRequestOptions(context) {
  return handleCORS();
}

export const PLOT_OPTIONS = {
  weather: [
    { id: 'sunny', name: '晴天', icon: '☀️', description: '阳光明媚，适合户外冒险' },
    { id: 'rainy', name: '下雨', icon: '🌧️', description: '雨水淅沥，需要寻找避雨处' },
    { id: 'thunder', name: '打雷', icon: '⛈️', description: '雷声轰鸣，充满紧张气氛' },
    { id: 'snow', name: '下雪', icon: '❄️', description: '白雪皑皑，银装素裹的世界' },
    { id: 'fog', name: '大雾', icon: '🌫️', description: '迷雾重重，能见度很低' },
    { id: 'wind', name: '狂风', icon: '💨', description: '狂风呼啸，考验勇气' },
    { id: 'rainbow', name: '彩虹', icon: '🌈', description: '彩虹横跨，充满希望' },
    { id: 'starry', name: '星夜', icon: '🌟', description: '繁星点点，神秘浪漫' }
  ],
  adventureType: [
    { id: 'friendship', name: '友谊考验', icon: '🤝', description: '测试角色之间的友情' },
    { id: 'adventure', name: '冒险之旅', icon: '🗺️', description: '充满未知的探索旅程' },
    { id: 'wisdom', name: '智慧挑战', icon: '🧠', description: '需要动脑筋解决问题' },
    { id: 'courage', name: '勇气试炼', icon: '💪', description: '面对恐惧，勇敢前行' },
    { id: 'treasure', name: '寻宝探险', icon: '💎', description: '寻找隐藏的宝藏' },
    { id: 'rescue', name: '救援任务', icon: '🦸', description: '拯救被困的朋友' },
    { id: 'mystery', name: '神秘探索', icon: '🔮', description: '探索未知的秘密' },
    { id: 'competition', name: '竞技比赛', icon: '🏆', description: '参加激烈的比赛' }
  ],
  terrain: [
    { id: 'forest', name: '森林', icon: '🌲', description: '茂密的树林，充满生机' },
    { id: 'castle', name: '城堡', icon: '🏰', description: '宏伟的城堡，神秘莫测' },
    { id: 'ocean', name: '海洋', icon: '🌊', description: '广阔的海洋，深不可测' },
    { id: 'desert', name: '沙漠', icon: '🏜️', description: '干燥的沙漠，考验耐力' },
    { id: 'mountain', name: '山峰', icon: '⛰️', description: '高耸的山峰，挑战极限' },
    { id: 'glacier', name: '冰川', icon: '🧊', description: '寒冷的冰川，晶莹剔透' },
    { id: 'volcano', name: '火山', icon: '🌋', description: '活跃的火山，危险刺激' },
    { id: 'city', name: '城市', icon: '🏙️', description: '繁华的城市，人来人往' }
  ],
  equipment: [
    { id: 'wand', name: '魔法杖', icon: '🪄', description: '拥有神奇魔力的法杖' },
    { id: 'shield', name: '盾牌', icon: '🛡️', description: '坚固的防御装备' },
    { id: 'map', name: '地图', icon: '🗺️', description: '指引方向的神秘地图' },
    { id: 'telescope', name: '望远镜', icon: '🔭', description: '观察远方的工具' },
    { id: 'sword', name: '宝剑', icon: '⚔️', description: '锋利的战斗武器' },
    { id: 'potion', name: '药水', icon: '🧪', description: '神奇的治愈药水' },
    { id: 'flyer', name: '飞行器', icon: '🚀', description: '可以飞行的交通工具' },
    { id: 'cloak', name: '隐身斗篷', icon: '🧥', description: '可以隐身的神奇斗篷' }
  ]
};

export function getPlotName(category, id) {
  var options = PLOT_OPTIONS[category];
  if (!options) return id;
  
  for (var i = 0; i < options.length; i++) {
    if (options[i].id === id) {
      return options[i].name;
    }
  }
  return id;
}

export function getPlotOption(category, id) {
  var options = PLOT_OPTIONS[category];
  if (!options) return null;
  
  for (var i = 0; i < options.length; i++) {
    if (options[i].id === id) {
      return options[i];
    }
  }
  return null;
}

export function getRandomPlotSelection() {
  var getRandomItem = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };
  
  return {
    weather: getRandomItem(PLOT_OPTIONS.weather).id,
    adventureType: getRandomItem(PLOT_OPTIONS.adventureType).id,
    terrain: getRandomItem(PLOT_OPTIONS.terrain).id,
    equipment: getRandomItem(PLOT_OPTIONS.equipment).id
  };
}

export function buildPlotPrompt(plotSelection) {
  if (!plotSelection) return '';
  
  var prompt = '【情节设定】\n';
  
  if (plotSelection.weather) {
    var weather = getPlotOption('weather', plotSelection.weather);
    if (weather) {
      prompt += '天气：' + weather.icon + ' ' + weather.name + ' - ' + weather.description + '\n';
    }
  }
  
  if (plotSelection.adventureType) {
    var adventure = getPlotOption('adventureType', plotSelection.adventureType);
    if (adventure) {
      prompt += '冒险类型：' + adventure.icon + ' ' + adventure.name + ' - ' + adventure.description + '\n';
    }
  }
  
  if (plotSelection.terrain) {
    var terrain = getPlotOption('terrain', plotSelection.terrain);
    if (terrain) {
      prompt += '地形：' + terrain.icon + ' ' + terrain.name + ' - ' + terrain.description + '\n';
    }
  }
  
  if (plotSelection.equipment) {
    var equipment = getPlotOption('equipment', plotSelection.equipment);
    if (equipment) {
      prompt += '装备：' + equipment.icon + ' ' + equipment.name + ' - ' + equipment.description + '\n';
    }
  }
  
  prompt += '\n请根据以上情节设定创作故事，让天气、冒险类型、地形和装备自然融入故事中。\n\n';
  
  return prompt;
}

export async function onRequestGet(context) {
  try {
    return createSuccessResponse({ plotOptions: PLOT_OPTIONS });
  } catch (error) {
    return createErrorResponse('获取情节选项失败', 500);
  }
}
