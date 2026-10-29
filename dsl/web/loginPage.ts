import {Page, Locator} from '@playwright/test'
import {Context} from '../../core/context'

class LoginPage {
    context: Context
    
    constructor(ctx: Context) {
        this.context = ctx
    }

    async goto() {
        await this.context.page.goto("https://courses.ultimateqa.com/users/sign_in")
    }
}

export {LoginPage}