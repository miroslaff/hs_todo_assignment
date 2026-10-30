import { Locator } from '@playwright/test';
import { test, expect } from '../../core/context';

test.beforeEach(async ({ ctx }) => {
    await ctx.dsl.pageObjects.todoPage.goto();
})

test.afterEach(async ({ ctx }) => {
    await ctx.page.close()
})

test.describe("Task Creation, Edit and Removal", () => {
    test("Create a task", async ({ ctx }) => {
        let beforeCount: number
        let taskName: string
        await test.step("Getting current task count and generating random name", async () => {
            beforeCount = await ctx.dsl.pageObjects.todoPage.getTaskCount() as number
            taskName = `From automation ${ctx.helpers.uuid()}`
        })
        let newTask: Locator
        await test.step("Creating the task", async () => {
            await ctx.dsl.pageObjects.todoPage.createTask(taskName)
            newTask = await ctx.dsl.pageObjects.todoPage.getTask(taskName)
        })
        await test.step("Verifying that task was created and added to the list", async () => {
            await expect(newTask).toBeVisible()
            expect(await ctx.dsl.pageObjects.todoPage.getTaskCount()).toBeGreaterThan(beforeCount)
        })
    })

    test("Edit a random task", async ({ ctx }) => {
        test.info().annotations.push({
            type: "flaky",
            description: "Double click event is set on <ul> element and default elements have same data-id, making it hard to work on existing items"
        })

        let task: Locator
        let originalName: string
        await test.step("Picking random task", async () => {
            await expect(ctx.page.locator(ctx.dsl.pageObjects.todoPage.selectors.taskItems)).toHaveCount(2)
            task = await ctx.dsl.pageObjects.todoPage.getTask("Walk the dog")
            originalName = await task.textContent() ?? ""
            if (originalName === "Walk the dog") {
                console.log("stoka")
            }
        })
        let newName: string
        await test.step("Editing the task", async () => {
            newName = `${originalName} ${ctx.helpers.uuid()}`
            await ctx.dsl.pageObjects.todoPage.editTask(newName, "Walk the dog")
        })
        await test.step("Verifying the task was edited", async () => {
            const newTask = await ctx.dsl.pageObjects.todoPage.getTask(newName)
            expect(await task.textContent()).not.toEqual(originalName)
            await expect(newTask).toBeVisible()
        })



    })
    test("Remove a random task", async ({ ctx }) => {
        test.info().annotations.push({
            type: "flaky",
            description: "Double click event is set on <ul> element and default elements have same data-id, making it hard to work on existing items"
        })

        let task: Locator
        let taskName = ""
        await test.step("Pick a random task", async () => {
            task = await ctx.dsl.pageObjects.todoPage.getTask()
            taskName = await task.textContent() ?? ""
        })
        await test.step(`Remove task with name ${taskName}`, async () => {
            await ctx.dsl.pageObjects.todoPage.removeTask(taskName)
        })
        await test.step("Verifying that task was removed", async () => {
            task = await ctx.dsl.pageObjects.todoPage.getTask(taskName)
            await expect(task).toHaveCount(0)
        })
    })
})

test.describe("Task content variants", () => {
    test("Create task with whitespaces only", async ({ ctx }) => {
        const taskName = "     "
        await test.step("Attempt tp create task", async () => {
            await ctx.dsl.pageObjects.todoPage.createTask(taskName)
        })
        await test.step("Verify task was NOT created", async () => {
            const task = await ctx.dsl.pageObjects.todoPage.getTask(taskName)
            await expect(task).not.toBeVisible()
        })
    })

    test("Create task with special characters only", async ({ ctx }) => {
        const taskName = ".,!@#$#%^&*()_+-=<>?`~:\"{}\\[]êÿÈ"
        await test.step("Attempt tp create task", async () => {
            await ctx.dsl.pageObjects.todoPage.createTask(taskName)
        })
        await test.step("Verify task was created", async () => {
            const task = await ctx.dsl.pageObjects.todoPage.getTask(taskName, false)
            await expect(task).toBeVisible()
        })
    })

    test("Create task with cyrillic letters", async ({ ctx }) => {
        const taskName = "Нова задача со кирилична поддршка"
        await test.step("Attempt tp create task", async () => {
            await ctx.dsl.pageObjects.todoPage.createTask(taskName)
        })
        await test.step("Verify task was created", async () => {
            const task = await ctx.dsl.pageObjects.todoPage.getTask(taskName)
            await expect(task).toBeVisible()
        })
    })
})

test.describe("Task completion and filtering", () => {
    test("Mark a task as completed", async ({ ctx }) => {
        await ctx.dsl.pageObjects.todoPage.replaceDefaultTasks()
        await ctx.page.reload()
        await test.step("Pick a random task", async () => {
            let task: Locator
            let taskName = ""
            await test.step("Pick a random task", async () => {
                task = await ctx.dsl.pageObjects.todoPage.getTask()
                taskName = await task.textContent() ?? ""
            })
            await test.step(`Complete task '${taskName}'`, async () => {
                await ctx.dsl.pageObjects.todoPage.completeTask(taskName)
            })
            await test.step("Verify task is marked as completed", async () => {
                await ctx.dsl.pageObjects.todoPage.isCompleted(taskName)
            })
            await test.step("Filter by Active tasks and verify completed task is NOT listed", async () => {
                await ctx.dsl.pageObjects.todoPage.filterTasks("Active")
                const taskCount = await ctx.dsl.pageObjects.todoPage.getTaskCount() as number
                for (let i = 0; i < taskCount; i++) {
                    await ctx.dsl.pageObjects.todoPage.isActive(i)
                }
                task = await ctx.dsl.pageObjects.todoPage.getTask(taskName)
                await expect(task).toHaveCount(0)
            }) 
            await test.step("Filter by Completed tasks and verify completed task is listed", async () => {
                await ctx.dsl.pageObjects.todoPage.filterTasks("Completed")
                const taskCount = await ctx.dsl.pageObjects.todoPage.getTaskCount() as number
                await expect(task).toBeVisible()
            })
        })
    })

    test("Mark all tasks as completed", async ({ ctx }) => {
        await ctx.dsl.pageObjects.todoPage.replaceDefaultTasks()
        await ctx.page.reload()
        await test.step("Pick a random task", async () => {
            let task: Locator
            let taskName = ""
            await test.step("Pick a random task", async () => {
                task = await ctx.dsl.pageObjects.todoPage.getTask()
                taskName = await task.textContent() ?? ""
            })
            await test.step(`Complete task '${taskName}'`, async () => {
                await ctx.dsl.pageObjects.todoPage.completeAllTasks()
            })
            await test.step("Verify all task are marked as completed", async () => {
                const taskCount = await ctx.dsl.pageObjects.todoPage.getTaskCount() as number
                for (let i = 0; i < taskCount; i++) {
                    await ctx.dsl.pageObjects.todoPage.isCompleted(i)
                }
            })
        })
    })
    
})
test("", async ({ ctx }) => {
    await test.step("", async () => { })
})
