import { Page } from "@playwright/test";
import { LoginPage } from "../dsl/web/loginPage";
import { Context } from "./context";

class DslRegistry {
    pageObjects: WebRegister
    
    constructor(ctx: Context) {
        this.pageObjects = new WebRegister(ctx)
    }
}

class WebRegister {
    #loginPage: LoginPage
    #ctx: Context

    constructor(ctx: Context) {
        this.#ctx = ctx
    }

    get loginPage() { // lazy loading
        if (!this.#loginPage) {
            this.#loginPage = new LoginPage(this.#ctx)
        }
        return this.#loginPage
    }
}

export {DslRegistry}