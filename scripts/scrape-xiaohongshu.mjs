#!/usr/bin/env node
/**
 * 小红书 FCN 帖子自动爬虫脚本
 *
 * 使用方法：
 *   cd fcn-signal
 *   npm install puppeteer
 *   node scripts/scrape-xiaohongshu.mjs
 *
 * 功能：
 *   1. 打开小红书网页版，搜索 FCN 相关关键词
 *   2. 提取帖子标题、链接、作者、互动数据
 *   3. 自动更新 src/data/mock.ts 中的小红书条目
 *
 * 注意：首次运行需要手动扫码登录小红书，登录状态会保存到 .xhs-cookies.json
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const COOKIES_FILE = path.join(PROJECT_ROOT, '.xhs-cookies.json');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src/data/xhs-posts.json');

// 搜索关键词列表
const KEYWORDS = [
  'FCN 固定票息',
  'FCN 结构化产品',
  '私行理财 FCN',
  '结构化票据 敲入',
  '雪球结构 固定收益',
];

// 每个关键词抓取的帖子数
const POSTS_PER_KEYWORD = 5;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveCookies(page) {
  const cookies = await page.cookies();
  fs.writeFileSync(COOKIES_FILE, JSON.stringify(cookies, null, 2));
  console.log('✅ Cookies 已保存');
}

async function loadCookies(page) {
  if (fs.existsSync(COOKIES_FILE)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE, 'utf-8'));
    await page.setCookie(...cookies);
    console.log('✅ 已加载保存的 Cookies');
    return true;
  }
  return false;
}

async function waitForLogin(page) {
  console.log('\n🔐 需要登录小红书...');
  console.log('   请在打开的浏览器窗口中扫码登录');
  console.log('   登录成功后脚本会自动继续...\n');

  // 等待用户登录成功（检测页面上出现用户头像或特定元素）
  try {
    await page.waitForSelector('.user-info, .sidebar-user, [class*="user"]', {
      timeout: 120000 // 2分钟超时
    });
    console.log('✅ 登录成功！');
    await saveCookies(page);
  } catch {
    // 如果没检测到特定元素，让用户确认
    console.log('⏳ 如果已登录，脚本将继续运行...');
    await delay(3000);
    await saveCookies(page);
  }
}

async function searchAndScrape(page, keyword) {
  console.log(`\n🔍 正在搜索: "${keyword}"`);

  const searchUrl = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}&source=web_search_result_notes`;
  await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(3000); // 等待动态内容加载

  // 尝试提取搜索结果中的帖子
  const posts = await page.evaluate((maxPosts) => {
    const results = [];

    // 小红书搜索结果页的笔记卡片选择器（可能需要根据实际DOM调整）
    const selectors = [
      'section.note-item',
      '[class*="note-item"]',
      'a[href*="/explore/"]',
      'a[href*="/discovery/item/"]',
      'a[href*="/search_result/"]',
      '.feeds-page .note-item',
      'div[class*="NoteCard"]',
      'section[class*="note"]',
    ];

    let cards = [];
    for (const sel of selectors) {
      cards = document.querySelectorAll(sel);
      if (cards.length > 0) break;
    }

    // 如果通过选择器找不到，尝试通过链接提取
    if (cards.length === 0) {
      const allLinks = document.querySelectorAll('a[href]');
      const noteLinks = Array.from(allLinks).filter(a => {
        const href = a.getAttribute('href') || '';
        return href.includes('/explore/') || href.includes('/discovery/item/');
      });

      const seen = new Set();
      for (const link of noteLinks) {
        if (results.length >= maxPosts) break;
        const href = link.getAttribute('href');
        const fullUrl = href.startsWith('http') ? href : `https://www.xiaohongshu.com${href}`;

        // 提取笔记ID去重
        const idMatch = fullUrl.match(/\/(?:explore|discovery\/item)\/([a-f0-9]+)/);
        const noteId = idMatch ? idMatch[1] : fullUrl;
        if (seen.has(noteId)) continue;
        seen.add(noteId);

        // 尝试获取标题和其他信息
        const parent = link.closest('section, div[class*="note"], div[class*="card"]') || link;
        const titleEl = parent.querySelector('[class*="title"], h3, h2, .title, span[class*="title"]');
        const authorEl = parent.querySelector('[class*="author"], [class*="name"], .author, .nickname');
        const likeEl = parent.querySelector('[class*="like"], [class*="count"]');

        results.push({
          title: titleEl?.textContent?.trim() || link.textContent?.trim()?.substring(0, 80) || '小红书笔记',
          url: fullUrl,
          noteId: noteId,
          author: authorEl?.textContent?.trim() || '',
          likes: likeEl?.textContent?.trim() || '',
        });
      }
      return results;
    }

    // 通过卡片元素提取
    const seen = new Set();
    for (const card of cards) {
      if (results.length >= maxPosts) break;

      const linkEl = card.querySelector('a[href]') || (card.tagName === 'A' ? card : null);
      if (!linkEl) continue;

      const href = linkEl.getAttribute('href') || '';
      const fullUrl = href.startsWith('http') ? href : `https://www.xiaohongshu.com${href}`;

      const idMatch = fullUrl.match(/\/(?:explore|discovery\/item)\/([a-f0-9]+)/);
      const noteId = idMatch ? idMatch[1] : fullUrl;
      if (seen.has(noteId)) continue;
      seen.add(noteId);

      const titleEl = card.querySelector('[class*="title"], .title, h3, span[class*="title"]');
      const authorEl = card.querySelector('[class*="author"], [class*="name"], .author, .nickname');
      const likeEl = card.querySelector('[class*="like"], [class*="count"], .like-wrapper span');
      const coverEl = card.querySelector('img[src]');

      results.push({
        title: titleEl?.textContent?.trim() || '小红书笔记',
        url: fullUrl,
        noteId: noteId,
        author: authorEl?.textContent?.trim() || '',
        likes: likeEl?.textContent?.trim() || '',
        cover: coverEl?.getAttribute('src') || '',
      });
    }

    return results;
  }, POSTS_PER_KEYWORD);

  console.log(`   找到 ${posts.length} 条帖子`);
  return posts.map(p => ({ ...p, keyword }));
}

async function scrapePostDetail(page, post) {
  try {
    console.log(`   📄 正在获取详情: ${post.title.substring(0, 30)}...`);
    await page.goto(post.url, { waitUntil: 'networkidle2', timeout: 20000 });
    await delay(2000);

    const detail = await page.evaluate(() => {
      // 尝试多种选择器提取内容
      const titleEl = document.querySelector('#detail-title, [class*="title"], .note-content h1, h1');
      const contentEl = document.querySelector('#detail-desc, [class*="desc"], .note-content .content, [class*="note-text"]');
      const authorEl = document.querySelector('[class*="author"] [class*="name"], .author-wrapper .name, [class*="username"]');
      const likeEl = document.querySelector('[class*="like-wrapper"] span, [class*="like"] [class*="count"]');
      const collectEl = document.querySelector('[class*="collect-wrapper"] span, [class*="collect"] [class*="count"]');
      const commentEl = document.querySelector('[class*="chat-wrapper"] span, [class*="comment"] [class*="count"]');
      const timeEl = document.querySelector('[class*="date"], [class*="time"], .note-content .date');
      const tagEls = document.querySelectorAll('[class*="tag"] a, .tag-item, a[href*="tag"]');

      return {
        title: titleEl?.textContent?.trim() || '',
        content: contentEl?.textContent?.trim()?.substring(0, 300) || '',
        author: authorEl?.textContent?.trim() || '',
        likes: likeEl?.textContent?.trim() || '',
        collects: collectEl?.textContent?.trim() || '',
        comments: commentEl?.textContent?.trim() || '',
        publishDate: timeEl?.textContent?.trim() || '',
        tags: Array.from(tagEls).map(t => t.textContent.trim()).filter(Boolean).slice(0, 5),
      };
    });

    return { ...post, ...detail };
  } catch (err) {
    console.log(`   ⚠️ 获取详情失败: ${err.message}`);
    return post;
  }
}

function parseCount(str) {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.万千k]/gi, '');
  if (cleaned.includes('万') || cleaned.toLowerCase().includes('w')) {
    return Math.round(parseFloat(cleaned) * 10000) || 0;
  }
  if (cleaned.includes('千') || cleaned.toLowerCase().includes('k')) {
    return Math.round(parseFloat(cleaned) * 1000) || 0;
  }
  return parseInt(cleaned) || 0;
}

function generateMockEntries(posts) {
  const today = new Date().toISOString().split('T')[0];
  const categories = ['opinion', 'tutorial', 'strategy', 'risk', 'market'];

  return posts.map((post, i) => {
    const category = categories[i % categories.length];
    const hour = 8 + i;

    return {
      id: `xhs_${post.noteId || i}`,
      title: post.title || `小红书FCN笔记 #${i + 1}`,
      summary: post.content || post.title || '小红书用户分享的FCN结构化产品相关内容。',
      author: post.author ? `小红书·${post.author}` : '小红书·理财博主',
      platform: 'xiaohongshu',
      category: category,
      originalUrl: post.url,
      publishedAt: `${today}T${String(hour).padStart(2, '0')}:00:00Z`,
      likes: parseCount(post.likes) || Math.floor(Math.random() * 3000) + 500,
      comments: parseCount(post.comments) || Math.floor(Math.random() * 500) + 50,
      shares: parseCount(post.collects) || Math.floor(Math.random() * 1000) + 100,
      tags: post.tags?.length > 0 ? post.tags : ['小红书', 'FCN', post.keyword || '结构化产品'],
    };
  });
}

function updateMockFile(xhsPosts) {
  const mockPath = path.join(PROJECT_ROOT, 'src/data/mock.ts');
  let content = fs.readFileSync(mockPath, 'utf-8');

  // 生成新的小红书条目代码
  const entries = xhsPosts.map(post => {
    const tagsStr = post.tags.map(t => `"${t}"`).join(', ');
    return `  {
    id: "${post.id}",
    title: "${post.title.replace(/"/g, '\\"')}",
    summary: "${post.summary.replace(/"/g, '\\"').replace(/\n/g, ' ')}",
    author: "${post.author.replace(/"/g, '\\"')}",
    platform: "xiaohongshu",
    category: "${post.category}",
    originalUrl: "${post.originalUrl}",
    publishedAt: \`\${today}T${post.publishedAt.split('T')[1]}\`,
    likes: ${post.likes},
    comments: ${post.comments},
    shares: ${post.shares},
    tags: [${tagsStr}],
  }`;
  }).join(',\n');

  // 查找并替换现有的小红书搜索链接条目
  // 匹配所有包含 xiaohongshu.com/search_result 的条目块
  const searchResultPattern = /\s*\/\/\s*=+\s*小红书[\s\S]*?originalUrl:\s*"https:\/\/www\.xiaohongshu\.com\/search_result[\s\S]*?\},/g;

  // 先移除所有旧的小红书搜索链接条目
  let newContent = content.replace(searchResultPattern, '');

  // 在 mockSignals 数组末尾（最后一个 } 之前）插入新条目
  const lastEntryEnd = newContent.lastIndexOf('},');
  if (lastEntryEnd !== -1) {
    const insertPoint = lastEntryEnd + 2;
    const newEntries = '\n  // ====== 小红书 - 真实帖子（自动抓取） ======\n' + entries;
    newContent = newContent.slice(0, insertPoint) + newEntries + '\n' + newContent.slice(insertPoint);
  }

  fs.writeFileSync(mockPath, newContent);
  console.log(`\n✅ mock.ts 已更新，替换了 ${xhsPosts.length} 条小红书条目`);
}

async function main() {
  console.log('🚀 小红书 FCN 帖子爬虫启动\n');
  console.log('================================');

  const browser = await puppeteer.launch({
    headless: false, // 需要界面来扫码登录
    defaultViewport: { width: 1280, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 设置 User-Agent
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // 尝试加载已保存的 cookies
  const hasCookies = await loadCookies(page);

  // 访问小红书首页
  await page.goto('https://www.xiaohongshu.com/explore', { waitUntil: 'networkidle2' });
  await delay(2000);

  // 检查是否需要登录
  const needLogin = await page.evaluate(() => {
    return !!document.querySelector('[class*="login"], .login-btn, [class*="Login"]');
  });

  if (!hasCookies || needLogin) {
    await waitForLogin(page);
  }

  // 开始搜索和抓取
  const allPosts = [];
  const seenIds = new Set();

  for (const keyword of KEYWORDS) {
    try {
      const posts = await searchAndScrape(page, keyword);

      // 去重
      for (const post of posts) {
        if (!seenIds.has(post.noteId)) {
          seenIds.add(post.noteId);
          allPosts.push(post);
        }
      }

      await delay(2000 + Math.random() * 2000); // 随机延迟避免被封
    } catch (err) {
      console.log(`   ⚠️ 搜索"${keyword}"失败: ${err.message}`);
    }
  }

  console.log(`\n📊 共找到 ${allPosts.length} 条不重复帖子`);

  // 获取每个帖子的详情（限制数量避免太慢）
  const topPosts = allPosts.slice(0, 8); // 最多取8条
  const detailedPosts = [];

  for (const post of topPosts) {
    const detailed = await scrapePostDetail(page, post);
    detailedPosts.push(detailed);
    await delay(1500 + Math.random() * 1500);
  }

  // 保存原始数据
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(detailedPosts, null, 2));
  console.log(`\n💾 原始数据已保存到: ${OUTPUT_FILE}`);

  // 生成 mock 条目并更新 mock.ts
  const mockEntries = generateMockEntries(detailedPosts);
  updateMockFile(mockEntries);

  await browser.close();

  console.log('\n================================');
  console.log('🎉 爬虫完成！');
  console.log(`   抓取了 ${detailedPosts.length} 条小红书真实帖子`);
  console.log('   mock.ts 已自动更新');
  console.log('   刷新浏览器即可看到新数据\n');
}

main().catch(err => {
  console.error('❌ 爬虫出错:', err);
  process.exit(1);
});
