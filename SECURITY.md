# Branch Protection and Security

This document outlines the security measures and branch protection rules for the Model Canon repository.

## Repository Governance

The Model Canon follows a **human-governed, agent-read-only** model:

- ✅ **Agents may READ**: Automated systems can fetch and use model definitions
- ❌ **Agents must NOT WRITE**: No automated system may create, modify, or delete model definitions
- 👤 **Humans APPROVE**: All changes require explicit human review and approval

## Branch Protection Rules

The `main` branch should be configured with the following protection rules:

### Required Settings

1. **Require pull request reviews before merging**
   - At least 1 approval required
   - Dismiss stale pull request approvals when new commits are pushed
   - Require review from Code Owners (if CODEOWNERS file is configured)

2. **Require status checks to pass before merging**
   - Require branches to be up to date before merging
   - Required status checks:
     - `Validate Model JSON Files` (from validate.yml workflow)

3. **Require conversation resolution before merging**
   - All comments must be resolved

4. **Require signed commits** (recommended)
   - Ensures authenticity of commits

5. **Include administrators**
   - Apply rules to repository administrators

6. **Restrict who can push to matching branches**
   - Only designated maintainers
   - No direct commits allowed

7. **Do not allow bypassing the above settings**
   - Prevents accidental or unauthorized bypasses

8. **Do not allow force pushes**
   - Preserves git history integrity

9. **Do not allow deletions**
   - Prevents accidental branch deletion

## Configuring Branch Protection

### Via GitHub UI

1. Go to repository **Settings**
2. Navigate to **Branches** in the left sidebar
3. Under "Branch protection rules", click **Add rule**
4. Enter `main` as the branch name pattern
5. Enable the settings listed above
6. Click **Create** or **Save changes**

### Via GitHub API

```bash
curl -X PUT \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.github.com/repos/forestdeven-sys/model-canon/branches/main/protection \
  -d '{
    "required_status_checks": {
      "strict": true,
      "contexts": ["Validate Model JSON Files"]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 1,
      "dismiss_stale_reviews": true
    },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "required_conversation_resolution": true
  }'
```

## Access Control

### Read Access (Public or Team-Based)

- The repository can be public to allow agents and systems to read model definitions
- Alternatively, grant read access to specific teams or service accounts

### Write Access (Restricted)

Write access should be limited to:
- **Maintainers**: Trusted individuals who verify and approve changes
- **Contributors**: Team members who submit pull requests (cannot merge directly)

Do not grant write access to:
- Automated systems or bots (except GitHub Actions)
- Service accounts used by agents
- Unreviewed external contributors

## Preventing Agent Modifications

### Technical Controls

1. **Branch Protection**: Enforces pull request workflow
2. **Required Reviews**: Ensures human verification
3. **Status Checks**: Automated validation before merge
4. **Access Control**: Limits who can approve and merge

### Documentation Controls

1. **Clear README**: States agents must not write
2. **CONTRIBUTING.md**: Emphasizes human-only updates
3. **This Document**: Explains security rationale

### Monitoring

Regularly review:
- Pull request activity
- Merge history
- Access logs (if available)
- Failed status checks

Watch for:
- Automated pull requests
- Bulk changes without proper review
- Changes from unexpected accounts

## Automated Systems Integration

Agents and automated systems should:

1. **Clone or fetch** the repository to read model definitions
2. **Parse JSON files** to extract model information
3. **Check for updates** periodically (respect rate limits)
4. **Never use write tokens** or credentials with push access
5. **Cache data appropriately** to reduce API calls

Example safe integration:
```javascript
// ✅ Safe: Read-only access
const modelData = await fetch(
  'https://raw.githubusercontent.com/forestdeven-sys/model-canon/main/models/openai/gpt-4.json'
);

// ❌ Unsafe: Attempting to write
// DO NOT implement write operations in agents
```

## Incident Response

If an unauthorized modification is detected:

1. **Revert immediately**: Use git revert or restore from backup
2. **Review access logs**: Identify how it occurred
3. **Revoke compromised credentials**: If credentials were leaked
4. **Update documentation**: If policies were unclear
5. **Notify stakeholders**: Inform teams relying on the canon

## Audit Trail

All changes are permanently recorded in Git history:
- Who made the change
- When it was made
- What was changed
- Why it was changed (commit message and PR description)

This audit trail is essential for:
- Accountability
- Debugging issues
- Understanding model evolution
- Compliance and governance

## Questions About Security?

For security concerns or questions:
- Open a **private security advisory** for sensitive issues
- Create a regular issue for policy clarification
- Contact repository maintainers directly

## Summary

The Model Canon's security model ensures:
- ✅ Authoritative, trusted model information
- ✅ Human oversight on all changes
- ✅ Agent read access for integration
- ✅ Complete audit trail
- ✅ Prevention of unauthorized modifications

These protections maintain the integrity of the Model Canon as the single source of truth for AI model information in the Axiom ecosystem.