# 使用官方Node.js镜像作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /usr/src/app

# 将package.json和package-lock.json复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录（注意.dockerignore文件）
COPY . .


# 构建React应用程序
RUN npm run build

# 使用Nginx作为Web服务器托管构建的React应用程序
FROM nginx:stable-alpine

# 复制构建的React应用程序到Nginx中
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# 暴露容器将侦听的端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
