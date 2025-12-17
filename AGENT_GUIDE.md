# Quick Start Guide for Agents

This guide is for automated systems (agents) that need to read model information from the Model Canon.

## Important Rules

✅ **You MAY:**
- Read model definitions
- Parse JSON files
- Cache model information
- Query the repository via Git or GitHub API

❌ **You MUST NOT:**
- Create pull requests
- Commit changes
- Modify any files
- Push to any branch
- Open issues (unless specifically designed for human notification)

## Reading Model Data

### Option 1: Direct File Access (Recommended for Local Systems)

```bash
# Clone the repository
git clone https://github.com/forestdeven-sys/model-canon.git
cd model-canon

# Read a specific model
cat models/openai/gpt-4.json | jq .

# List all models
find models -name "*.json" -not -name "index.json"
```

### Option 2: GitHub Raw Content API (Recommended for Remote Systems)

```javascript
// Fetch a specific model
const response = await fetch(
  'https://raw.githubusercontent.com/forestdeven-sys/model-canon/main/models/openai/gpt-4.json'
);
const model = await response.json();

console.log(`Model: ${model.name}`);
console.log(`Input price: $${model.pricing.inputTokenPrice} per 1k tokens`);
console.log(`Output price: $${model.pricing.outputTokenPrice} per 1k tokens`);
```

### Option 3: GitHub Contents API (For Programmatic Discovery)

```python
import requests
import json

# List all models in a provider directory
response = requests.get(
    'https://api.github.com/repos/forestdeven-sys/model-canon/contents/models/openai',
    headers={'Accept': 'application/vnd.github+json'}
)

for file in response.json():
    if file['name'].endswith('.json'):
        # Download the model definition
        model_response = requests.get(file['download_url'])
        model = model_response.json()
        print(f"Found model: {model['name']}")
```

## Understanding Model Structure

Each model has the following key information:

```javascript
{
  "id": "gpt-4",                    // Unique identifier
  "name": "GPT-4",                  // Human-readable name
  "provider": "OpenAI",             // Provider name
  "availability": {
    "status": "generally-available", // Current status
    "regions": ["global"],           // Available regions
    "lastUpdated": "2024-12-01"      // Last verified date
  },
  "tier": {
    "type": "paid",                  // "free", "paid", or "freemium"
    "freeQuota": { /* if applicable */ }
  },
  "pricing": {
    "inputTokenPrice": 0.03,         // USD per 1k input tokens
    "outputTokenPrice": 0.06,        // USD per 1k output tokens
    "currency": "USD",
    "unit": "per-1k-tokens",
    "lastUpdated": "2024-12-01"
  },
  "usage": {
    "intendedFor": ["chat", "completion"],  // Use cases
    "capabilities": {
      "contextWindow": 8192,          // Max context in tokens
      "maxOutputTokens": 4096,        // Max output tokens
      "supportsFunctionCalling": true,
      "supportsVision": false,
      "supportsStreaming": true
    }
  }
}
```

## Filtering Models by Criteria

### Find Free or Freemium Models

```bash
# Using jq
find models -name "*.json" -not -name "index.json" -exec jq -r 'select(.tier.type == "free" or .tier.type == "freemium") | .name' {} \;
```

### Find Models Supporting Vision

```bash
# Using jq
find models -name "*.json" -not -name "index.json" -exec jq -r 'select(.usage.capabilities.supportsVision == true) | .name' {} \;
```

### Find Models by Price Range

```bash
# Find models with input price < $0.01 per 1k tokens
find models -name "*.json" -not -name "index.json" -exec jq -r 'select(.pricing.inputTokenPrice < 0.01) | .name' {} \;
```

## Caching Strategy

To reduce API calls and improve performance:

1. **Clone locally** and update periodically (recommended for frequent access)
2. **Cache with TTL** (e.g., 24 hours) for remote fetches
3. **Watch for updates** using GitHub webhooks or polling

Example caching logic:

