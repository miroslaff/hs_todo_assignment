import { Page } from "@playwright/test";
import { ToDoPage } from "../dsl/web/todoPage";
import { Context } from "./context";

class DslRegistry {
    pageObjects: WebRegister
    
    constructor(ctx: Context) {
        this.pageObjects = new WebRegister(ctx)
    }
}

class WebRegister {
    #loginPage: ToDoPage
    #ctx: Context

    constructor(ctx: Context) {
        this.#ctx = ctx
    }

    get loginPage() {
        if (!this.#loginPage) {
            this.#loginPage = new ToDoPage(this.#ctx)
        }
        return this.#loginPage
    }
}

export {DslRegistry}