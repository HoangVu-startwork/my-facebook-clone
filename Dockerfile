# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# THÊM CÁC DÒNG NÀY VÀO TRƯỚC LỆNH RUN npm run build
ARG NEXT_PUBLIC_API_HOST=http://localhost:9090/api/
ARG NEXT_PUBLIC_SOCKET_URL=http://localhost:9090/

ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]