```javascript
class ModelCanonCache {
  constructor(ttlHours = 24) {
    this.cache = new Map();
    this.ttl = ttlHours * 60 * 60 * 1000;
  }

  async getModel(modelId) {
    const cached = this.cache.get(modelId);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }

    const data = await this.fetchModel(modelId);
    this.cache.set(modelId, { data, timestamp: Date.now() });
    return data;
  }

  async fetchModel(modelId) {
    // Fetch from GitHub raw content
    const [provider] = modelId.split('-');
    const url = `https://raw.githubusercontent.com/forestdeven-sys/model-canon/main/models/${provider}/${modelId}.json`;
    const response = await fetch(url);
    return response.json();
  }
}
```

## Checking for Updates

### Using Git

```bash
# Fetch latest changes
git fetch origin main

# Check if there are updates
git diff origin/main --name-only
```

### Using GitHub API

```bash
# Get latest commit on main branch
curl -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/forestdeven-sys/model-canon/commits/main
```

## Common Integration Patterns

### Pattern 1: Model Selection Agent

```javascript
// Agent that selects the best model for a task
async function selectModelForTask(task, budget) {
  const models = await fetchAllModels();
  
  // Filter by capabilities
  const suitable = models.filter(m => 
    m.usage.intendedFor.includes(task) &&
    (budget === null || m.pricing.inputTokenPrice <= budget)
  );
  
  // Sort by price (cheapest first)
  suitable.sort((a, b) => 
    a.pricing.inputTokenPrice - b.pricing.inputTokenPrice
  );
  
  return suitable[0]; // Return cheapest suitable model
}
```

### Pattern 2: Cost Estimation Agent

```javascript
// Agent that estimates cost for a task
function estimateCost(modelId, inputTokens, outputTokens) {
  const model = loadModel(modelId);
  const inputCost = (inputTokens / 1000) * model.pricing.inputTokenPrice;
  const outputCost = (outputTokens / 1000) * model.pricing.outputTokenPrice;
  return {
    total: inputCost + outputCost,
    currency: model.pricing.currency,
    breakdown: { input: inputCost, output: outputCost }
  };
}
```

### Pattern 3: Availability Check Agent

```javascript
// Agent that checks if a model is available
function isModelAvailable(modelId, region = 'global') {
  const model = loadModel(modelId);
  return (
    model.availability.status === 'generally-available' &&
    (model.availability.regions.includes(region) ||
     model.availability.regions.includes('global'))
  );
}
```

## Error Handling

Handle these common scenarios:

```javascript
try {
  const model = await fetchModel('gpt-4');
} catch (error) {
  if (error.status === 404) {
    // Model not found in canon
    console.error('Model not in canon, consider updating');
  } else if (error.status === 403) {
    // Rate limited or access denied
    console.error('API rate limit or access issue');
  } else {
    // Network or other error
    console.error('Failed to fetch model:', error);
  }
}
```

## Best Practices

1. ✅ **Cache aggressively** - Models change infrequently
2. ✅ **Handle missing models gracefully** - Not all models are in the canon
3. ✅ **Respect rate limits** - Use caching to reduce API calls
4. ✅ **Check lastUpdated dates** - Verify data freshness
5. ✅ **Fall back to defaults** - Have sensible defaults if canon is unavailable
6. ❌ **Don't parse from documentation** - Always use the canonical JSON
7. ❌ **Don't hardcode model info** - Always read from the canon
8. ❌ **Don't attempt to write** - Never modify the repository

## Support

If you discover incorrect information in the Model Canon:
- **Do NOT** attempt to fix it yourself
- **Do** notify a human maintainer
- Include source documentation in your notification

Example notification:
```
Subject: Model Canon data appears outdated for GPT-4

Model: models/openai/gpt-4.json
Issue: Pricing shows $0.03/1k input tokens, but official docs show $0.025
Source: https://openai.com/pricing
Date Checked: 2024-12-15

Please update when possible.
```

## Additional Resources

- Full schema: `schema/model.schema.json`
- Contributing guide (for humans): `CONTRIBUTING.md`
- Security and governance: `SECURITY.md`
- Repository README: `README.md`

Remember: You are a trusted reader of this canonical data. Help maintain its integrity by never attempting to modify it.