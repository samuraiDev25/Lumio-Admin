# Repository Guidelines

## Project Structure & Module Organization

`src/` contains the application entry (`main.tsx`, `App.tsx`), shared styles, Storybook stories, and the component library. Reusable UI lives in `src/components/<component-name>/` with a `.tsx` file beside its `.module.scss`. Public static assets are in `public/`; component and Storybook assets live under `src/assets/` and `src/stories/assets/`. Export public components through `src/components/index.ts`.

## Build, Test, and Development Commands

Use `npm run dev` to start the Vite dev server. Use `npm run build` to type-check with `tsc -b` and generate a production build. Use `npm run preview` to serve the built output locally. Use `npm run storybook` for component development and docs on port `6006`, and `npm run build-storybook` for a static Storybook build. Use `npm run lint` before opening a PR. After every completed task, run `pnpm run format` and then `pnpm run build`; fix any build errors before considering the work complete.

## Coding Style & Naming Conventions

This repository uses TypeScript, React, SCSS modules, ESLint 9 flat config, and Prettier. Follow the existing style: 2-space indentation, single quotes in TS/TSX, semicolons, trailing commas, and `printWidth: 120`. Name React components and icon files in `PascalCase` (`Button.tsx`, `ArrowBackOutline.tsx`), hooks in `camelCase` with a `use` prefix, and styles as `Component.module.scss`. Keep one component per folder when it owns styles or helper files.

## Commit & Pull Request Guidelines

Use Conventional Commits for all commit messages, for example `feat: add date picker range styles` or `fix: correct button disabled state`. Keep commits focused and avoid mixing unrelated component work. PRs should include a brief description, linked issue if applicable, screenshots or Storybook captures for visual changes, and a note confirming `pnpm run format`, `npm run lint`, and `pnpm run build` passed.

## Contributor Notes

Do not edit `dist/` outputs manually. Prefer extending existing component patterns instead of introducing new folder conventions. If you add a public component, export it from `src/components/index.ts` in the same change.

## Storybook MCP Workflow

When working on UI components or stories, use the Storybook MCP tools from this project before changing props, stories, or documented usage.

- Never assume component props or supported states. Check Storybook MCP documentation first.
- Use `list-all-documentation` to discover documented components.
- Use `get-documentation` or `get-documentation-for-story` to confirm props, examples, and existing stories before editing.
- Use `get-storybook-story-instructions` when creating or updating stories so new stories follow current Storybook guidance.
- Use `run-story-tests` after story changes when Storybook test coverage is relevant.
