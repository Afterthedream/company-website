/**
 * Strapi API 客户端 (完整修复版)
 * ✅ 已适配 Docker SSR/CSR 分离、HTTPS 代理、防路径重复、404 调试日志
 */

// 🔑 核心修复：根据运行环境自动选择请求基地址
// SSR(服务端): 走 Docker 内网直连 http://strapi:1337
// CSR(浏览器): 走 Nginx 代理相对路径 /api
const STRAPI_URL = typeof window === 'undefined'
  ? (process.env.STRAPI_INTERNAL_URL || 'http://strapi:1337')
  : (process.env.NEXT_PUBLIC_STRAPI_URL || '/api');

const API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * 智能构建请求 URL，彻底避免 /api/api/ 重复路径问题
 */
function buildUrl(endpoint: string): string {
  // 统一清理开头斜杠
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // 情况1：SSR 内网地址 (http://strapi:1337) 默认不含 /api，需自动补上
  if (!STRAPI_URL.includes('/api') && !cleanEndpoint.startsWith('/api')) {
    return `${STRAPI_URL}/api${cleanEndpoint}`;
  }

  // 情况2：CSR 地址 (/api) 且 endpoint 也以 /api 开头，自动去重
  if (STRAPI_URL.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    return `${STRAPI_URL}${cleanEndpoint.slice(4)}`;
  }

  // 默认直接拼接
  return `${STRAPI_URL}${cleanEndpoint}`;
}

/**
 * 通用 API 请求函数
 */
async function fetchApi(endpoint: string, options?: RequestInit) {
  const url = buildUrl(endpoint);

  // 🔍 SSR 调试日志：在 docker compose logs 中可见，方便直接定位 404 的真实请求路径
  if (typeof window === 'undefined') {
    console.log(`[Strapi SSR Fetch] ${options?.method || 'GET'} ${url}`);
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    // SSR 禁用缓存，确保服务端每次渲染都拿最新数据
    cache: typeof window === 'undefined' ? 'no-store' : undefined,
  });

  if (!response.ok) {
    if (typeof window === 'undefined') {
      console.error(`[Strapi SSR Error] ${response.status} ${url}`);
    }
    const error = new Error(`API request failed: ${response.status}`);
    (error as any).status = response.status;
    throw error;
  }

  return await response.json();
}

/**
 * 获取完整的媒体 URL
 * ✅ 浏览器端返回相对路径交由 Nginx 处理，避免 Mixed Content 拦截
 * ✅ 支持阿里云OSS直链
 */
export function getStrapiMedia(url: string | null): string {
  if (!url) return '/placeholder.png';
  
  // 如果已经是完整URL（包括OSS链接），直接返回
  if (url.startsWith('http')) return url;
  
  // 如果是相对路径，需要根据环境拼接
  // SSR环境：使用内网地址
  if (typeof window === 'undefined') {
    const baseUrl = process.env.STRAPI_INTERNAL_URL || 'http://strapi:1337';
    return `${baseUrl}${url}`;
  }
  
  // CSR环境（浏览器）：使用配置的公开地址
  const publicUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  
  // 如果配置了完整的Strapi URL（如 http://localhost:1337），则拼接
  if (publicUrl && publicUrl.startsWith('http')) {
    return `${publicUrl}${url}`;
  }
  
  // 否则返回相对路径，由Nginx代理处理
  return url.startsWith('/') ? url : `/${url}`;
}

// ================= 业务函数 =================

export async function getCompanyInfo() {
  try {
    const data = await fetchApi('/companies?populate=*');
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching company info:', error);
    return null;
  }
}

export function extractCompanyLogo(company: any): string | null {
  if (!company?.logo) return null;
  const logoUrl = Array.isArray(company.logo) ? company.logo[0]?.url : company.logo?.url;
  return logoUrl ? getStrapiMedia(logoUrl) : null;
}

export async function getCompanyLogo() {
  try {
    const company = await getCompanyInfo();
    return extractCompanyLogo(company);
  } catch (error) {
    console.error('Error fetching company logo:', error);
    return null;
  }
}

export function extractCompanyImage(company: any): string | null {
  if (!company?.companyImage) return null;
  const imageUrl = Array.isArray(company.companyImage) ? company.companyImage[0]?.url : company.companyImage?.url;
  return imageUrl ? getStrapiMedia(imageUrl) : null;
}

export async function getCompanyImage() {
  try {
    const company = await getCompanyInfo();
    return extractCompanyImage(company);
  } catch (error) {
    console.error('Error fetching company image:', error);
    return null;
  }
}

export async function getProductCategories() {
  try {
    const response = await fetchApi('/product-categories?populate=*&sort=order:asc');
    return response.data || [];
  } catch (error) {
    console.warn('Product categories not available yet:', error);
    return [];
  }
}

export async function getProducts(categoryId?: string) {
  try {
    let endpoint = '/products?populate=*&sort=order:asc';
    if (categoryId) {
      endpoint += `&filters[category][id][$eq]=${categoryId}`;
    }
    const response = await fetchApi(endpoint);
    return response.data || [];
  } catch (error) {
    if (error instanceof Error && error.message.includes('403')) {
      console.warn('Strapi Products API requires public read permission. Using empty data.');
      return [];
    }
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getArticles(category?: string) {
  try {
    let endpoint = '/articles?populate=*&sort=published:desc';
    if (category) {
      endpoint += `&filters[category][$eq]=${category}`;
    }
    const response = await fetchApi(endpoint);
    return response.data || [];
  } catch (error) {
    if (error instanceof Error && error.message.includes('403')) {
      console.warn('Strapi Articles API requires public read permission. Using empty data.');
      return [];
    }
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getSolutions() {
  try {
    const response = await fetchApi('/solutions?populate=*&sort=order:asc');
    return response.data || [];
  } catch (error) {
    if (error instanceof Error && error.message.includes('403')) {
      console.warn('Strapi Solutions API requires public read permission. Using default data.');
      return [];
    }
    console.error('Error fetching solutions:', error);
    return [];
  }
}

export async function getSolutionBySlug(slug: string) {
  try {
    const response = await fetchApi(
      `/solutions?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    return response.data?.[0] || null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('403')) {
      console.warn('Strapi Solutions API requires public read permission.');
      return null;
    }
    console.error('Error fetching solution by slug:', error);
    return null;
  }
}

export async function getCases() {
  try {
    const response = await fetchApi('/cases?populate=*&sort=projectDate:desc');
    return response.data || [];
  } catch (error) {
    if (error instanceof Error && error.message.includes('403')) {
      console.warn('Strapi Cases API requires public read permission. Using empty data.');
      return [];
    }
    console.error('Error fetching cases:', error);
    return [];
  }
}

export async function getContactInfo() {
  try {
    const data = await fetchApi('/contact?populate=*');
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

export async function submitContact(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}) {
  return fetchApi('/contacts', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}) {
  try {
    const response = await fetch(buildUrl('/contact-submissions'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) throw new Error('Failed to submit form');
    return await response.json();
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false };
  }
}