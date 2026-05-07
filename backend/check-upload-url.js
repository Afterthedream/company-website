/**
 * 检查上传文件的 URL 配置
 */

const http = require('http');

const request = (options, body = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (body) {
      req.write(body);
    }
    
    req.end();
  });
};

const checkFiles = async () => {
  console.log('='.repeat(60));
  console.log('📋 检查上传文件的 URL 配置');
  console.log('='.repeat(60));
  
  try {
    // 获取最新上传的文件
    const result = await request({
      hostname: 'localhost',
      port: 1337,
      path: '/api/upload/files?sort=createdAt:DESC&page=1&pageSize=5',
      method: 'GET',
      headers: { 
        'Accept': 'application/json'
      }
    });
    
    if (result.status === 200 && result.data) {
      const files = result.data.results || result.data;
      
      console.log(`\n找到 ${files.length} 个文件:\n`);
      
      files.forEach((file, index) => {
        console.log(`${index + 1}. ${file.name}`);
        console.log(`   - ID: ${file.id}`);
        console.log(`   - URL: ${file.url}`);
        console.log(`   - Formats: ${file.formats ? Object.keys(file.formats).join(', ') : 'none'}`);
        if (file.formats) {
          Object.entries(file.formats).forEach(([key, value]) => {
            console.log(`     - ${key}: ${value.url}`);
          });
        }
        console.log(`   - Provider: ${file.provider}`);
        console.log(`   - Created: ${file.createdAt}`);
        console.log('');
      });
      
      console.log('\n💡 问题分析:');
      console.log('如果 URL 不是以 https:// 开头的完整 OSS 地址，说明 baseUrl 配置有问题');
      console.log('当前 .env 中的配置:');
      console.log('  OSS_BASE_URL=https://cangjiexing.oss-cn-chengdu.aliyuncs.com');
      console.log('');
      console.log('插件会使用这个 baseUrl 拼接文件路径生成完整的 URL');
    } else {
      console.log(`❌ 获取文件列表失败：${result.status}`);
    }
  } catch (error) {
    console.log(`❌ 错误：${error.message}`);
  }
  
  console.log('='.repeat(60));
};

checkFiles().catch(console.error);
