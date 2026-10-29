import {Page, Locator} from '@playwright/test'
import {Context} from '../../core/context'

class ToDoPage {
    context: Context
    
    constructor(ctx: Context) {
        this.context = ctx
    }

    async goto() {
        await this.context.page.goto("https://courses.ultimateqa.com/users/sign_in")
    }
}

export {ToDoPage}