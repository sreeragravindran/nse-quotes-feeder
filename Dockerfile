FROM dynaum/node-sqlite

# Create app directory 
WORKDIR /usr/src/app

# Install app dependencies 
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --only=production
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source 
COPY . .

EXPOSE 3000 401510 

# SET enviroment variables from ARGS 
ARG NODE_ENV=dev 
ARG APIKEY=

ENV NODE_ENV=$NODE_ENV
ENV APIKEY=$APIKEY

CMD node src/server.js