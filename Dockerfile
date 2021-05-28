#start the process with a full featured node image to build with
FROM node:14.15.5 as builder

# a place to copy the project to
WORKDIR /app

# copy the project from host to the containers workdir
COPY . .

ENV NODE_ENV=build

RUN npm install && \
    npm dedupe && \
    npm run build && \
    npm prune --production && \
    find . -name 'tsconfig*' -delete && \
    find . -name '*.d.ts' -delete && \
    find . -name 'src' -type d ! -path './node_modules/*' -exec rm -rf {} + && \
    rm docker-compose.yaml && \
    curl -sf https://gobinaries.com/tj/node-prune | sh && \
    node-prune && \
    mkdir config

# this is a production container and we want info about the build
FROM node:14.15.5-alpine as runner

ENV NODE_ENV=production

# home directory for the project and node user
WORKDIR /app

# copy the app folder and give to the node user
COPY --from=builder --chown=node:node /app /app

# switch user to node which was made by base image
USER node

# enter the cmd with npm
ENTRYPOINT [ "npm" ]

# start is the cmd to make the app run
CMD ["start"]
