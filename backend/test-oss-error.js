const https = require('https');

const url = 'https://cangjiexing.oss-cn-chengdu.aliyuncs.com/BANNER_fcd5e9cbe8.jpg';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('状态码:', res.statusCode);
    console.log('\n响应内容:');
    console.log(data);
  });
}).on('error', (err) => {
  console.log('错误:', err.message);
});
