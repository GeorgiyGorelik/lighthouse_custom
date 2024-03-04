import logger from "../../logger/logger.js";

export default class Element {
    static DEFAULT_TIMEOUT = 60000;
    locator;
    element;
    locatorType;

    constructor(locator, page){
        this.originalLocator = locator
        this.locator = locator
        this.page = page
        this.locatorType = (this.locator.startsWith("./") || this.locator.startsWith("/") || this.locator.startsWith("(")) ? "XPATH" : "CSS";
    }

    // Action: find element on page with timeout for operation
    async find(timeout=Element.DEFAULT_TIMEOUT){
        logger.debug(`[FIND] ${this.locatorType}:${this.locator}`);
        switch(this.locatorType){
            case "XPATH":
                this.element = await this.page.waitForXPath(this.locator, {visible: true, 'timeout': timeout});
                break;
            default:
                this.element = await this.page.waitForSelector(this.locator, {visible: true, 'timeout': timeout});
        }
        return this.element    
    }

    // Action: get element from list on page
    async findFromList(timeout=Element.DEFAULT_TIMEOUT, index){
        logger.debug(`[FIND] ${this.locatorType}:${this.locator} -- index ${index}`);
        switch(this.locatorType){
            case "XPATH":
                throw new Error("Not implemented yet");
            default:
                var elements = await this.page.$$(this.locator);
                this.element = elements[index]
        }
        return this.element
    }

    // Action: find hidden element on page with timeout for operation
    async findHidden(timeout=Element.DEFAULT_TIMEOUT){
        logger.debug(`[FINDHIDDEN] ${this.locatorType}:${this.locator}`);
        switch(this.locatorType){
            case "XPATH":
                this.element = await this.page.waitForXPath(this.locator, {hidden: true, 'timeout': timeout});
                break;
            default:
                this.element = await this.page.waitForSelector(this.locator, {hidden: true, 'timeout': timeout});
        }
        return this.element
    }

    // Action: count number of elements
    async count(){
        logger.debug(`[COUNT] ${this.locatorType}:${this.locator}`);
        switch(this.locatorType){
            case "XPATH":
                logger.debug(`[COUNT] Not implemented for XPath selectors`);
                break;
            default:
                return await this.page.evaluate((locator) => { return document.querySelectorAll(locator).length; }, this.locator);
        }
    }

    // Action: replace % in selector with actual data and return context for chaining
    replace(text){
        logger.debug(`[REPLACE] ${this.locatorType}:${this.locator}`);
        this.locator = this.originalLocator.replace(/%/g, text)
        logger.debug(`[REPLACE] ${this.locatorType}:${this.locator}`);
        return this;
    }
}
