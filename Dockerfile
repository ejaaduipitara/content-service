FROM node:18.19.0-buster-slim
RUN useradd -rm -d /home/djp -s /bin/bash -g root -G sudo -u 1001 djp
RUN apt-get update
RUN mkdir -p /home/djp/content-service
ADD / /home/djp/content-service
RUN ls -all /home/djp/content-service
WORKDIR /home/djp/content-service
RUN chown -R djp /home/djp
USER djp
RUN npm install
CMD ["node", "app.js", "&"]