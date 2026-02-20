export function generateId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export function formatDate(date) {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}`
}

export function highlightKeywords(text, keywords) {
    if (!text || !keywords) return text
    
    let result = text
    
    if (keywords.names && keywords.names.length > 0) {
        keywords.names.forEach(name => {
            result = result.replace(new RegExp(name, 'g'), `<span style="color: red; font-weight: bold;">${name}</span>`)
        })
    }
    
    if (keywords.actions && keywords.actions.length > 0) {
        keywords.actions.forEach(action => {
            result = result.replace(new RegExp(action, 'g'), `<span style="color: purple;">${action}</span>`)
        })
    }
    
    if (keywords.emotions && keywords.emotions.length > 0) {
        keywords.emotions.forEach(emotion => {
            result = result.replace(new RegExp(emotion, 'g'), `<span style="color: green;">${emotion}</span>`)
        })
    }
    
    if (keywords.locations && keywords.locations.length > 0) {
        keywords.locations.forEach(location => {
            result = result.replace(new RegExp(location, 'g'), `<span style="color: #DAA520;">${location}</span>`)
        })
    }
    
    return result
}

export function validateInput(type, value) {
    if (!value) return false
    
    switch (type) {
        case 'username':
            return value.length >= 3 && value.length <= 20
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        case 'password':
            return value.length >= 6 && value.length <= 50
        case 'bookTitle':
            return value.length >= 1 && value.length <= 100
        case 'plot':
            return value.length >= 1 && value.length <= 100
        default:
            return true
    }
}

export function extractKeywords(text) {
    const keywords = {
        names: [],
        actions: [],
        emotions: [],
        locations: []
    }
    
    const actionWords = ['飞向', '奔跑', '跳跃', '游泳', '飞翔', '走', '跑', '跳', '爬', '游泳', '战斗', '攻击', '防御', '逃跑', '追逐', '寻找', '发现', '探索', '冒险', '旅行', '来到', '进入', '离开', '返回', '到达']
    const emotionWords = ['快乐', '悲伤', '愤怒', '恐惧', '惊讶', '兴奋', '紧张', '放松', '开心', '难过', '生气', '害怕', '好奇', '期待', '满足', '失望', '希望', '担心', '安心', '幸福']
    const locationWords = ['城堡', '森林', '海洋', '天空', '山脉', '洞穴', '城市', '村庄', '岛屿', '沙漠', '雪山', '湖泊', '河流', '草原', '花园', '宫殿', '塔楼', '地下室', '屋顶', '广场']
    
    actionWords.forEach(word => {
        if (text.includes(word) && !keywords.actions.includes(word)) {
            keywords.actions.push(word)
        }
    })
    
    emotionWords.forEach(word => {
        if (text.includes(word) && !keywords.emotions.includes(word)) {
            keywords.emotions.push(word)
        }
    })
    
    locationWords.forEach(word => {
        if (text.includes(word) && !keywords.locations.includes(word)) {
            keywords.locations.push(word)
        }
    })
    
    return keywords
}

export function generateShareCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export function getCurrentTimestamp() {
    return new Date().toISOString()
}

export function sanitizeInput(input) {
    if (typeof input !== 'string') return input
    return input.replace(/<[^>]*>/g, '').trim()
}

export function parseJsonSafely(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString)
    } catch {
        return defaultValue
    }
}
