# Changelog

## [Unreleased]

### Added
- Initial project setup with Next.js
- Anime detail page
- My list page
- Genres page
- Watch history page
- Basic navigation and UI components

### Fixed
- Next.js routing issue with params in dynamic routes
- ESLint errors preventing production build in Vercel
  - Fixed unescaped apostrophes in JSX
  - Removed unused imports and variables
  - Fixed React hooks dependency warnings
  - Replaced 'any' type with proper error handling
- Enhanced ESLint configuration with custom rules

### Security
- Environment variables used for sensitive information 