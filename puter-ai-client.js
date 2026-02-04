// Puter AI Client
// Smart interface to Puter.ai API with cost optimization

const https = require('https');

class PuterAIClient {
    constructor(config = {}) {
        this.config = {
            apiBase: 'https://api.puter.com',
            authToken: config.authToken || process.env.PUTER_AUTH_TOKEN,
            defaultModel: config.defaultModel || 'openai/gpt-4o-mini',
            cache: new Map(),
            maxCacheSize: 100,
            requestBatchSize: 5,
            ...config
        };
        
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            cachedResponses: 0,
            tokensUsed: 0
        };
    }
    
    // Generate cache key from request
    generateCacheKey(messages, options) {
        const keyParts = [
            JSON.stringify(messages),
            options.model || this.config.defaultModel,
            options.temperature || '0.7',
            options.maxTokens || '1000'
        ];
        return Buffer.from(keyParts.join('|')).toString('base64');
    }
    
    // Make API request to Puter
    async makeRequest(endpoint, data, method = 'POST') {
        return new Promise((resolve, reject) => {
            const url = new URL(endpoint, this.config.apiBase);
            
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'puter-js/1.0',
                    'Origin': 'https://puter.work',
                    'Referer': 'https://puter.work/'
                }
            };
            
            // Add auth token if available
            if (this.config.authToken) {
                options.headers.Authorization = `Bearer ${this.config.authToken}`;
            }
            
            const req = https.request(url, options, (res) => {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsed = responseData ? JSON.parse(responseData) : {};
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(parsed);
                        } else {
                            reject(new Error(`API Error ${res.statusCode}: ${parsed.message || responseData}`));
                        }
                    } catch (error) {
                        reject(new Error(`Failed to parse response: ${error.message}`));
                    }
                });
            });
            
            req.on('error', reject);
            
            if (data) {
                req.write(JSON.stringify(data));
            }
            
            req.end();
        });
    }
    
    // Basic chat completion
    async chat(messages, options = {}) {
        const cacheKey = this.generateCacheKey(messages, options);
        
        // Check cache first
        if (this.config.cache.has(cacheKey)) {
            this.stats.cachedResponses++;
            return this.config.cache.get(cacheKey);
        }
        
        this.stats.totalRequests++;
        
        try {
            const payload = {
                interface: 'ai',
                driver: 'chat',
                method: 'chat',
                args: {
                    messages: Array.isArray(messages) ? messages : [{ role: 'user', content: messages }],
                    model: options.model || this.config.defaultModel,
                    temperature: options.temperature || 0.7,
                    max_tokens: options.maxTokens || 1000,
                    tools: options.tools || [],
                    ...options
                }
            };
            
            const response = await this.makeRequest('/drivers/call', payload);
            
            if (response && response.result) {
                // Cache the result
                if (this.config.cache.size >= this.config.maxCacheSize) {
                    // Remove oldest entry (first key)
                    const firstKey = this.config.cache.keys().next().value;
                    this.config.cache.delete(firstKey);
                }
                this.config.cache.set(cacheKey, response.result);
                this.stats.successfulRequests++;
                
                return response.result;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            this.stats.failedRequests++;
            throw error;
        }
    }
    
    // Web search enhanced research
    async research(query, options = {}) {
        const researchPrompt = `Please conduct comprehensive research on: "${query}"

        Provide:
        1. Overview and key facts
        2. Current trends and developments
        3. Statistics and data points
        4. Key players/companies/organizations involved
        5. Future predictions and outlook
        6. Controversies or debates
        7. Recommended sources for further reading
        
        ${options.includeSources ? 'Please include specific sources and citations.' : ''}
        ${options.depth === 'deep' ? 'Provide very detailed analysis with multiple perspectives.' : ''}
        ${options.depth === 'quick' ? 'Provide concise summary with key takeaways.' : ''}`;
        
        const researchOptions = {
            model: options.model || 'perplexity/sonar-deep-research',
            tools: [{ type: 'web_search' }],
            temperature: 0.3, // More factual
            maxTokens: options.maxTokens || 2000,
            ...options
        };
        
        return this.chat(researchPrompt, researchOptions);
    }
    
    // Batch multiple research queries
    async batchResearch(queries, options = {}) {
        const batchPrompt = `Please research the following ${queries.length} topics comprehensively:

        ${queries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

        For each topic, provide:
        - Key facts and overview
        - Important developments
        - Relevant statistics
        - Future outlook
        
        Structure the response as a numbered list for each topic.`;
        
        return this.chat(batchPrompt, {
            model: options.model || 'perplexity/sonar-deep-research',
            tools: [{ type: 'web_search' }],
            maxTokens: 4000,
            ...options
        });
    }
    
    // Generate blog/article draft
    async draftBlog(topic, options = {}) {
        const { length = '1500 words', tone = 'professional', includeResearch = true } = options;
        
        let researchContent = '';
        if (includeResearch) {
            researchContent = await this.research(topic, {
                depth: 'deep',
                includeSources: true
            });
        }
        
        const blogPrompt = `Write a ${length} blog post about "${topic}" in a ${tone} tone.

        ${includeResearch ? `Based on this research: ${researchContent.substring(0, 1000)}...` : ''}
        
        Structure:
        1. Engaging introduction
        2. Main content with sections/subheadings
        3. Data and examples
        4. Analysis and insights
        5. Conclusion with key takeaways
        6. Call to action or final thoughts
        
        Write in markdown format with appropriate headings.`;
        
        return this.chat(blogPrompt, {
            model: options.model || 'openai/gpt-4',
            temperature: 0.8, // More creative
            maxTokens: 3000,
            ...options
        });
    }
    
    // Get usage statistics
    getStats() {
        return {
            ...this.stats,
            cacheSize: this.config.cache.size,
            cacheHitRate: this.stats.totalRequests > 0 
                ? (this.stats.cachedResponses / this.stats.totalRequests * 100).toFixed(2) + '%'
                : '0%'
        };
    }
    
    // Clear cache
    clearCache() {
        this.config.cache.clear();
    }
}

module.exports = PuterAIClient;