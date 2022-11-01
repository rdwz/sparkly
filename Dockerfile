FROM node:19-bullseye-slim as base

RUN apt-get update && apt-get install -y openssl

# FROM base as build

RUN mkdir /app
WORKDIR /app

ADD . .
RUN npm install

ENV VITE_GOOGLE_VERIFICATION_ID=DWJzynK0G_OH0vIHTVF5UF_vQbULL4WNGBRfex92mPs
ENV VITE_SITE_NAME=fastify-react-ts

RUN npm run build
RUN npm prune --production

# FROM base

# RUN mkdir /app
# WORKDIR /app

# COPY --from=build /app/node_modules /app/node_modules
# COPY --from=build /app/dist /app/dist

# ADD . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["./start.sh"]
