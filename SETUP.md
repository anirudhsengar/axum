# Agentify installation

<!-- agentify:managed -->

Agentify's repository analysis and specialist memory are installed, but issue
execution is disabled because the trusted repository task policy is not
configured. Do not queue work until the installer reports readiness `ready`.

## Issue execution disabled

The `agentify:queue` label will not start authorized work in this state.
Resolve the installer blockers—typically a missing toolchain, failed repository
validation, or incomplete policy attestation—and rerun Agentify verification.
When `.github/agentify-task-policy.json` becomes configured, Agentify rewrites
this guide with the issue workflow and trusted maintainer commands.

## Credentials

`PI_AUTH_JSON` carries the provider credentials created by `agentify login` —
API keys and OAuth subscription sign-ins (for example Anthropic Claude
Pro/Max or OpenAI ChatGPT Plus/Pro) — to the workflows. After interactive
consent the installer uploads the local credential store through
`gh secret set` stdin. To configure it manually, run
`gh secret set PI_AUTH_JSON < ~/.agentify/auth.json`. Never place the payload
in a command argument or repository file.

`PI_API_KEY` remains supported for environment-only API-key setups without a
stored credential.

When an OAuth access token expires, the trusted runtime refreshes it under
lock; because refresh tokens rotate, the runtime writes the updated credential
back to `PI_AUTH_JSON` at the end of the run through `AGENT_PAT`. Without that
write-back the next run authenticates with a dead token.

`AGENT_PAT` is an optional dedicated GitHub automation token used only to push
the task branch, publish its draft pull request, and write back rotated OAuth
credentials to `PI_AUTH_JSON`. It is recommended because GitHub suppresses
workflow events created with the built-in workflow token, and because OAuth
subscription credentials cannot survive rotation without it.
Issue authorization, labels, comments, and task state continue to use the
repository-scoped workflow token. The dedicated token must have access to this
repository; otherwise draft publication fails closed. It remains confined to
trusted workflow code and is never exposed to model processes. A fine-grained
token needs access to this repository with **Contents: read and write**,
**Pull requests: read and write**, and **Secrets: read and write**.

The installer owns these repository variables:

- `PI_PROVIDER`
- `PI_MODEL`
- `PI_THINKING`
- `AGENTIFY_VERSION`

## Installed trust boundary

- `.github/workflows/agentify-issue.yml` handles authorized issue work.
- `.github/workflows/agentify-learn.yml` handles accepted-merge learning.
- `.github/agentify-task-policy.json` is repository-identity-bound and fails
  closed when incomplete.
- `.github/agentify/*.mjs` are trusted bundled runtimes.
- `.agentify/` is versioned external memory plus ignored operational state.

Agentify never merges application changes, enables auto-merge, deploys,
force-pushes an application branch, or lets learned output modify application
source, dependencies, workflow permissions, policy, or executable runtime code.
