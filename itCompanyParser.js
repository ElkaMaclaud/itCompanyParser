import puppeteer from "puppeteer";
import * as fs from "fs";

async function itCompanyList() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  page.on("console", (msg) => {
    console.log("Браузер:", msg.text());
  });

  await page.goto(
    "https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%A0%D0%B0%D0%BD%D0%BA%D0%B8%D0%BD%D0%B3_TAdviser100:_%D0%9A%D1%80%D1%83%D0%BF%D0%BD%D0%B5%D0%B9%D1%88%D0%B8%D0%B5_%D0%98%D0%A2-%D0%BA%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D0%B8_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8_2023",
    { waitUntil: "domcontentloaded" }
  );
  await page.setViewport({ width: 1280, height: 1024 });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  let arr = await page.evaluate(() => {
    let firstTable = document.querySelector(".cwiki_table:first-of-type");
    if (firstTable) {
      let elem = Array.from(
        firstTable.querySelectorAll("td:nth-child(3) a"),
        (el) => ({ name: el.innerText, href: el.href })
      );
      return elem;
    }
    return [];
  });

  fs.writeFileSync(
    "companyLinks.txt",
    arr.map((e) => `${e.name}: ${e.href}`).join("\n")
  );

  for (let i = 0; i < arr.length; i++) {
    await page.goto(arr[i].href, { waitUntil: "domcontentloaded" });
    fs.appendFile("data.txt", i + ")" + arr[i].name + "\n", (err) => {
      if (err) throw err;
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    let dataCompany = await page.evaluate(() => {
      let data = document.querySelector(".company_left");
      return data ? data.innerText.split("\n") : [];
    });
    fs.appendFile("data.txt", dataCompany.join("\n") + "\n", (err) => {
      if (err) throw err;
    });
  }

  console.log("Конец!")
  await browser.close()
}

itCompanyList();

// args: ['--proxy-server=http://<ваш_прокси_адрес>:<порт>'] - в  const browser = await puppeteer.launch({headless: false,});
// await page.goto(
//   "https://it-rating.ua/it-kompaniya#category_id=59&manufacturer_id=2&page=1&min_price=0&max_price=0",
//   {
//     waitUntil: "load",
//   }
// );

// console.log(arr)

// while (pages > idx) {
//   await new Promise((resolve) => setTimeout(resolve, 3000));
//   let arr = await page.evaluate(() => {
//     let elem = Array.from(
//       document.querySelectorAll("a.fxtabl__td"),
//       (el) => el.href
//     );
//     return elem;
//   });

//   allUrls.push(...arr);

// await page.click(".pagination__link_arrow");

//   idx++;
// }
