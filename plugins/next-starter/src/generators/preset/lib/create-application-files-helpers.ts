import {
  generateFiles,
  joinPathFragments, names,
  offsetFromRoot as _offsetFromRoot, readJson, toJS,
  Tree, updateJson
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { getRelativePathToRootTsConfig } from '@nx/js';
import {
  createAppJsx,
  createStyleRules
} from '@nx/next/src/generators/application/lib/create-application-files.helpers';
import { join } from 'path';


export function createDockerDbContent(options: NormalizedSchema) {
  if (options.database === "postgres") {
    return `
  db:
    container_name: postgres_<%= constantName.toLowerCase() %>
    image: postgres
    environment:
      POSTGRES_USER: \${DATABASE_USER}
      POSTGRES_PASSWORD: \${DATABASE_PASSWORD}
      POSTGRES_DB: \${DATABASE_NAME}
      PGDATA: /data/postgres
    volumes:
      - db:/data/postgres
    ports:
      - "5432:5432"
    networks:
      - db
    restart: unless-stopped

  pgadmin:
    container_name: pgadmin_<%= constantName.toLowerCase() %>
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: \${PGADMIN_DEFAULT_EMAIL:-pgadmin4@pgadmin.org}
      PGADMIN_DEFAULT_PASSWORD: \${PGADMIN_DEFAULT_PASSWORD:-admin}
      PGADMIN_CONFIG_SERVER_MODE: "False"
    volumes:
      - pgadmin:/var/lib/pgadmin
    ports:
      - "5050:80"
    networks:
      - postgres
    restart: unless-stopped
    `
  } else if (options.database === "mysql") {
    return ``
  } else {
    return ``
  }
}
