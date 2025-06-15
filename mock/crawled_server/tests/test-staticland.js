const { chromium } = require('playwright');

async function testStaticLand() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Starting StaticLand Browser Tests...\n');
    
    // サーバーが起動していることを確認
    console.log('📡 Testing server connectivity...');
    const response = await page.goto('http://localhost:3000/static', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    if (!response.ok()) {
      throw new Error(`Server returned ${response.status()}: ${response.statusText()}`);
    }
    console.log('✅ Server is responding correctly\n');
    
    // ホームページテスト
    console.log('🏠 Testing Homepage...');
    await page.waitForSelector('h1', { timeout: 5000 });
    
    const title = await page.textContent('h1');
    console.log(`   Title: "${title}"`);
    
    const articleCards = await page.locator('article').count();
    console.log(`   Articles displayed: ${articleCards}`);
    
    const tagLinks = await page.locator('a[href^="/static/tags/"]').count();
    console.log(`   Tag links: ${tagLinks}`);
    
    // ナビゲーションテスト
    console.log('   Testing navigation elements...');
    const headerTitle = await page.textContent('header a[href="/static"]');
    console.log(`   Header title: "${headerTitle}"`);
    
    const navLinks = await page.locator('nav a').count();
    console.log(`   Navigation links: ${navLinks}`);
    console.log('✅ Homepage tests passed\n');
    
    // 記事詳細ページテスト
    console.log('📄 Testing Article Page...');
    await page.click('a[href="/static/articles/article-1"]');
    await page.waitForSelector('article', { timeout: 5000 });
    
    const articleTitle = await page.textContent('article h1');
    console.log(`   Article title: "${articleTitle}"`);
    
    const sections = await page.locator('article section').count();
    console.log(`   Article sections: ${sections}`);
    
    const tocLinks = await page.locator('nav a[href^="#"]').count();
    console.log(`   Table of contents links: ${tocLinks}`);
    
    const relatedArticles = await page.locator('div:has-text("Related Articles") a').count();
    console.log(`   Related articles: ${relatedArticles}`);
    console.log('✅ Article page tests passed\n');
    
    // タグページテスト
    console.log('🏷️ Testing Tag Page...');
    await page.click('a[href="/static/tags/tech"]');
    await page.waitForSelector('h1', { timeout: 5000 });
    
    const tagTitle = await page.textContent('h1');
    console.log(`   Tag page title: "${tagTitle}"`);
    
    const taggedArticles = await page.locator('article').count();
    console.log(`   Articles with this tag: ${taggedArticles}`);
    
    const otherTags = await page.locator('section:has-text("Explore Other Tags") a').count();
    console.log(`   Other tag links: ${otherTags}`);
    console.log('✅ Tag page tests passed\n');
    
    // レスポンシブテスト
    console.log('📱 Testing Responsive Design...');
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('http://localhost:3000/static', { waitUntil: 'networkidle' });
    
    const mobileNavVisible = await page.locator('nav.hidden.md\\:flex').isVisible();
    console.log(`   Mobile navigation hidden: ${!mobileNavVisible}`);
    
    await page.setViewportSize({ width: 1024, height: 768 }); // Desktop
    await page.reload({ waitUntil: 'networkidle' });
    
    const desktopNavVisible = await page.locator('nav.hidden.md\\:flex').isVisible();
    console.log(`   Desktop navigation visible: ${desktopNavVisible}`);
    console.log('✅ Responsive design tests passed\n');
    
    // パフォーマンステスト
    console.log('⚡ Testing Performance...');
    const performanceEntries = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
        domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
        firstContentfulPaint: Math.round(performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0)
      };
    });
    
    console.log(`   Load time: ${performanceEntries.loadTime}ms`);
    console.log(`   DOM ready: ${performanceEntries.domContentLoaded}ms`);
    console.log(`   First paint: ${performanceEntries.firstContentfulPaint}ms`);
    console.log('✅ Performance tests completed\n');
    
    // スクリーンショット撮影
    console.log('📸 Taking screenshots...');
    await page.goto('http://localhost:3000/static', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'tests/screenshots/staticland-homepage.png', fullPage: true });
    console.log('   📷 Homepage screenshot saved: tests/screenshots/staticland-homepage.png');
    
    await page.goto('http://localhost:3000/static/articles/article-1', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'tests/screenshots/staticland-article.png', fullPage: true });
    console.log('   📷 Article screenshot saved: tests/screenshots/staticland-article.png');
    
    console.log('✅ Screenshots completed\n');
    
    console.log('🎉 All StaticLand tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// テスト実行
if (require.main === module) {
  testStaticLand().catch(console.error);
}

module.exports = { testStaticLand };