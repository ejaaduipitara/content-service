FROM node:18.19.0-buster-slim
RUN useradd -rm -d /home/djp -s /bin/bash -g root -G sudo -u 1001 djp
RUN apt-get update
USER djp
RUN mkdir -p /home/djp/content-service
ADD / /home/djp/content-service
RUN ls -all /home/djp/content-service
WORKDIR /home/djp/content-service
RUN npm install
CMD ["node", "app.js", "&"]