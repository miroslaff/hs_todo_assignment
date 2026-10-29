import { Page, test as base } from "@playwright/test";
import { DslRegistry } from "./registers";

type ContextFixture = {
    web: Context;
}

export const test = base.extend<ContextFixture>({
    web: async ({page}, use) => {
        const ctx = new Context(page)
        await use(ctx);
    }
})



class Context {
    dsl: DslRegistry;
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
        this.dsl = new DslRegistry(this);
    }
}

export {expect} from '@playwright/test'
export {Context}