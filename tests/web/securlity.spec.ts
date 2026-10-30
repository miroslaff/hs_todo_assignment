import { Locator } from "@playwright/test";
import { test, expect } from "../../core/context";


test.beforeEach(async ({ ctx }) => {
    await ctx.dsl.pageObjects.todoPage.goto();
})

test.afterEach(async ({ ctx }) => {
    await ctx.page.close()
})

const injections = [
    `<form action="javascript:alert('hello world!')"><input type="submit" value="Click to Verify"></form>`,
    `javascript:alert('hello world!')`,
    `javascript:/*--*///\nalert(1)`,
    `<input type="text" autofocus onfocus="alert('hello world!')">`,
    `<svg onload="alert('hello world!')">`,
    `' onfocus='alert(1)'`,
    `"><script>alert(1)</script>`,
    `<script>alert('hello world!')</script>`
]

test.describe("Various input field injections", () => {
    injections.forEach(inject => {
        test(`Create a task with '${inject}'`, async ({ ctx }) => {
            let newTask: Locator
            await test.step("Register dialog listener", async () => {
                ctx.page.on('dialog', async dialog => {
                    test.info().annotations.push({
                        type: "Alert displayed",
                        description: dialog.message()
                    });
                    await dialog.accept()
                    throw new Error("Dialog displayed");
                })
            })
            await test.step("Creating the task", async () => {
                const taskCount = await ctx.dsl.pageObjects.todoPage.getTaskCount()
                await ctx.dsl.pageObjects.todoPage.createTask(inject)
                newTask = await ctx.dsl.pageObjects.todoPage.getTask(taskCount)
            })
            await test.step("Interacting with the task to verify its not malicious", async () => {
                await expect(newTask).toBeVisible()

                await newTask.click()
            })
        })
    })

})