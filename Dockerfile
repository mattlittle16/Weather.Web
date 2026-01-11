 # Build stage
  FROM node:20-alpine AS build

  WORKDIR /app

  # Build arguments for environment variables
  ARG VITE_GEOCODE_API_KEY
  ARG VITE_WEATHER_API_KEY
  ARG VITE_WEATHER_REFRESH_INTERVAL_MS=300000

  # Set as environment variables for Vite
  ENV VITE_GEOCODE_API_KEY=$VITE_GEOCODE_API_KEY
  ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY
  ENV VITE_WEATHER_REFRESH_INTERVAL_MS=$VITE_WEATHER_REFRESH_INTERVAL_MS

  # Copy package files
  COPY package*.json ./

  # Install dependencies
  RUN npm ci

  # Copy source code
  COPY . .

  # Build the app (Vite outputs to dist/)
  RUN npm run build

  # Production stage
  FROM nginx:alpine

  # Copy built app from build stage (dist folder for Vite)
  COPY --from=build /app/dist /usr/share/nginx/html

  # Copy custom nginx config
  COPY nginx.conf /etc/nginx/conf.d/default.conf

  EXPOSE 80

  CMD ["nginx", "-g", "daemon off;"]