import { cpSync } from 'node:fs';

cpSync('./resources/images', './docs_out/resources/images', {
  recursive: true,
});
