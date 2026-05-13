import { defineConfig } from 'orval';

export default defineConfig({
  expensive: {
    input: '../server/openapi.json',
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/endpoints.ts',
      schemas: 'src/api/generated/schemas',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: 'src/api/mutator.ts',
          name: 'apiClient',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
      prettier: true,
      clean: true,
    },
  },
});
