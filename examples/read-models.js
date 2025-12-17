#!/usr/bin/env node

/**
 * Example: Reading and using Model Canon data
 * 
 * This script demonstrates how to read model definitions from the Model Canon
 * and perform common operations like listing models, comparing prices, and
 * checking capabilities.
 */

const fs = require('fs');
const path = require('path');

// Helper function to load all models
function loadAllModels() {
  const models = [];
  const modelsDir = path.join(__dirname, '..', 'models');
  
  // Read all provider directories
  const providers = fs.readdirSync(modelsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // Load each model file
  providers.forEach(provider => {
    const providerDir = path.join(modelsDir, provider);
    const modelFiles = fs.readdirSync(providerDir)
      .filter(file => file.endsWith('.json'));
    
    modelFiles.forEach(file => {
      const modelPath = path.join(providerDir, file);
      const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
      models.push(model);
    });
  });
  
  return models;
}

// Example 1: List all available models
function listAllModels() {
  console.log('\n=== All Available Models ===\n');
  const models = loadAllModels();
  
  models.forEach(model => {
    const tierIcon = model.tier.type === 'free' ? '🆓' : 
                     model.tier.type === 'freemium' ? '💰' : '💳';
    console.log(`${tierIcon} ${model.name} (${model.provider})`);
    console.log(`   ID: ${model.id}`);
    console.log(`   Status: ${model.availability.status}`);
    if (model.pricing) {
      console.log(`   Input: $${model.pricing.inputTokenPrice}/1k tokens`);
      console.log(`   Output: $${model.pricing.outputTokenPrice}/1k tokens`);
    }
    console.log('');
  });
}

// Example 2: Find cheapest model for a use case
function findCheapestModel(useCase) {
  console.log(`\n=== Cheapest Model for "${useCase}" ===\n`);
  const models = loadAllModels();
  
  const suitable = models.filter(model => 
    model.usage.intendedFor.includes(useCase) &&
    model.pricing && 
    model.availability.status === 'generally-available'
  );
  
  if (suitable.length === 0) {
    console.log('No suitable models found');
    return null;
  }
  
  suitable.sort((a, b) => a.pricing.inputTokenPrice - b.pricing.inputTokenPrice);
  
  const cheapest = suitable[0];
  console.log(`Model: ${cheapest.name}`);
  console.log(`Provider: ${cheapest.provider}`);
  console.log(`Input: $${cheapest.pricing.inputTokenPrice}/1k tokens`);
  console.log(`Output: $${cheapest.pricing.outputTokenPrice}/1k tokens`);
  console.log(`Context: ${cheapest.usage.capabilities.contextWindow} tokens`);
  
  return cheapest;
}

// Example 3: Compare models
function compareModels(modelIds) {
  console.log('\n=== Model Comparison ===\n');
  const models = loadAllModels();
  const toCompare = models.filter(m => modelIds.includes(m.id));
  
  console.log('Feature                 | ' + toCompare.map(m => m.name.padEnd(20)).join(' | '));
  console.log('-'.repeat(25 + (toCompare.length * 23)));
  
  console.log('Provider                | ' + toCompare.map(m => m.provider.padEnd(20)).join(' | '));
  console.log('Input Price ($/1k)      | ' + toCompare.map(m => `$${m.pricing?.inputTokenPrice || 'N/A'}`.padEnd(20)).join(' | '));
  console.log('Output Price ($/1k)     | ' + toCompare.map(m => `$${m.pricing?.outputTokenPrice || 'N/A'}`.padEnd(20)).join(' | '));
  console.log('Context Window          | ' + toCompare.map(m => `${m.usage.capabilities.contextWindow}`.padEnd(20)).join(' | '));
  console.log('Function Calling        | ' + toCompare.map(m => (m.usage.capabilities.supportsFunctionCalling ? '✓' : '✗').padEnd(20)).join(' | '));
  console.log('Vision                  | ' + toCompare.map(m => (m.usage.capabilities.supportsVision ? '✓' : '✗').padEnd(20)).join(' | '));
}

// Example 4: Estimate cost
function estimateCost(modelId, inputTokens, outputTokens) {
  console.log(`\n=== Cost Estimate for ${modelId} ===\n`);
  const models = loadAllModels();
  const model = models.find(m => m.id === modelId);
  
  if (!model) {
    console.log('Model not found');
    return null;
  }
  
  if (!model.pricing) {
    console.log('Model is free or pricing not available');
    return { total: 0 };
  }
  
  const inputCost = (inputTokens / 1000) * model.pricing.inputTokenPrice;
  const outputCost = (outputTokens / 1000) * model.pricing.outputTokenPrice;
  const total = inputCost + outputCost;
  
  console.log(`Input tokens: ${inputTokens.toLocaleString()}`);
  console.log(`Output tokens: ${outputTokens.toLocaleString()}`);
  console.log(`Input cost: $${inputCost.toFixed(4)}`);
  console.log(`Output cost: $${outputCost.toFixed(4)}`);
  console.log(`Total cost: $${total.toFixed(4)}`);
  
  return { input: inputCost, output: outputCost, total };
}

// Example 5: Find models with specific capabilities
function findModelsByCapability(capability) {
  console.log(`\n=== Models with ${capability} ===\n`);
  const models = loadAllModels();
  
  const matching = models.filter(model => {
    const caps = model.usage.capabilities;
    switch(capability) {
      case 'vision': return caps.supportsVision;
      case 'function-calling': return caps.supportsFunctionCalling;
      case 'streaming': return caps.supportsStreaming;
      default: return false;
    }
  });
  
  matching.forEach(model => {
    console.log(`• ${model.name} (${model.provider})`);
  });
}

// Main execution
function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║     Model Canon Example Usage          ║');
  console.log('╚════════════════════════════════════════╝');
  
  // Run examples
  listAllModels();
  findCheapestModel('chat');
  compareModels(['gpt-4', 'claude-3-sonnet', 'gemini-pro']);
  estimateCost('gpt-4-turbo', 10000, 2000);
  findModelsByCapability('vision');
  
  console.log('\n✅ All examples completed successfully!\n');
}

// Run if executed directly
if (require.main === module) {
  main();
}

// Export for use as a module
module.exports = {
  loadAllModels,
  listAllModels,
  findCheapestModel,
  compareModels,
  estimateCost,
  findModelsByCapability
};
