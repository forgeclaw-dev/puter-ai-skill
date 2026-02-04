// OpenClaw Skill: Puter AI Research
// Wraps PuterAIClient for OpenClaw integration

const PuterAIClient = require('./puter-ai-client');

class PuterAISkill {
    constructor(config = {}) {
        this.name = 'Puter AI Research';
        this.version = '1.0.0';
        this.description = 'Smart AI research using Puter.ai with cost optimization';
        
        this.client = new PuterAIClient(config);
        this.researchHistory = [];
        this.maxHistoryItems = 50;
    }
    
    // Main skill entry point
    async execute(task, options = {}) {
        console.log(`[PuterAI] Executing: ${task.substring(0, 100)}...`);
        
        try {
            let result;
            
            // Parse task type
            if (task.toLowerCase().includes('research') || task.toLowerCase().includes('study')) {
                result = await this.research(task, options);
            } else if (task.toLowerCase().includes('blog') || task.toLowerCase().includes('article')) {
                result = await this.draftBlog(task, options);
            } else if (task.toLowerCase().includes('batch') || task.includes(',')) {
                const queries = task.split(',').map(q => q.trim()).filter(q => q);
                result = await this.batchResearch(queries, options);
            } else {
                // Default to chat
                result = await this.chat(task, options);
            }
            
            // Store in history
            this.addToHistory({
                task,
                result: typeof result === 'string' ? result.substring(0, 500) + '...' : 'Object result',
                timestamp: new Date().toISOString(),
                stats: this.client.getStats()
            });
            
            return result;
        } catch (error) {
            console.error('[PuterAI] Error:', error.message);
            throw error;
        }
    }
    
    // Convenience methods
    async chat(message, options = {}) {
        return this.client.chat(message, options);
    }
    
    async research(topic, options = {}) {
        return this.client.research(topic, options);
    }
    
    async batchResearch(queries, options = {}) {
        return this.client.batchResearch(queries, options);
    }
    
    async draftBlog(topic, options = {}) {
        return this.client.draftBlog(topic, options);
    }
    
    // History management
    addToHistory(item) {
        this.researchHistory.unshift(item);
        if (this.researchHistory.length > this.maxHistoryItems) {
            this.researchHistory.pop();
        }
    }
    
    getHistory(limit = 10) {
        return this.researchHistory.slice(0, limit);
    }
    
    clearHistory() {
        this.researchHistory = [];
    }
    
    // Statistics
    getStats() {
        return {
            skill: this.name,
            version: this.version,
            clientStats: this.client.getStats(),
            historyCount: this.researchHistory.length,
            lastActivity: this.researchHistory[0]?.timestamp || 'Never'
        };
    }
    
    // Cost optimization report
    getOptimizationReport() {
        const stats = this.client.getStats();
        return `
        ⚡ Puter AI Cost Optimization Report ⚡
        
        Total Requests: ${stats.totalRequests}
        Successful: ${stats.successfulRequests}
        Failed: ${stats.failedRequests}
        Cached Responses: ${stats.cachedResponses}
        Cache Hit Rate: ${stats.cacheHitRate}
        
        💡 Optimization Strategy:
        • 1 our request = comprehensive output (saves 10-100 their requests)
        • Smart caching reduces duplicate calls
        • Batch research combines multiple topics
        • Web search integration minimizes manual research
        
        📊 Efficiency: ${stats.totalRequests > 0 ? Math.round((stats.cachedResponses / stats.totalRequests) * 100) : 0}% cache utilization
        `;
    }
}

// Export for OpenClaw
module.exports = PuterAISkill;