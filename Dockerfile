FROM node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install -g npm@latest
RUN npm install --unsafe-perm -g ask-cli 
RUN npm install -g react-scripts

#RUN npm install
#RUN cd client; npm i
# If you are building your code for production
# RUN npm install --only=production

#RUN apt-get update; apt-get install nano

# Bundle app source
#COPY . .
VOLUME /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]
