    import { defineConfig } from '@mikro-orm/mongodb';
    import { Todo } from "./todos/entities/todos.entities";

    export default defineConfig({
        entities: [Todo],
        dbName: "intern-db",
        clientUrl: "mongodb://dbadmin:Ad2ubCq8ScsF7crt@118.70.109.40:29017/?authSource=admin",
        ensureIndexes: true,
    });