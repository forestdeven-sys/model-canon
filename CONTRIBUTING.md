# Contributing to Model Canon

Thank you for your interest in maintaining the Model Canon! This document outlines the process for contributing to this authoritative reference.

## Core Principles

1. **Human-Only Updates**: This repository can only be modified by humans through reviewed pull requests
2. **Accuracy is Paramount**: All information must be verified against official sources
3. **Agent Read-Only**: Automated systems may only read from this repository, never write
4. **Transparency**: All changes are tracked and documented

## Who Can Contribute

Contributors should be:
- Authorized members of the Axiom ecosystem
- Familiar with AI model offerings and pricing
- Able to verify information against official provider documentation

## What to Contribute

### Adding a New Model

1. Create a new JSON file in the appropriate provider directory (e.g., `models/openai/new-model.json`)
2. Follow the schema defined in `schema/model.schema.json`
3. Include all required fields:
   - `id`: Unique identifier (lowercase, hyphen-separated)
   - `name`: Official model name
   - `provider`: Provider name
   - `availability`: Current status and regions
   - `tier`: Pricing tier with free quota if applicable
   - `usage`: Intended use cases and capabilities
   - `pricing`: Token costs (if paid/freemium)
   - `metadata`: Release date, documentation URL, notes

4. Verify all information against official provider documentation
5. Include the documentation URL in the `metadata.documentation` field

### Updating Existing Models

Common updates include:
- **Pricing changes**: Update `pricing.inputTokenPrice`, `pricing.outputTokenPrice`, and `pricing.lastUpdated`
- **Availability changes**: Update `availability.status` (e.g., "beta" → "generally-available")
- **Capability updates**: Add new features to `usage.capabilities`
- **Deprecation**: Change `availability.status` to "deprecated" or "discontinued"

Always update the relevant `lastUpdated` field when making changes.

### Schema Modifications

Changes to `schema/model.schema.json` require:
1. Discussion in an issue first
2. Backward compatibility considerations
3. Updates to existing model definitions if needed
4. Documentation updates

## Pull Request Process

### 1. Create a Branch

```bash
git checkout -b update/model-name
```

### 2. Make Your Changes

- Edit or create model JSON files
- Ensure JSON is valid and properly formatted
- Verify against the schema

### 3. Validate Locally

```bash
# Validate JSON syntax
cat models/provider/model.json | jq .

# Optionally validate against schema using a JSON schema validator
```

### 4. Commit with Descriptive Messages

```bash
git add models/provider/model.json
git commit -m "Update GPT-4 pricing (2024-12-01)"
```

Good commit messages:
- ✅ "Add Claude 3.5 Sonnet model"
- ✅ "Update Gemini Pro pricing and availability"
- ✅ "Deprecate GPT-3 (Ada/Babbage/Curie)"
- ❌ "Update file"
- ❌ "Changes"

### 5. Open a Pull Request

Include in your PR description:
- **What changed**: Brief summary of modifications
- **Why**: Reason for the change
- **Source**: Link to official documentation or announcement
- **Date verified**: When you verified the information

Example PR description:
```markdown
## Update GPT-4 Turbo Pricing

### Changes
- Updated input token price from $0.01 to $0.008
- Updated output token price from $0.03 to $0.024
- Updated lastUpdated to 2024-12-15

### Source
https://openai.com/pricing

### Verification Date
2024-12-15
```

### 6. Review Process

- At least one reviewer approval required
- Automated schema validation must pass
- Reviewer will verify information against official sources
- Address any feedback or requested changes

### 7. Merge

Once approved, a maintainer will merge your PR. The changes will immediately be available to all systems reading from the Model Canon.

## Model Definition Guidelines

### Pricing

- Use USD for all pricing
- Use "per-1k-tokens" as the standard unit
- For models with per-million pricing, convert to per-1k (divide by 1000)
- Update `pricing.lastUpdated` whenever pricing changes

### Availability

- **generally-available**: Public, stable release
- **preview**: Public but subject to change
- **beta**: Limited or early access
- **deprecated**: Still available but not recommended
- **discontinued**: No longer available

### Tier Types

- **free**: Completely free with no usage costs
- **paid**: Requires payment for all usage
- **freemium**: Has a free tier with defined quotas

### Intended Use Cases

Use standardized values from the schema:
- `chat`: Conversational AI
- `completion`: Text completion
- `code-generation`: Code writing and assistance
- `analysis`: Data and text analysis
- `embedding`: Vector embeddings
- `image-generation`: Creating images
- `image-understanding`: Vision/image analysis
- `audio-transcription`: Speech-to-text
- `audio-generation`: Text-to-speech
- `translation`: Language translation
- `summarization`: Text summarization
- `search`: Semantic search
- `classification`: Text classification
- `moderation`: Content moderation

## Validation Requirements

All model definitions must:
1. ✅ Be valid JSON
2. ✅ Conform to `schema/model.schema.json`
3. ✅ Have unique `id` values
4. ✅ Include documentation URLs
5. ✅ Have verified pricing (if applicable)
6. ✅ Specify at least one intended use case

## What Not to Do

❌ **Don't** add unverified or speculative information  
❌ **Don't** include models not officially released  
❌ **Don't** commit directly to `main`  
❌ **Don't** use automated scripts or agents to update models  
❌ **Don't** add proprietary or internal-only models  
❌ **Don't** include personally identifiable information  

## Getting Help

- **Questions about a specific model**: Check provider documentation
- **Schema questions**: Open an issue for discussion
- **Process questions**: Reach out to repository maintainers
- **Urgent updates**: Tag PR as "urgent" and explain why

## Code of Conduct

- Be respectful and professional
- Verify information before submitting
- Respond to feedback constructively
- Help maintain the integrity of the canon

## Recognition

Contributors who maintain the Model Canon are essential to the Axiom ecosystem. Quality contributions help ensure accurate and reliable AI model information across all systems.

Thank you for helping maintain this critical resource!