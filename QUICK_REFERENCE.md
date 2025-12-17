# Model Canon Quick Reference

A quick reference for the Model Canon repository structure and key information.

## Repository Structure

```
model-canon/
├── models/              # Model definitions organized by provider
│   ├── openai/         # OpenAI models (GPT-4, GPT-3.5, etc.)
│   ├── anthropic/      # Anthropic models (Claude 3 family)
│   ├── google/         # Google models (Gemini)
│   └── index.json      # Index of all models
├── schema/             # JSON Schema for validation
│   └── model.schema.json
├── examples/           # Example code for reading models
│   ├── read-models.js
│   └── README.md
├── .github/workflows/  # CI/CD validation
│   └── validate.yml
├── README.md           # Main documentation
├── AGENT_GUIDE.md      # Guide for automated systems
├── CONTRIBUTING.md     # Contribution guidelines
└── SECURITY.md         # Security and governance
```

## Current Models (7 total)

### OpenAI
- **GPT-4** - Standard model, 8K context
- **GPT-4 Turbo** - 128K context, vision support
- **GPT-3.5 Turbo** - Cost-effective, 16K context

### Anthropic
- **Claude 3 Opus** - Highest capability, 200K context
- **Claude 3 Sonnet** - Balanced performance, 200K context
- **Claude 3 Haiku** - Fastest & cheapest, 200K context

### Google
- **Gemini Pro** - Freemium model, 60 free requests/month

## Model Schema (Required Fields)

```json
{
  "id": "unique-model-id",
  "name": "Human Readable Name",
  "provider": "Provider Name",
  "availability": {
    "status": "generally-available | preview | beta | deprecated",
    "regions": ["global" | specific regions]
  },
  "tier": {
    "type": "free | paid | freemium"
  },
  "pricing": {
    "inputTokenPrice": 0.00,
    "outputTokenPrice": 0.00,
    "currency": "USD",
    "unit": "per-1k-tokens"
  },
  "usage": {
    "intendedFor": ["chat", "completion", ...],
    "capabilities": {
      "contextWindow": 8192,
      "maxOutputTokens": 4096,
      "supportsFunctionCalling": true,
      "supportsVision": false,
      "supportsStreaming": true
    }
  }
}
```

## Key Principles

| Principle | Description |
|-----------|-------------|
| **Human-Governed** | Only humans can update via PR |
| **Agent Read-Only** | Automated systems may only read |
| **Authoritative** | Single source of truth for models |
| **Accurate** | All info verified against official docs |
| **Transparent** | All changes tracked in Git history |

## Common Operations

### Read a Model
```bash
cat models/openai/gpt-4.json | jq .
```

### List All Models
```bash
find models -name "*.json" -not -name "index.json"
```

### Validate Schema
```bash
ajv validate -s schema/model.schema.json -d models/openai/gpt-4.json
```

### Run Example Script
```bash
node examples/read-models.js
```

## Access Patterns

### ✅ Allowed (Agents & Humans)
- Clone repository
- Read model files
- Parse JSON
- Cache data
- Query via API

### ❌ Not Allowed (Agents)
- Create PRs
- Commit changes
- Push to branches
- Modify files
- Update issues

### 👤 Human Only
- Submit PRs
- Review changes
- Approve merges
- Update models
- Change schema

## URLs

| Resource | URL |
|----------|-----|
| **Repository** | https://github.com/forestdeven-sys/model-canon |
| **Schema** | `schema/model.schema.json` |
| **Raw Model (example)** | `https://raw.githubusercontent.com/forestdeven-sys/model-canon/main/models/openai/gpt-4.json` |

## Status Values

| Status | Meaning |
|--------|---------|
| `generally-available` | Stable, production-ready |
| `preview` | Public but may change |
| `beta` | Limited/early access |
| `deprecated` | Available but not recommended |
| `discontinued` | No longer available |

## Tier Types

| Tier | Description |
|------|-------------|
| `free` | No cost for any usage |
| `paid` | Requires payment for all usage |
| `freemium` | Free tier with quota, then paid |

## Documentation Map

| Document | Purpose | Audience |
|----------|---------|----------|
| **README.md** | Overview & general docs | Everyone |
| **AGENT_GUIDE.md** | Integration guide | Automated systems |
| **CONTRIBUTING.md** | How to contribute | Human contributors |
| **SECURITY.md** | Governance & security | Maintainers |
| **examples/README.md** | Example usage | Developers |

## Getting Help

- **Model questions**: Check official provider docs
- **Schema questions**: See `schema/model.schema.json`
- **Integration help**: See `AGENT_GUIDE.md`
- **Contributing**: See `CONTRIBUTING.md`
- **Security**: See `SECURITY.md`

## Validation Checklist

Before submitting a PR:
- [ ] JSON is valid (`jq empty file.json`)
- [ ] Conforms to schema (`ajv validate`)
- [ ] No duplicate IDs
- [ ] All required fields present
- [ ] Pricing verified from official source
- [ ] Documentation URL included
- [ ] `lastUpdated` dates current

---

**Quick Start**: Clone repo → Read models → Never write → Always verify

**Remember**: This is a read-only canon for agents. Only humans may update via PR.