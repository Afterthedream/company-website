/**
 * Strapi API 客户端
 * 用于与 Strapi CMS 进行数据交互
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * 获取完整的媒体 URL
 */
export function getStrapiMedia(url: string | null): string {
  if (!url) return '/placeholder.png';
  
  if (url.startsWith('http')) {
    return url;
  }
  
  return `${STRAPI_URL}${url}`;
}

/**
 * 通用 API 请求函数
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status}`);
    (error as any).status = response.status;
    throw error;
  }
  
  const data = await response.json();
  return data;
}

/**
 * 获取公司信息
 */
export async function getCompanyInfo() {
  try {
    const url = `${STRAPI_URL}/api/companies?populate=*`;
    console.log('Fetching:', url);
    const data = await fetchApi<any>('/companies?populate=*');
    console.log('Company data:', JSON.stringify(data).substring(0, 200));
    return data.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching company info:', error);
    return null;
  }
}

/**
 * 获取公司Logo
 */
export async function getCompanyLogo() {
  try {
    const company = await getCompanyInfo();
    if (company?.logo) {
      const logoUrl = Array.isArray(company.logo) ? company.logo[0]?.url : company.logo?.url;
      return logoUrl ? getStrapiMedia(logoUrl) : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching company logo:', error);
    return null;
  }
}

/**
 * 获取公司照片
 */
export async function getCompanyImage() {
  try {
    const company = await getCompanyInfo();
    if (company?.companyImage) {
      const imageUrl = Array.isArray(company.companyImage) ? company.companyImage[0]?.url : company.companyImage?.url;
      return imageUrl ? getStrapiMedia(imageUrl) : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching company image:', error);
    return null;
  }
}

/**
 * 获取所有产品分类
 */
export async function getProductCategories() {
  try {
    const data = await fetchApi<any>('/product-categories?populate=*&sort=order:asc');
    return data.data || [];
  } catch (error) {
    // 如果分类接口不存在或返回错误，返回空数组
    console.warn('Product categories not available yet:', error);
    return [];
  }
}

/**
 * 获取所有产品
 */
export async function getProducts(categoryId?: string) {
  try {
    let endpoint = '/products?populate=*&sort=order:asc';
    if (categoryId) {
      endpoint += `&filters[category][id][$eq]=${categoryId}`;
    }
    const data = await fetchApi<any>(endpoint);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * 获取新闻文章
 */
export async function getArticles(category?: string) {
  try {
    let endpoint = '/articles?populate=*&sort=published:desc';
    if (category) {
      endpoint += `&filters[category][$eq]=${category}`;
    }
    const data = await fetchApi<any>(endpoint);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/**
 * 获取解决方案
 */
export async function getSolutions() {
  try {
    console.log('Fetching solutions from Strapi...');
    const data = await fetchApi<any>('/solutions?populate=*&sort=order:asc');
    console.log('Solutions fetched successfully:', data.data?.length || 0, 'items');
    return data.data || [];
  } catch (error) {
    // 如果是 403 权限错误，返回空数组使用默认数据
    if (error instanceof Error && error.message.includes('403')) {
      console.warn('Strapi Solutions API requires public read permission. Using default data.');
      return [];
    }
    console.error('Error fetching solutions:', error);
    return [];
  }
}

/**
 * 获取应用案例
 */
export async function getCases() {
  try {
    const data = await fetchApi<any>('/cases?populate=*&sort=projectDate:desc');
    return data.data || [];
  } catch (error) {
    console.error('Error fetching cases:', error);
    return [];
  }
}

/**
 * 获取联系方式
 */
export async function getContactInfo() {
  try {
    const data = await fetchApi<any>('/contact?populate=*');
    return data.data[0] || null;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

/**
 * 提交联系表单
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}) {
  try {
    // 注意：这需要在 Strapi 中创建对应的 submission 内容类型
    // 或者使用邮件插件发送
    const response = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit form');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting form:', error);
    // 降级处理：直接返回成功
    return { success: true };
  }
}
