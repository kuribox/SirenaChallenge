const puppeteer = require('puppeteer');
const config = require("../config/config");

module.exports = class Easy {
  constructor(orderId, query) {
    this.query = query;
    this.pageURL = 'https://easy.com.ar';
    this.elements = undefined;
    this.isLoggedIn = false;
    this.requestName = `Easy - (${orderId})`;
  }

  async initCrawling() {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 800 });
  }

  async login(user, password) {
    console.log(`${this.requestName} - Loggin In`);

    // Abre la pagina de login, y carga los datos
    await this.page.goto(`${this.pageURL}/tienda/es/AjaxLogonForm?catalogId=10051&myAcctMain=1&langId=-5&storeId=10151`);
    await this.page.type('#WC_AccountDisplay_FormInput_logonId_In_Logon_1', user);
    await this.page.type('#WC_AccountDisplay_FormInput_logonPassword_In_Logon_1', password);
    await this.page.click('#WC_AccountDisplay_links_2');

    // Verifica los campos de error
    let error = null;
    await this.page.waitForSelector('#emailErrorMessage', {visible: true, timeout: 2000}).then(async (element) => {
      error = await this.page.evaluate(element => element.textContent, element);
    }).catch(() => {});
    
    await this.page.waitForSelector('#logonErrorMessage', {visible: true, timeout: 2000}).then(async (element) => {
      error = await this.page.evaluate(element => element.textContent, element);
    }).catch(() => {});

    if (error) {
      return Promise.reject(error); // devuelve el error del login
    } else {
      console.log(`${this.requestName} - Logged In`);
      this.isLoggedIn = true; // Marca la clase como logueada
      return Promise.resolve();
    }
  }

  async crawling() {
    if (this.isLoggedIn) {
      console.log(`${this.requestName} - Init search`);
      try {
          await this.page.goto(this.pageURL);
          console.log(`${this.requestName} - Page Loaded`);

          // Busca el query
          await this.page.type('#SimpleSearchForm_SearchTerm', this.query);
          await this.page.click('#WC_CachedHeaderDisplay_button_1')

          // Espera por la busqueda
          await this.page.waitForSelector('#content588');
          
          console.log(`${this.requestName} - Searching...`);

          let List = [];

          // Recorre todas las paginas
          const waitMore = async () => {
            await this.page.waitForSelector('#content588 .on-demand > .see-more', {visible: true, timeout: 3000}).then(async () => {
              await this.page.click('#content588 > div > div > div > div > div.on-demand > input.see-more');
              await waitMore();
            }).catch(() => {});
          }
          await waitMore();

          // Crea un array con las url de cada producto
          const pageList = await this.page.$$eval('div.thumb-product', anchors => { 
            return anchors.map(anchor => {
              return anchor.querySelector(".thumb-name > a").href;
            })
          });
          
          // Va ejecutando todas las paginas de productos en paralelo, segun la configuracion de procesos en paralelo
          const parallel = config.crawling.parallel;
          for (let j = 0; j < pageList.length; j=j+parallel) {
            const promises = [];
            for (let i = 0; i < parallel; i++) {
              const pageUrl = pageList[j + i];
              if (pageUrl) {
                promises.push(this.browser.newPage().then(async page => {
                  await page.goto(pageUrl, {waitUntil: 'domcontentloaded'});

                    // Titulo
                    let element = await page.$(".prod-title");
                    const title = await page.evaluate(element => element.textContent, element);
                    
                    // Precio
                    element = await page.$(".prod-price .price-e");
                    const price = (element) ? await page.evaluate(element => Number(element.textContent.replace(/(\r\n|\n|\r|\t)/gm, "").replace(".","")), element) : null;

                    // Precio con descuento
                    element = await page.$(".prod-price .price-mas");
                    const discountPrice = (element) ? await page.evaluate(element => Number(element.textContent.replace(/(\r\n|\n|\r|\t)/gm, "").replace(".","")), element): null;

                    // SKU
                    element = await page.$(".yotpo.bottomLine");
                    const SKU = (element) ? await page.evaluate(element => element.getAttribute('data-product-id'), element) : null;

                    // Categoria
                    const category = await page.$$eval('#breadcrumb a', anchors => { 
                      let value = "";
                      for (const e of anchors) {
                        const tmpVal = e.textContent;
                        value += (tmpVal !== 'Inicio') ? `/${tmpVal}` : "";
                      } 
                      return value
                    })

                    // Descripcion
                    element = await page.$("#Description .tabs-bottomline2 .tabs-inner .tabs-list");
                    const description = (element) ? await page.evaluate(element => element.innerHTML.replace(/(\r\n|\n|\r|\t)/gm, ""), element) : null;

                    // Images
                    const images = [];
                    if (SKU) {
                      images.push(`https://easyar.scene7.com/is/image/EasyArg/${SKU}`)
                    }

                  List.push({
                    "title": title,
                    "price": price,
                    "SKU": SKU,
                    "discountPrice": discountPrice,
                    "category": category,
                    "description": description,
                    "images": images
                  });
                  await page.close();
                }));
              }
            }
            await Promise.all(promises)
          }
        await this.browser.close();
        this.elements = List;
      } catch(err) {
        console.error(`${this.requestName} - ERROR: crawling Failed`, err);
        this.elements = null;
      }
    } else {
      console.error(`${this.requestName} - ERROR: Not Logged In`);
      this.elements = null;
    }
  }
}