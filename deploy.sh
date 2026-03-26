# 快速部署脚本 - 阿里云 ECS

## 🚀 一键部署脚本

将以下脚本保存为 `deploy.sh`，在服务器上执行即可自动完成部署。

```bash
#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}公司网站自动部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}请使用 root 用户运行此脚本${NC}"
  exit 1
fi

# 1. 更新系统
echo -e "${YELLOW}[1/8] 更新系统...${NC}"
apt update && apt upgrade -y

# 2. 安装 Docker
echo -e "${YELLOW}[2/8] 安装 Docker...${NC}"
curl -fsSL https://get.docker.com | sh
systemctl start docker
systemctl enable docker

# 3. 安装 Docker Compose
echo -e "${YELLOW}[3/8] 安装 Docker Compose...${NC}"
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. 创建项目目录
echo -e "${YELLOW}[4/8] 创建项目目录...${NC}"
mkdir -p /opt/company-website
cd /opt/company-website

# 5. 提示用户上传代码
echo -e "${YELLOW}[5/8] 请上传项目代码到 /opt/company-website${NC}"
echo -e "${YELLOW}    可以使用以下方式上传:${NC}"
echo -e "    1. git clone 你的仓库地址"
echo -e "    2. 使用 SCP/SFTP 工具上传"
echo -e "    3. 直接复制粘贴代码"
echo ""
read -p "按回车键继续..."

# 6. 配置环境变量
echo -e "${YELLOW}[6/8] 配置环境变量...${NC}"
cat > .env.local << EOF
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TENCENT_MAP_KEY=GRDBZ-VMFEQ-FN75C-4HYJZ-Y36R2-W5BUT
EOF

echo -e "${GREEN}✓ 环境变量已配置${NC}"
echo -e "${YELLOW}请编辑 .env.local 文件修改为你的实际配置${NC}"
nano .env.local

# 7. 启动服务
echo -e "${YELLOW}[7/8] 启动 Docker 容器...${NC}"
docker-compose up -d

# 等待服务启动
echo -e "${YELLOW}等待服务启动（约 30 秒）...${NC}"
sleep 30

# 8. 检查状态
echo -e "${YELLOW}[8/8] 检查服务状态...${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "前端网站：http://你的服务器IP:3000"
echo -e "Strapi 后台：http://你的服务器 IP:1337/admin"
echo ""
echo -e "${YELLOW}常用命令:${NC}"
echo -e "  查看状态：docker-compose ps"
echo -e "  查看日志：docker-compose logs -f"
echo -e "  重启服务：docker-compose restart"
echo -e "  停止服务：docker-compose down"
echo -e "  启动服务：docker-compose up -d"
echo ""

```

## 📝 使用方法

### 1. 创建脚本

在本地创建 `deploy.sh` 文件，复制上面的内容。

### 2. 上传到服务器

```bash
# 上传脚本
scp deploy.sh root@你的服务器IP:/root/

# 连接到服务器
ssh root@你的服务器IP
```

### 3. 执行脚本

```bash
# 赋予执行权限
chmod +x deploy.sh

# 执行
./deploy.sh
```

### 4. 按照提示操作

脚本会引导你完成：
- ✅ 自动安装 Docker 和 Docker Compose
- ✅ 创建项目目录
- ⚠️ 手动上传代码（需要你自己操作）
- ✅ 自动生成环境配置
- ✅ 自动启动服务

---

## 🔧 手动上传代码方法

当脚本提示上传代码时，可以选择以下任一方式：

### 方法 A: Git 克隆

```bash
cd /opt/company-website
git clone 你的仓库地址 .
```

### 方法 B: 从本地上传

在**本地电脑**上执行：
```bash
scp -r ./* root@你的服务器IP:/opt/company-website/
```

### 方法 C: 使用 FTP 工具

使用 FileZilla 或 WinSCP 将整个项目文件夹上传到 `/opt/company-website`

---

## ⚡ 快速验证

部署完成后，在浏览器访问：

1. **Strapi 后台**: `http://你的服务器IP:1337/admin`
   - 首次访问需要创建管理员账号
   
2. **前端网站**: `http://你的服务器IP:3000`
   - 应该能看到网站首页

---

## 🛠️ 故障排查

如果服务无法启动，查看日志：

```bash
# 查看所有服务日志
docker-compose logs -f

# 只看 Strapi 日志
docker-compose logs strapi

# 只看前端日志
docker-compose logs frontend
```

常见问题：
- **端口被占用**: 修改 `docker-compose.yml` 中的端口映射
- **内存不足**: 确保服务器至少有 2GB 可用内存
- **权限问题**: 确保以 root 用户运行脚本
