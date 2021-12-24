FROM node:16.8.0
WORKDIR /src
COPY . .
RUN npm install
ENTRYPOINT ["node", "index.js"]
EXPOSE 5000