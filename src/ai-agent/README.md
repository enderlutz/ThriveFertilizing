# AI Agent

Core AI engine for customer communication and task automation.

## Features

- Natural language processing
- Context management
- Customer conversation handling
- Task generation and prioritization
- Estimate drafting
- Scheduling suggestions
- Escalation logic

## Components

- `engine/` - Core AI decision-making logic
- `prompts/` - LLM prompt templates
- `context/` - Context management system
- `integrations/` - External AI service integrations
- `rules/` - Business rules and automation logic

## Getting Started

```bash
cd src/ai-agent
npm install
npm run dev
```

## Configuration

Set up your Claude API key in `.env`:

```
CLAUDE_API_KEY=your_api_key_here
```
