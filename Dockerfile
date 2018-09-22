FROM node:10-alpine

ADD . /app
ENV NODE_ENV production
RUN mkdir -p /.npm /.config && chown -R 8002:8002 /app /.npm /.config
USER 8002
WORKDIR /app
RUN npm install
CMD "service"