# 使用官方Node.js镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 将package.json和package-lock.json复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录（注意.dockerignore文件）
COPY . .

# 暴露容器将侦听的端口
EXPOSE 4000 80 

# 启动Node.js应用程序
CMD ["npm", "start"]
