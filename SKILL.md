# Puter AI Skill

## Description
Smart AI research and content generation using Puter.ai's free AI searcher with user-pays model. Optimizes requests to minimize costs (1 our request = 10-100 their requests).

## Features
- Free AI research using Puter's user-pays model
- Web search capabilities via Perplexity/Sonar
- Multiple AI model support (GPT-4, Claude, Gemini, etc.)
- Smart request batching and caching
- Cost optimization: 1 our request = multiple their requests
- Blog/article research and drafting

## Requirements
- Puter account (free tier available)
- Authentication token (obtained via OAuth)
- Internet connection

## Installation
```bash
# Install in OpenClaw skills directory
cp -r puter-ai-skill /usr/lib/node_modules/openclaw/skills/
```

## Usage

### Basic AI Chat
```javascript
const result = await puterAI.chat("What is quantum computing?", {
    model: "openai/gpt-4o",
    temperature: 0.7
});
```

### Web-Enhanced Research
```javascript
const research = await puterAI.research("Environmental impact of electric vehicles", {
    model: "perplexity/sonar-deep-research",
    depth: "deep", // deep/medium/quick
    sources: 10
});
```

### Blog Draft Generation
```javascript
const blog = await puterAI.draftBlog({
    topic: "AI in Education",
    length: "1500 words",
    tone: "professional",
    includeResearch: true
});
```

## API Configuration
The skill uses Puter's API at `https://api.puter.com/drivers/call`.

Authentication via bearer token obtained through:
1. User OAuth flow (preferred for user-pays model)
2. Shared service account (for testing)

## Cost Optimization Strategy
1. **Request Batching**: Combine multiple related queries into one request
2. **Result Caching**: Store and reuse research results
3. **Smart Prompting**: Use comprehensive prompts that generate extensive outputs
4. **Research Depth**: Configure depth levels (quick/medium/deep) based on need

## Examples

### 1. Comprehensive Research
```javascript
// One request that generates comprehensive research
const comprehensive = await puterAI.comprehensiveResearch(
    "Future of renewable energy",
    {
        subtopics: ["solar", "wind", "battery storage", "policy"],
        includeStats: true,
        includePredictions: true,
        includeCaseStudies: true
    }
);
```

### 2. Multi-Model Analysis
```javascript
// Get perspectives from different AI models
const analysis = await puterAI.multiModelAnalysis(
    "Ethics of AI in healthcare",
    {
        models: ["openai/gpt-4", "anthropic/claude-3", "google/gemini-pro"],
        compare: true
    }
);
```

## Error Handling
- Automatic retry on rate limits
- Fallback to different models if one fails
- Graceful degradation when web search unavailable

## Monitoring
- Usage tracking per user/session
- Cost estimation (based on Puter's pricing)
- Performance metrics

## Integration with OpenClaw
- Can be called from other skills
- Results stored in memory for reuse
- Supports streaming for long responses

---

*Note: This skill uses Puter's user-pays model. Users authenticate and pay for their own AI usage. No API keys or infrastructure costs for developers.*