FROM mcr.microsoft.com/playwright:v1.64.1-jammy

WORKDIR /app

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/cypress-io/cypress-example-kitchensink.git ./app

RUN cd ./app && npm ci --no-engine-strict --quiet

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["sh", "-c", "(cd ./app && npm start) & npx wait-on http://localhost:8080 --timeout 60000 && npm test"]