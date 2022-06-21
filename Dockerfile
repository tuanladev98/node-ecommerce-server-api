FROM node:gallium-alpine3.14
WORKDIR /ecommerce-api
COPY package.json .
RUN yarn install
COPY . .
RUN yarn build
CMD yarn start