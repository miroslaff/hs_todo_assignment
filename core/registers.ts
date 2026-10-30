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
    #todoPage: ToDoPage
    #ctx: Context

    constructor(ctx: Context) {
        this.#ctx = ctx
    }

    get todoPage() {
        if (!this.#todoPage) {
            this.#todoPage = new ToDoPage(this.#ctx)
        }
        return this.#todoPage
    }
}

export {DslRegistry}