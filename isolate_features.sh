#!/bin/bash
cd /Users/dharamdaxini/Downloads/via/decide.engine-tools

git fetch origin
git checkout main
git pull origin main

# Create the isolated sandbox branch
git checkout -b sandbox/unshipped-features

# Branches to merge
branches=(
  "origin/simba/create-zoom-state-model-for-the-world-map"
  "origin/simba/create-repository-safety-audit-for-script-order-"
  "origin/simba/create-protected-file-guard-report-generator"
  "origin/simba/create-shared-economy-wiring-validator"
  "origin/simba/build-daxinicontrol-the-high-performance-remote-"
)

for branch in "${branches[@]}"; do
  echo "Merging $branch..."
  git merge --no-edit "$branch" || {
    echo "Conflict detected in $branch. Resolving by taking PR changes (theirs)..."
    git checkout --theirs .
    git add .
    git commit -m "Auto-resolved conflict in favor of feature branch $branch"
  }
done

git push origin sandbox/unshipped-features
echo "Features isolated in branch sandbox/unshipped-features and pushed."
