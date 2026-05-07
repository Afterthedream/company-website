/**
 * 测试 OSS 图片 URL 是否可访问
 */

const https = require('https');

const testUrl = 'https://cangjiexing.oss-cn-chengdu.aliyuncs.com/BANNER_fcd5e9cbe8.jpg';

console.log('='.repeat(60));
console.log('🔍 测试 OSS 图片 URL 可访问性');
console.log('='.repeat(60));
console.log(`\n测试 URL: ${testUrl}\n`);

https.get(testUrl, (res) => {
  console.log(`状态码：${res.statusCode}`);
  console.log(`响应头:`);
  Object.entries(res.headers).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  if (res.statusCode === 200) {
    console.log('\n✅ URL 可访问！图片应该能正常显示');
    console.log('\n如果 Strapi 媒体库中仍然无法显示，可能是:');
    console.log('1. 浏览器缓存问题 - 尝试硬刷新 (Ctrl+Shift+R)');
    console.log('2. Strapi 前端组件问题 - 检查浏览器控制台的 JavaScript 错误');
    console.log('3. 缩略图 URL 生成问题 - 缩略图可能不存在于 OSS 中');
  } else if (res.statusCode === 403) {
    console.log('\n❌ 403 Forbidden - OSS Bucket 可能是私有权限');
    console.log('\n解决方案:');
    console.log('1. 登录阿里云 OSS 控制台');
    console.log('2. 进入 bucket "cangjiexing"');
    console.log('3. 点击 "数据安全" → "读写权限"');
    console.log('4. 将 ACL 设置为 "公共读" (public-read)');
  } else if (res.statusCode === 404) {
    console.log('\n❌ 404 Not Found - 图片可能没有成功上传到 OSS');
    console.log('\n请检查:');
    console.log('1. 登录阿里云 OSS 控制台');
    console.log('2. 进入 bucket "cangjiexing"');
    console.log('3. 确认文件 "BANNER_fcd5e9cbe8.jpg" 是否存在');
  }
  
  console.log('\n' + '='.repeat(60));
}).on('error', (err) => {
  console.log(`❌ 请求失败：${err.message}`);
  console.log('\n可能的原因:');
  console.log('1. 网络连接问题');
  console.log('2. DNS 解析失败');
  console.log('3. SSL 证书问题');
  
  console.log('\n' + '='.repeat(60));
});
