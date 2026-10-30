import { Context, expect } from '../../core/context'
import { randomInt } from 'node:crypto'
import { predefinedTasks } from '../../data/predefinedList'

class ToDoPage {
    ctx: Context
    constructor(ctx: Context) {
        this.ctx = ctx
    }

    readonly selectors = {
        newTaskInput: "header .new-todo",
        taskList: ".main .todo-list",
        taskItems: ".main .todo-list > li",
        toggleButton: ".view input.toggle",
        toggleAllButton: "label[for='toggle-all']",
        removeButton: ".view button.destroy",
        taskText: ".view label",
        completedTasks: ".main li.completed",
        taskCountText: ".footer .todo-count strong",
        clearCompletedButton: ".footer button.clear-completed"
    }

    async createTask(description: string) {
        const addInput = this.ctx.page.locator(this.selectors.newTaskInput)
        await addInput.fill(description)
        await addInput.press("Enter")
    }

    async filterTasks(criteria: "All" | "Active" | "Completed" = "All") {
        const filterButton = this.ctx.page.getByRole("link", {name:criteria});
        await filterButton.click()
    }

    async getTaskCount(asNumber = true) {
        const countText = this.ctx.page.locator(this.selectors.taskCountText)
        const rawCount = await countText.textContent() ?? "0"
        return asNumber ? parseInt(rawCount) : rawCount
    }

    /** Returns the task item based on specified text or index. Picks random if nothing is specified */
    async getTask(indexOrText: number | string | undefined = undefined, exactMatch = true) {
        const count = await this.getTaskCount() as number;
        if (count < 1) {
            throw new Error("Task list is empty");
        }
        indexOrText = indexOrText ?? randomInt(count)
        const exact = new RegExp(`^${indexOrText}$`)
        const task = typeof indexOrText === "number"
            ? this.ctx.page.locator(this.selectors.taskItems).nth(indexOrText)
            : this.ctx.page.locator(this.selectors.taskItems).filter({ hasText: exactMatch ? exact : indexOrText })
        // : this.ctx.page.locator(this.selectors.taskList).getByText(indexOrText, {exact: true}).first()
        return task
    }

    async completeTask(indexOrText: number | string | undefined = undefined) {
        const taskItem = await this.getTask(indexOrText)
        await taskItem.locator(this.selectors.toggleButton).click()
    }

    async removeTask(indexOrText: number | string | undefined = undefined) {
        const taskItem = await this.getTask(indexOrText)
        await taskItem.hover();
        await taskItem.locator(this.selectors.removeButton).click()
    }

    async editTask(description: string, indexOrText: number | string | undefined = undefined) {
        let taskItem = await this.getTask(indexOrText)
        const label = taskItem.locator(this.ctx.dsl.pageObjects.todoPage.selectors.taskText);
        await label.dblclick()
        let editInput = taskItem.locator("input.edit");
        await editInput.fill(description)
        await editInput.press("Enter")
    }

    async clearCompletedTasks() {
        const clearButton = this.ctx.page.locator(this.selectors.clearCompletedButton);
        await clearButton.click();
    }

    async replaceDefaultTasks() {
        await this.ctx.page.localStorage.setItem('todos-vanillajs', JSON.stringify(predefinedTasks))
        return predefinedTasks
    }

    async isCompleted(indexOrText: number | string | undefined = undefined) {
        const taskItem = await this.getTask(indexOrText)
        const label = taskItem.locator("label")
        expect(await taskItem.getAttribute("class")).toEqual("completed")
        await expect(label).toHaveCSS("color", "rgb(205, 205, 205)")
    }

    async isActive(indexOrText: number | string | undefined = undefined) {
        const taskItem = await this.getTask(indexOrText)
        const label = taskItem.locator("label")
        expect(await taskItem.getAttribute("class")).not.toEqual("completed")
        await expect(label).toHaveCSS("color", "rgb(77, 77, 77)")
    }

    async completeAllTasks() {
        const completeAllButton = this.ctx.page.locator(this.selectors.toggleAllButton)
        await completeAllButton.click()
    }

    async goto() {
        await this.ctx.page.goto("http://localhost:8080/todo")
    }
}

export { ToDoPage }