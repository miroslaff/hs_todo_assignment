import { Page, test as base } from "@playwright/test";
import { DslRegistry } from "./registers";
import { Helpers } from "./helpers";

type ContextFixture = {
    ctx: Context;
}

export const test = base.extend<ContextFixture>({
    ctx: async ({page}, use) => {
        const context = new Context(page)
        await use(context);
    }
})



class Context {
    readonly dsl: DslRegistry;
    readonly page: Page;
    readonly helpers: Helpers

    constructor(page: Page) {
        this.page = page;
        this.dsl = new DslRegistry(this);
        this.helpers = new Helpers();
    }
}

export {expect} from '@playwright/test'
export {Context}