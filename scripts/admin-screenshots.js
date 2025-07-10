import puppeteer from "puppeteer";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });

  try {
    const page = await browser.newPage();

    // Скриншот страницы входа
    console.log("Делаю скриншот страницы входа...");
    await page.goto("http://localhost:3000/admin");
    await sleep(2000);
    await page.screenshot({
      path: "admin-login.png",
      fullPage: true,
    });

    // Входим в админку
    console.log("Вхожу в админку...");
    await page.type('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await sleep(3000);

    // Скриншот страницы товаров
    console.log("Делаю скриншот страницы товаров...");
    await page.screenshot({
      path: "admin-products.png",
      fullPage: true,
    });

    // Переходим к редактированию товара
    console.log("Переходим к редактированию товара...");
    await page.click('a[href*="/edit"]');
    await sleep(3000);
    await page.screenshot({
      path: "admin-edit-product.png",
      fullPage: true,
    });

    // Переходим к промокодам
    console.log("Переходим к промокодам...");
    await page.goto("http://localhost:3000/admin/promocodes");
    await sleep(2000);
    await page.screenshot({
      path: "admin-promocodes.png",
      fullPage: true,
    });

    // Переходим к созданию промокода
    console.log("Переходим к созданию промокода...");
    await page.click('a[href="/admin/promocodes/new"]');
    await sleep(2000);
    await page.screenshot({
      path: "admin-new-promocode.png",
      fullPage: true,
    });

    console.log("Все скриншоты сделаны!");
  } catch (error) {
    console.error("Ошибка при создании скриншотов:", error);
  } finally {
    await browser.close();
  }
}

takeScreenshots();
