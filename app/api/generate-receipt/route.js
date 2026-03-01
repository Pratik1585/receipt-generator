import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function POST(req) {
  try {
    const data = await req.json();

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 40px; }
            .box { border: 1px solid #000; padding: 20px; }
            h2 { text-align: center; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .section { margin-top: 15px; }
            .footer { margin-top: 40px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>PAYMENT RECEIPT</h2>

            <div class="row">
              <div>
                <b>${data.businessName || ""}</b><br/>
                ${data.address || ""}<br/>
                Phone: ${data.phone || ""}
              </div>
              <div>
                Receipt No: ${data.receiptNo || ""}<br/>
                Date: ${data.date || ""}
              </div>
            </div>

            <div class="section">
              <b>Received From:</b> ${data.customer || ""}
            </div>

            <div class="section">
              <b>Amount:</b> ₹${data.amount || ""}
            </div>

            <div class="section">
              <b>Amount in Words:</b> ${data.amountWords || ""}
            </div>

            <div class="footer">
              For <b>${data.businessName || ""}</b><br/><br/>
              ________________________<br/>
              Authorized Signatory
            </div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=receipt.pdf",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error generating PDF", { status: 500 });
  }
}