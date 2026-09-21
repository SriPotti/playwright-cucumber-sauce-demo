# Contributing

1. Create a branch from `main`.
2. Add or update a Gherkin scenario.
3. Keep browser details inside a Page Object, not in feature files.
4. Prefer role, label, and text locators over brittle CSS/XPath.
5. Run `npm run typecheck` and `npm test` before opening a pull request.
6. Tag deliberate reproductions with `@known_failure` so the default CI remains green.
