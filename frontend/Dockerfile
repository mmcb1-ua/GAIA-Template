FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Use legacy-peer-deps for react-quill / react 19 compatibility
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5188

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5188"]
