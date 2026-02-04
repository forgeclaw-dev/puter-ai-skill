// Demo script for Puter AI Skill
// Shows how it would work with authentication

const PuterAISkill = require('./index');

async function demo() {
    console.log('🚀 Puter AI Skill Demo\n');
    
    // Initialize skill (would need actual auth token)
    const skill = new PuterAISkill({
        // authToken: 'YOUR_PUTER_AUTH_TOKEN', // Required for real usage
        defaultModel: 'openai/gpt-4o-mini',
        maxCacheSize: 50
    });
    
    console.log('1. Testing chat functionality...');
    try {
        const chatResult = await skill.chat('What are the benefits of solar energy?');
        console.log('Chat Result:', chatResult.substring(0, 300) + '...\n');
    } catch (error) {
        console.log('Chat Error (expected without auth):', error.message + '\n');
    }
    
    console.log('2. Testing research functionality...');
    try {
        const researchResult = await skill.research('Future of electric vehicles', {
            depth: 'medium',
            includeSources: true
        });
        console.log('Research Result:', researchResult.substring(0, 300) + '...\n');
    } catch (error) {
        console.log('Research Error (expected without auth):', error.message + '\n');
    }
    
    console.log('3. Testing batch research...');
    try {
        const batchResult = await skill.batchResearch([
            'AI in healthcare',
            'Blockchain technology',
            'Renewable energy trends'
        ]);
        console.log('Batch Result:', batchResult.substring(0, 300) + '...\n');
    } catch (error) {
        console.log('Batch Error (expected without auth):', error.message + '\n');
    }
    
    console.log('4. Testing blog drafting...');
    try {
        const blogResult = await skill.draftBlog('The Impact of AI on Education', {
            length: '1000 words',
            tone: 'informative',
            includeResearch: true
        });
        console.log('Blog Draft:', blogResult.substring(0, 300) + '...\n');
    } catch (error) {
        console.log('Blog Error (expected without auth):', error.message + '\n');
    }
    
    console.log('📊 Skill Statistics:');
    console.log(skill.getStats());
    
    console.log('\n💰 Cost Optimization Report:');
    console.log(skill.getOptimizationReport());
    
    console.log('\n✅ Demo completed. To use for real:');
    console.log('1. Get Puter auth token (user authentication)');
    console.log('2. Set PUTER_AUTH_TOKEN environment variable');
    console.log('3. Or pass authToken in constructor');
    console.log('4. The skill will optimize 1 request = 10-100 Puter requests');
}

// Run demo
demo().catch(console.error);