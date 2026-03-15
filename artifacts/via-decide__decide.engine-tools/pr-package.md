Branch: simba/create-a-new-branch-featureeco-engine-test-creat
Title: Create a new branch feature/eco-engine-test. Create a new directory a...

## Summary
- Repo orchestration task for via-decide/decide.engine-tools
- Goal: Create a new branch feature/eco-engine-test. Create a new directory at the root level called tools/eco-engine-test/. Inside this directory, create an index.html file and populate it exactly with the code payload provided below. After creating the file, commit the changes with the message "feat: add isolated test environment for unified auth, wallet, and plant engine logic". Push the branch to origin and open a Pull Request to the main branch with the title "Feat: Eco-Hack Engine Foundation" and a description mentioning it establishes async state management. Code Payload for index.html: <!doctype html> <html lang="en"> <head> <meta charset="UTF-8"/> <meta name="viewport" content="width=device-width,initial-scale=1.0"/> <title>Eco-Hack Engine Test</title> <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet"/> <style> :root {

## Testing Checklist
- [ ] Run unit/integration tests
- [ ] Validate Telegram command flow
- [ ] Validate generated artifact files

## Risks
- Prompt quality depends on repository metadata completeness.
- GitHub API limits/token scope can block deep inspection.

## Rollback
- Revert branch and remove generated artifact files if workflow output is invalid.