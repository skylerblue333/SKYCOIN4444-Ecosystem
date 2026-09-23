# Ecosystem Principles

This document defines the minimum standards for building and communicating the SKYCOIN4444 ecosystem. It is an engineering and governance guide, not a token prospectus or investment document.

## 1. Evidence before claims

Every public claim should point to a source: a tested command, a code path, a deployed endpoint that can be independently verified, or a dated decision record. Terms such as *production*, *audited*, *secure*, *enterprise*, *official*, and *integrated* require specific evidence and an identified owner.

A repository, workflow, badge, feature folder, or marketing page does not by itself prove customer adoption, production deployment, security certification, legal approval, payment settlement, custody, or token value.

## 2. Clear economic boundaries

The project must not promise returns, publish price targets, coordinate buying activity, or present development activity as evidence that an asset will increase in value. Technical documentation should distinguish software utility, governance, rewards, and any financial or economic behavior.

Before an economic feature is enabled, document its supply and accounting rules, authority model, permissions, failure modes, monitoring, recovery, user disclosures, test coverage, and legal review. Use test networks and synthetic data for development.

## 3. Security and custody

Private keys, seed phrases, signing credentials, API tokens, and production secrets must never be committed. Wallet or transaction code requires threat modeling, negative tests, rate limits, audit logging, explicit user confirmation at dangerous boundaries, and a documented incident-response path.

No component should imply custody, settlement finality, smart-contract safety, or regulatory approval unless those claims are separately verified and maintained.

## 4. Repository hygiene

Each active repository should have a concise README, an explicit maturity label, reproducible setup commands, test instructions, a license, a security policy, and a clear owner. Experiments, archives, forks, generated output, and production candidates should be labeled rather than blended together.

Related repositories must document their interfaces. A shared brand or hyperlink is not an integration contract.

## 5. Sustainable contribution

Prefer small, reviewable changes over large generated rewrites. Every feature should include tests or a written reason tests are not yet possible. CI should run the same checks contributors run locally. Breaking changes require migration notes and a rollback or recovery plan.

## 6. Public communication

Promotional material must be factual, disclose uncertainty, link to primary sources, and avoid misleading scarcity, urgency, guaranteed outcomes, or financial advice. The project should earn attention through useful software, transparent progress, and respectful community support.

## Review checklist

Before describing a component as ready, ask:

- Can a new contributor reproduce the documented setup?
- Are the important behaviors covered by automated tests?
- Are security and economic boundaries explicit?
- Are unsupported integrations and claims clearly labeled?
- Is there an owner, change history, and recovery path?
- Would a reasonable user understand the risks without needing promotional context?
