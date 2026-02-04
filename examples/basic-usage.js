// Basic Usage Example for Puter AI Skill
// Demonstrates cost-efficient AI research

const PuterAISkill = require('../src/index');

async function runExamples() {
    console.log('⚡ Puter AI Skill - Basic Usage Examples\n');
    
    // Initialize skill (requires PUTER_AUTH_TOKEN environment variable)
    const skill = new PuterAISkill({
        // authToken: process.env.PUTER_AUTH_TOKEN, // Uncomment with actual token
        defaultModel: 'openai/gpt-4o-mini',
        maxCacheSize: 100
    });
    
    console.log('1. SIMPLE CHAT');
    console.log('---------------');
    try {
        const response = await skill.chat('Explain quantum computing in simple terms');
        console.log('Response:', response.substring(0, 200) + '...\n');
    } catch (error) {
        console.log('Error (expected without auth):', error.message + '\n');
    }
    
    console.log('2. DEEP RESEARCH');
    console.log('-----------------');
    try {
        const research = await skill.research('Artificial Intelligence in Healthcare 2025', {
            depth: 'deep',
            includeSources: true,
            maxTokens: 2500
        });
        console.log('Research Summary:', research.substring(0, 300) + '...\n');
    } catch (error) {
        console.log('Error (expected without auth):', error.message + '\n');
    }
    
    console.log('3. BATCH RESEARCH');
    console.log('------------------');
    try {
        const batchResults = await skill.batchResearch([
            'Renewable energy adoption rates',
            'Carbon capture technology',
            'Sustainable agriculture innovations'
        ], {
            model: 'perplexity/sonar-deep-research',
            includeSources: true
        });
        console.log('Batch Results:', batchResults.substring(0, 400) + '...\n');
    } catch (error) {
        console.log('Error (expected without auth):', error.message + '\n');
    }
    
    console.log('4. BLOG GENERATION');
    console.log('-------------------');
    try {
        const blog = await skill.draftBlog('The Future of Remote Work in 2026', {
            length: '1200 words',
            tone: 'professional',
            includeResearch: true,
            targetKeywords: ['remote work', 'future of work', 'digital nomad', '2026 trends']
        });
        console.log('Blog Excerpt:', blog.substring(0, 500) + '...\n');
    } catch (error) {
        console.log('Error (expected without auth):', error.message + '\n');
    }
    
    console.log('5. STATISTICS & OPTIMIZATION REPORT');
    console.log('------------------------------------');
    console.log(skill.getStats());
    console.log('\n' + skill.getOptimizationReport());
    
    console.log('\n✅ Examples Completed');
    console.log('\n📋 To use this skill with authentication:');
    console.log('1. Sign up at https://puter.com');
    console.log('2. Get your auth token');
    console.log('3. Set PUTER_AUTH_TOKEN environment variable');
    console.log('4. Uncomment authToken in constructor');
    console.log('\n💡 Remember: 1 optimized request = 10-100 traditional requests!');
}

// Run examples
if (require.main === module) {
    runExamples().catch(console.error);
}

module.exports = { runExamples };