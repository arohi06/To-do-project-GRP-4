
exports.up = async function (knex) {

    // 1. Store approved AI-generated subtasks
    await knex.schema.createTable('task_subtasks', function (table) {

        table.uuid('id')
            .primary()
            .defaultTo(knex.raw('gen_random_uuid()'));

        table.uuid('task_id')
            .notNullable()
            .references('id')
            .inTable('tasks')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        table.string('title', 255).notNullable();

        table.text('description').nullable();

        table.enu('status', ['pending', 'completed'])
            .notNullable()
            .defaultTo('pending');

        table.integer('position')
            .notNullable()
            .defaultTo(0);

        table.integer('estimated_minutes').nullable();
        table.check(
            'estimated_minutes IS NULL OR estimated_minutes > 0',
            [],
            'task_subtasks_estimated_minutes_check'
        );

        table.text('completion_criteria').nullable();

        table.jsonb('resources')
            .notNullable()
            .defaultTo(knex.raw("'[]'::jsonb"));

        table.timestamp('created_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());

        table.timestamp('updated_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());

        table.index('task_id');
        table.index('status');
    });


    // 2. Store user personalization preferences
    await knex.schema.createTable('user_ai_preferences', function (table) {

        table.uuid('id')
            .primary()
            .defaultTo(knex.raw('gen_random_uuid()'));

        table.uuid('user_id')
            .notNullable()
            .unique()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');

        table.jsonb('skill_levels')
            .notNullable()
            .defaultTo(knex.raw("'{}'::jsonb"));

        table.jsonb('learning_preferences')
            .notNullable()
            .defaultTo(knex.raw("'{}'::jsonb"));

        table.jsonb('general_preferences')
            .notNullable()
            .defaultTo(knex.raw("'{}'::jsonb"));

        table.timestamp('created_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());

        table.timestamp('updated_at', { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());
    });

};


exports.down = async function (knex) {

    await knex.schema.dropTableIfExists('user_ai_preferences');

    await knex.schema.dropTableIfExists('task_subtasks');

};
