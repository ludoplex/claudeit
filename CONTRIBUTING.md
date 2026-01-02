# Contributing to OpusAudit

First off, thank you for considering contributing to OpusAudit! It's people like you that make OpusAudit such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Note your browser and OS version**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other tools if applicable**

### Pull Requests

1. Fork the repository and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes (`npm test`)
4. Make sure your code lints (`npm run lint`)
5. Update documentation as needed
6. Write a clear commit message

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/claudeit.git
cd claudeit

# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint
```

## Testing Guidelines

- Write tests for all new features
- Maintain or improve code coverage
- Test edge cases and error conditions
- Use descriptive test names

## Code Style

- Follow the existing code style
- Use 4 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Run ESLint before committing

## Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## License

By contributing, you agree that your contributions will be licensed under the GPL-3.0 License.
