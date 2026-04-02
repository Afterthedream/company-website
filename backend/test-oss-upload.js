/**
 * 阿里云 OSS 上传功能测试
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337';

// 创建测试图片（1x1 像素的 PNG）
const createTestImage = () => {
  // 一个非常小的有效 PNG 文件
  const pngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
    0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  return pngBuffer;
};

// 发送 multipart/form-data 请求
const uploadFile = async (filePath) => {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const imageData = fs.readFileSync(filePath);
    
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="files"; filename="test-${Date.now()}.png"\r\n`;
    body += `Content-Type: image/png\r\n\r\n`;
    
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: '/api/upload',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    
    // 写入 header
    req.write(Buffer.from(body));
    // 写入图片数据
    req.write(imageData);
    // 写入 footer
    req.write(`\r\n--${boundary}--\r\n`);
    req.end();
  });
};

// 主测试
const runTest = async () => {
  console.log('='.repeat(60));
  console.log('🧪 阿里云 OSS 上传功能测试');
  console.log('='.repeat(60));
  
  // 创建临时测试文件
  const testImagePath = path.join(__dirname, 'test-image.png');
  const testImage = createTestImage();
  fs.writeFileSync(testImagePath, testImage);
  
  console.log('\n📤 正在上传图片到 OSS...');
  
  try {
    const result = await uploadFile(testImagePath);
    
    console.log(`\n状态码：${result.status}`);
    console.log(`响应：${result.data}`);
    
    if (result.status === 200) {
      console.log('\n✅ OSS 上传成功！');
      try {
        const response = JSON.parse(result.data);
        console.log('返回数据:', JSON.stringify(response, null, 2));
      } catch (e) {
        // 不是 JSON
      }
    } else {
      console.log('\n❌ 上传失败，请检查错误信息');
      console.log('\n可能的原因:');
      console.log('1. OSS 配置不正确（endpoint/region/bucket）');
      console.log('2. AccessKey 或 SecretKey 错误');
      console.log('3. 网络连接问题（DNS 解析失败）');
      console.log('4. 权限不足（需要在 Strapi 后台设置 Roles 权限）');
    }
  } catch (error) {
    console.log(`\n❌ 上传出错：${error.message}`);
    console.log(error.stack);
  } finally {
    // 清理测试文件
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('\n已清理测试文件');
    }
  }
  
  console.log('\n' + '='.repeat(60));
};

runTest().catch(console.error);
