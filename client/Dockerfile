# Stage 1: Biên dịch mã nguồn React sang file tĩnh
FROM node:20-alpine AS builder

WORKDIR /app

# Copy các file quản lý thư viện trước để tận dụng Docker cache
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn của client vào và tiến hành build
COPY . .
RUN npm run build

# Stage 2: Sử dụng Nginx để phục vụ ứng dụng
FROM nginx:1.25-alpine

# Copy thư mục 'dist' đã được build từ Stage 1 vào thư mục mặc định của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose cổng 80 (Cổng mặc định của Web Server Nginx)
EXPOSE 80

# Chạy Nginx ở chế độ foreground để container không bị tắt
CMD ["nginx", "-g", "daemon off;"]
