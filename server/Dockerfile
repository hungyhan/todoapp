FROM node:20-alpine

# Thiết lập môi trường chạy là production
ENV NODE_ENV=production

WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# CHỈ cài đặt các dependencies phục vụ chạy sản phẩm, bỏ qua devDependencies (như nodemon)
RUN npm install --production

# Copy toàn bộ mã nguồn server vào container
COPY . .

# Thay cổng 5000 bằng cổng thực tế mà ứng dụng Express của bạn đang lắng nghe
EXPOSE 5000

# Chạy trực tiếp bằng lệnh 'node', không dùng nodemon trên production
CMD ["node", "index.js"]
