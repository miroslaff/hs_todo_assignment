import { randomInt, randomUUID } from "node:crypto";

export class Helpers {
    randomString() {
        return `${Date.now()}_${randomInt(99999)}`
    }

    uuid() {
        return randomUUID()
    }
}

