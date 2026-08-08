# Release Prompt for Agents

Use the following prompt to perform a release of JIRoom:

```text
Release JIRoom version X.Y.Z:

1. Update CHANGELOG.md: add a new `## [X.Y.Z] - YYYY-MM-DD` section summarizing changes since the last release, keeping the existing format.
2. Bump the `"version"` field in `package.json` to `X.Y.Z`.
3. Commit those files with the message: `chore(release): bump version to X.Y.Z`.
4. Push the commit to `origin/main`. This will run the CI workflow and Vercel will auto-deploy the production site from `main`.
5. Once CI passes, create and push an annotated tag:
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin vX.Y.Z
6. The `Release` GitHub Actions workflow will automatically create the GitHub Release at https://github.com/AllardQuek/jiroom/releases.

Notes:
- Do not create the GitHub Release manually; the workflow handles it.
- The `Release` workflow extracts the `## [X.Y.Z]` section from `CHANGELOG.md` and uses it as the release body, so the `CHANGELOG.md` update must be accurate and complete before pushing the tag.
- If you skip the CHANGELOG update, the release body will be empty.
- Pushing the tag before CI passes will still create a release, but the deployed code may be from the previous `main` push.
```

Replace `X.Y.Z` with the desired version, for example `3.3.0`.
