# Model Canon Examples

This directory contains example code demonstrating how to read and use model definitions from the Model Canon.

## Available Examples

### `read-models.js`

Node.js script demonstrating common operations:
- Loading all models from the repository
- Listing models with their details
- Finding the cheapest model for a use case
- Comparing multiple models side-by-side
- Estimating costs for specific workloads
- Finding models by capability (vision, function calling, etc.)

**Usage:**
```bash
node examples/read-models.js
```

**Requirements:**
- Node.js (tested with v18+)
- Access to the models directory (run from repository root)

## Creating Your Own Integration

The examples show read-only patterns that can be adapted for any programming language:

1. **Load model definitions** from JSON files
2. **Parse the standardized structure** (see schema/model.schema.json)
3. **Filter and query** based on your needs
4. **Cache appropriately** to reduce file system/API calls

## Key Concepts

### Loading Models

```javascript
// Load a specific model
const model = JSON.parse(
  fs.readFileSync('./models/openai/gpt-4.json', 'utf8')
);

// Access model properties
console.log(model.name);                    // "GPT-4"
console.log(model.pricing.inputTokenPrice); // 0.03
```

### Filtering Models

```javascript
// Find models that support a specific use case
const chatModels = allModels.filter(m => 
  m.usage.intendedFor.includes('chat')
);

// Find free or freemium models
const freeModels = allModels.filter(m =>
  m.tier.type === 'free' || m.tier.type === 'freemium'
);
```

### Cost Estimation

```javascript
// Calculate cost for a workload
function estimateCost(model, inputTokens, outputTokens) {
  const inputCost = (inputTokens / 1000) * model.pricing.inputTokenPrice;
  const outputCost = (outputTokens / 1000) * model.pricing.outputTokenPrice;
  return inputCost + outputCost;
}
```

## Contributing Examples

If you've created a useful example in another language:
1. Add it to this directory
2. Document it in this README
3. Submit a pull request

### Example Contributions We'd Love to See

- Python example using the canon
- Go example with caching
- TypeScript example with types
- Shell script for quick queries
- Docker container that serves model data

## Best Practices

1. **Read-Only**: Never modify model files in your code
2. **Cache**: Load once, use many times
3. **Handle Missing Data**: Not all optional fields are present
4. **Check Status**: Verify `availability.status` before using
5. **Validate**: Ensure model definitions conform to schema

## Questions?

See the main [README.md](../README.md) and [AGENT_GUIDE.md](../AGENT_GUIDE.md) for more information.