ARG node_version

FROM mhart/alpine-node:${node_version} as dev

RUN apk --no-cache add git openssh-client

# Workspace files
WORKDIR /app
COPY package.json yarn.lock .eslintrc.base.js .prettierrc ./

# snack-sdk
WORKDIR /app/packages/snack-sdk
COPY packages/snack-sdk/src ./src
COPY packages/snack-sdk/package.json packages/snack-sdk/tsconfig.json ./

# snackager
WORKDIR /app/snackager
COPY snackager/jest ./jest
COPY snackager/src ./src
# COPY snackager/structure-tests ./
COPY snackager/package.json ./
COPY snackager/tsconfig*.json ./
COPY snackager/.prettier* snackager/.eslint* ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Build snack-sdk
WORKDIR /app/packages/snack-sdk
RUN yarn build

# Snackager
WORKDIR /app/snackager

CMD ["yarn", "start"]

FROM dev as builder

# Build
RUN yarn run build

# clear development dependencies
RUN yarn install --frozen-lockfile --offline --production

FROM mhart/alpine-node:${node_version}

RUN apk --no-cache add git openssh-client

COPY --from=builder /app/snackager/package.json ./
COPY --from=builder /app/snackager/build build
COPY --from=builder /app/node_modules node_modules

CMD ["node", "--max-old-space-size=8192", "."]
