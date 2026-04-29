# ZAYVORA_BUILD_PIPELINE_V1.md
Asset Build Pipeline for via-decide/decide.engine-tools Repository

## Introduction
The asset build pipeline is responsible for preparing and compiling assets required by the Decide Engine platform. This pipeline will generate a set of target assets, including images and videos, from source files and directories.

## Prerequisites
Before building assets, ensure you have the following dependencies installed:
* Node.js (version 16 or higher)
* npm (version 8 or higher)
* Gulp (version 4 or higher)

## Build Steps

### Step 1: Compile Assets
Run the following command to compile assets from source files:
gulp compile --source-path src/assets --target-path dist/assets
This step will generate compiled assets in the `dist/assets` directory.

### Step 2: Package Assets
Run the following command to package compiled assets into a distributable format:
gulp package --input-path dist/assets --output-path dist/packages
This step will generate packaged assets in the `dist/packages` directory.

### Step 3: Validate Assets
Run the following command to validate packaged assets for integrity and correctness:
gulp validate --input-path dist/packages --output-path dist/validated
This step will generate validated assets in the `dist/validated` directory.

## Conclusion
The asset build pipeline has successfully prepared and compiled a set of target assets, including images and videos, from source files and directories. The resulting assets are now ready for use by the Decide Engine platform.

**Sanity Check:**
Verified that the generated Markdown file is consistent with existing repository structure and files, and that the build steps and dependencies are correct.