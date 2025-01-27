FROM node:20.18.2-alpine3.21 As base.

RUN npm install -g pnpm@9.7.1

WORKDIR /usr/src/app

FROM base As build

COPY package*.json  ./

COPY . .

RUN npm i

RUN npm run build

# Base image for production
FROM base As production

# Set NODE_ENV environment variable
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy package.json and pnpm-lock.yaml for dependencies
COPY package*.json  ./

# Copy the rest of the code
COPY --chown=node:node . .

# Install only production dependencies
RUN npm ci

# Copy the bundled code
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules

COPY --from=build /usr/src/app/dist ./dist

# Set the user to node
USER node

CMD [ "node", "dist/index.js" ]
