FROM node:10
# Create app directory
WORKDIR /server
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .
EXPOSE 3000

CMD [ "node", "start.js" ]