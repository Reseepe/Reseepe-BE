FROM node:20

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

ENV PORT 3000
ENV DB_HOST = 34.101.60.88
ENV DB_USERNAME = root
ENV DB_PASSWORD = sj,kD]gu*S%djuYs
ENV DB_NAME = reseepe_db
ENV JWT_SECRET=secret-key
ENV JWT_EXPIRATION=3600

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]