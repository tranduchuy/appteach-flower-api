FROM node:latest
RUN mkdir -p /usr/src/flower-api
WORKDIR /usr/src/flower-api
COPY package.json /usr/src/flower-api/
RUN npm install
COPY . /usr/src/flower-api
EXPOSE 2000
CMD [ "npm", "run", "watch-ts" ]
