# Contributing to Portfolio

First off, thank you for considering contributing! 🎉 Your feedback, bug reports, and improvements help make this project better for everyone.

---

## Table of Contents

1. [Reporting Issues](#reporting-issues)
2. [Suggesting Enhancements](#suggesting-enhancements)
3. [Development Setup](#development-setup)
4. [Submitting Pull Requests](#submitting-pull-requests)
5. [Coding Guidelines](#coding-guidelines)
6. [Style & Formatting](#style--formatting)
7. [Additional Resources](#additional-resources)

---

## Reporting Issues

If you encounter a bug or unexpected behavior, please open an issue:

1. Check existing issues for duplicates.
2. Click **New Issue** and provide:
   - A clear, descriptive title.
   - Steps to reproduce the problem.
   - What you expected to happen and what actually occurred.
   - Screenshots or console logs if available.

---

## Suggesting Enhancements

Got an idea? We’d love to hear it!

1. Open an issue titled **"Feature Request: [Your Idea]"**.
2. Explain the motivation behind your suggestion.
3. Optionally include sketches or mockups.

---

## Development Setup

1. **Fork** the repository and **clone** your fork locally:
   ```bash
   git clone https://github.com/manishtiwari25/portfolio.git
   cd portfolio
   ```
2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the dev server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open `http://localhost:3000` in your browser.

---

## Submitting Pull Requests

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/my-feature
   ```
2. Make your changes, ensuring all tests pass and code is linted.
3. Commit your changes with clear, concise messages:
   ```bash
   git commit -m "Add [feature/fix]: brief description"
   ```
4. Push your branch:
   ```bash
   git push origin feature/my-feature
   ```
5. Open a PR from your fork’s branch to `main`.
6. In your PR description, include:
   - What the change does and why it’s needed.
   - Screenshots, GIFs, or code examples if relevant.

---

## Coding Guidelines

- **Typescript**: Use strong typings; prefer `interface` for props and data shapes.
- **React Components**: Functional components with hooks; avoid class components.
- **Next.js**: Use the `app` router conventions and `use client` directives as needed.
- **CSS**: Tailwind utility classes and NES.css for styling; keep custom CSS minimal.

---

## Style & Formatting

- **Prettier**: Run `npm run format` or configure your editor to format on save.
- **ESLint**: Follow lint rules; run `npm run lint` regularly.
- **Commit Messages**: Use [Conventional Commits](https://www.conventionalcommits.org/) style.

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Guide](https://www.framer.com/docs/)
- [NES.css Components](https://nostalgic-css.github.io/NES.css/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

Thank you for helping improve **Portfolio**! 🚀
