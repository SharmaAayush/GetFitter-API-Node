import fs from 'fs';
import path from 'path';

import logger from '@/services/logger';
import { IModelWithAssociations, IModelWithInitialization } from '@/types/base.models';

const initializeModels = (models: IModelWithInitialization[]) => {
  models.forEach(model => model.initializeModel());
}

const associateModels = (models: IModelWithAssociations[]) => {
  models.forEach(model => model.associate());
}

export async function loadAndInitializeModels(): Promise<void> {
  // 1. Resolve the absolute path to your models directory at runtime
  // This correctly targets 'src/models' in dev and 'dist/models' in production
  const modelsDir = __dirname;

  // 2. Read all files in the directory
  const files = fs.readdirSync(modelsDir);

  // 3. Prepare arrays for initializable and associatable models
  const initializableModels: IModelWithInitialization[] = [];
  const associatableModels: IModelWithAssociations[] = [];

  for (const file of files) {
    // 4. Skip the current file (index.ts/js) and ignore maps/declaration files
    if (
      file === 'index.ts' ||
      file === 'index.js' ||
      file.endsWith('.map') ||
      file.endsWith('.d.ts')
    ) {
      continue;
    }

    // 5. Ensure we only load JavaScript or TypeScript files
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      const fullPath = path.join(modelsDir, file);

      try {
        // 6. Dynamically import the module using the absolute path
        const modelModule = await import(fullPath);

        if (modelModule.default && (modelModule.default as IModelWithInitialization).initializeModel) {
          initializableModels.push(modelModule.default as IModelWithInitialization);
        }

        if (modelModule.default && (modelModule.default as IModelWithAssociations).associate) {
          associatableModels.push(modelModule.default as IModelWithAssociations);
        }
      } catch (error) {
        logger.error(`Failed to load model file: ${file}`, error);
      }
    }
  }

  initializeModels(initializableModels);
  associateModels(associatableModels);
}