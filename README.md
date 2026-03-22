# Backend Journey

A learning repository to practice backend development fundamentals and master the pull request workflow.

## Overview
This repository is dedicated to learning backend development concepts, implementing features, and practicing collaborative development workflows including pull requests.

## Repository Structure
```
backend-journey/
├── .gitignore          # Specifies files to exclude from version control
├── README.md           # Project documentation
├── LEARNING_LOG.md     # Daily learning progress log
└── src/                # Source code directory (to be populated)
```

## Getting Started

### Prerequisites
- Git installed locally
- Basic understanding of git workflows

### Clone the Repository
```bash
git clone <repository-url>
cd backend-journey
```

### Branching Strategy
- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Individual feature branches for development

## Pull Request Workflow

1. Create a feature branch from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   ```

3. Push your feature branch
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub/GitLab

5. Review and merge

## Learning Goals
- Master git workflows
- Understand pull requests and code review
- Practice collaborative development
- Build backend development skills

## Contributing
This is a learning repository. All contributions should follow the branching strategy above.

## License
This is a personal learning project.
