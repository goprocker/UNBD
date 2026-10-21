# Repository Guidelines

## Project Structure & Module Organization

This repository is currently an empty project scaffold. Keep the root limited to project-wide configuration and documentation. Place application code in `src/`, automated tests in `tests/`, and static files in `public/` or `assets/`. Group code by feature when the application grows; for example, use `src/features/auth/` instead of a large shared components directory. Keep generated output such as `dist/`, coverage reports, and dependency folders out of version control.

## Build, Test, and Development Commands

No build system or package manager is configured yet. When adding one, expose a small, predictable command set and document it in `README.md`. For a Node.js project, prefer:

- `npm run dev` — start the local development server.
- `npm run build` — create a production build.
- `npm test` — run the complete automated test suite.
- `npm run lint` — check formatting and static-analysis rules.

Do not add placeholder scripts that report success without performing checks.

## Coding Style & Naming Conventions

Adopt the formatter and linter standard for the chosen language, then commit their configuration. Use consistent two-space indentation for JSON, YAML, JavaScript, and TypeScript. Name files and directories in `kebab-case`, variables and functions in `camelCase`, and exported classes or UI components in `PascalCase`. Keep modules focused and avoid hidden side effects.

## Testing Guidelines

Add tests with every behavior change and bug fix. Mirror source paths under `tests/`, or colocate tests as `*.test.*` when supported by the selected framework. Cover normal behavior, boundary cases, and failure paths. Run the full test and lint commands before opening a pull request.

## Commit & Pull Request Guidelines

No Git history exists yet, so use Conventional Commits from the first commit, such as `feat: add initial application shell`. Every Codex-authored commit needs a concise, diff-specific body and this trailer after a blank line: `Co-authored-by: Jarvis <technicalmanjash@gmail.com>`.

Pull requests should explain the problem, summarize the solution, list verification performed, and link related issues. Include screenshots or recordings for visible UI changes. Keep each pull request focused and call out configuration changes or follow-up work.

## Security & Configuration

Never commit secrets, credentials, or populated environment files. Provide sanitized examples such as `.env.example`, validate required variables at startup, and review new dependencies before merging.

## Decision Log

Maintain `decisions.md` throughout implementation. After every meaningful code change, add an entry that states what changed, why the approach was chosen, and why its library or method was preferred over alternatives. Update the log with each change rather than batching entries at task completion.
