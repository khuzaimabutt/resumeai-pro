// Generate a PDF from a fully-rendered preview URL using Puppeteer.
// Works locally with bundled Chromium (puppeteer-core + system Chrome) or
// on Vercel via @sparticuz/chromium.

export async function renderPdfFromUrl(url: string, cookieHeader?: string): Promise<Buffer> {
  const isVercel = !!process.env.VERCEL;

  let browser;
  if (isVercel) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: { width: 1240, height: 1754 },
    });
  } else {
    const puppeteer = await import("puppeteer-core");
    const exec =
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      detectLocalChrome();
    browser = await puppeteer.launch({
      executablePath: exec,
      headless: true,
      defaultViewport: { width: 1240, height: 1754 },
    });
  }

  try {
    const page = await browser.newPage();
    if (cookieHeader) {
      await page.setExtraHTTPHeaders({ cookie: cookieHeader });
    }
    await page.goto(url, { waitUntil: "networkidle0", timeout: 25000 });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "16mm", right: "16mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

function detectLocalChrome(): string {
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ];
  // best-effort — if none exist puppeteer.launch will throw with a clear msg
  return candidates[0];
}
