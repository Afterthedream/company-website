/**
 * Strapi v5 Rich Text 编辑器图片上传功能验证测试
 */

const http = require('http');

const STRAPI_URL = 'http://localhost:1337';

// 发送 HTTP 请求
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

// 主测试
const runTests = async () => {
  console.log('='.repeat(60));
  console.log('🧪 Strapi v5 Rich Text 编辑器图片插入功能验证');
  console.log('='.repeat(60));
  
  // 测试 1: 检查 Strapi API
  console.log('\n📋 测试 1: 检查 Strapi API 可用性...');
  try {
    const result = await request({
      hostname: 'localhost',
      port: 1337,
      path: '/api/content-type-builder/content-types',
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (result.status === 200 || result.status === 401 || result.status === 403) {
      console.log('✅ Strapi API 可访问');
    } else {
      console.log(`❌ 状态码异常：${result.status}`);
      return;
    }
  } catch (error) {
    console.log(`❌ 无法连接：${error.message}`);
    console.log('   请确保 Strapi 正在运行');
    return;
  }
  
  // 测试 2: 检查 Article schema
  console.log('\n📋 测试 2: 检查 Article Content Type Schema...');
  try {
    const result = await request({
      hostname: 'localhost',
      port: 1337,
      path: '/api/content-type-builder/content-types/api::article.article',
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (result.status === 200 && result.data) {
      const schema = result.data.contentType?.schema || result.data;
      const contentField = schema.attributes?.content;
      
      if (contentField) {
        console.log(`✅ Article schema 存在`);
        console.log(`   - content 字段类型：${contentField.type}`);
        
        if (contentField.type === 'richtext') {
          console.log('✅ content 字段已配置为 richtext 类型（富文本编辑器）');
          console.log('   支持 Markdown 语法和图片插入！');
        } else if (contentField.type === 'blocks') {
          console.log('⚠️  content 字段类型为 blocks（块编辑器）');
          console.log('   需要点击 + 按钮选择 Media 块来插入图片');
        } else {
          console.log(`⚠️  content 字段类型为 ${contentField.type}`);
        }
      }
    }
  } catch (error) {
    console.log(`⚠️  获取 schema 出错（可能需要认证）: ${error.message}`);
    console.log('   请手动在 Strapi 后台检查 Article 的 content 字段类型');
  }
  
  // 测试 3: 检查 Upload API
  console.log('\n📋 测试 3: 检查 Upload API 端点...');
  try {
    const result = await request({
      hostname: 'localhost',
      port: 1337,
      path: '/api/upload/files',
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (result.status === 200) {
      console.log('✅ Upload API 可公共访问');
    } else if (result.status === 401 || result.status === 403) {
      console.log('✅ Upload API 需要认证（正常，需在后台设置权限）');
      console.log('   设置路径：Settings → Roles → Public/Authenticated → Upload');
    } else {
      console.log(`⚠️  Upload API 状态码：${result.status}`);
    }
  } catch (error) {
    console.log(`❌ 无法访问 Upload API: ${error.message}`);
  }
  
  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('📊 验证完成！');
  console.log('='.repeat(60));
  console.log('\n💡 在 Strapi 后台使用富文本编辑器插入图片的方法:');
  console.log('');
  console.log('方法 1 - Markdown 语法:');
  console.log('  ![替代文字](图片 URL)');
  console.log('');
  console.log('方法 2 - 工具栏按钮:');
  console.log('  点击编辑器工具栏的图片图标 📷');
  console.log('  从媒体库选择或上传图片');
  console.log('');
  console.log('方法 3 - 拖拽上传:');
  console.log('  直接将图片文件拖拽到编辑器中');
  console.log('');
  console.log('⚠️  如果无法上传图片，请检查:');
  console.log('  1. Settings → Roles → 你的角色 → Upload → 勾选 create 权限');
  console.log('  2. 确保图片格式为 JPG, PNG, GIF, WebP 等常见格式');
  console.log('='.repeat(60));
};

runTests().catch(console.error);
