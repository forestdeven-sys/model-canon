# Model Canon

The **Model Canon** is the authoritative, human-governed reference for AI models that are explicitly approved, understood, and characterized within the Axiom ecosystem. When a model appears in this canon, its availability, pricing, tier (free vs paid), and intended usage are considered accurate and trusted.

## Purpose

This repository serves as the single source of truth for:
- **Model Availability**: Current status and geographic availability
- **Pricing Information**: Accurate, up-to-date pricing for input/output tokens
- **Tier Classification**: Free, paid, or freemium designation with quota details
- **Intended Usage**: Approved use cases and technical capabilities
- **Metadata**: Release dates, documentation links, and additional context

## Structure

```
model-canon/
├── schema/
│   └── model.schema.json        # JSON Schema defining model structure
├── models/
│   ├── openai/                  # OpenAI models (GPT-4, GPT-3.5, etc.)
│   ├── anthropic/               # Anthropic models (Claude 3 family)
│   └── google/                  # Google models (Gemini)
└── README.md
```

## Usage

### For Agents (Read-Only)

Agents may **read** from this repository to understand which models are available and how to use them. The canonical data should be used to:
- Select appropriate models for specific tasks
- Understand pricing implications
- Check availability and capabilities
- Respect usage restrictions

**Agents must never write to or modify this repository.** All changes require human review and approval.

### For Humans (Write Access)

Model definitions are maintained exclusively through reviewed pull requests. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Adding new models
- Updating pricing or availability
- Deprecating models
- Schema modifications

## Model Schema

Each model is defined in a JSON file following the schema in `schema/model.schema.json`. Required fields include:

- `id`: Unique identifier (e.g., "gpt-4")
- `name`: Human-readable name
- `provider`: Model provider (e.g., "OpenAI")
- `availability`: Status and regions
- `tier`: Free, paid, or freemium with quota details
- `usage`: Intended use cases and capabilities
- `pricing`: Cost per token (optional for free models)
- `metadata`: Additional information and documentation links

## Example Models

Current models in the canon:

### OpenAI
- GPT-4 (8K context)
- GPT-4 Turbo (128K context, vision)
- GPT-3.5 Turbo

### Anthropic
- Claude 3 Opus (highest capability)
- Claude 3 Sonnet (balanced)
- Claude 3 Haiku (fastest, most cost-effective)

### Google
- Gemini Pro (freemium with 60 requests/month free)

## Governance

This repository is human-governed with the following principles:

1. **Human Approval Required**: All changes must be reviewed and approved by authorized humans
2. **No Agent Modifications**: Automated systems may only read, never write
3. **Accuracy First**: Information must be verified before inclusion
4. **Regular Updates**: Pricing and availability should be reviewed periodically
5. **Transparency**: Changes are tracked through Git history and pull requests

## Branch Protection

The `main` branch is protected with the following requirements:
- Pull request reviews required before merging
- Status checks must pass
- Direct commits to `main` are not allowed
- Force pushes are disabled

## Reading Model Data

To programmatically read model definitions:

```javascript
// Example: Reading a model definition
const fs = require('fs');
const model = JSON.parse(
  fs.readFileSync('./models/openai/gpt-4.json', 'utf8')
);
console.log(`${model.name} costs $${model.pricing.inputTokenPrice} per 1K input tokens`);
```

## Validation

Model definitions are automatically validated against the JSON schema in CI/CD pipelines. See `.github/workflows/validate.yml` for validation rules.

## Questions or Issues?

For questions about:
- **Model additions**: See CONTRIBUTING.md
- **Pricing updates**: Open an issue with source documentation
- **Schema changes**: Discuss in an issue before submitting a PR

## License

This repository and its contents are governed by the Axiom ecosystem policies. Use of this data implies acceptance of these governance principles.
