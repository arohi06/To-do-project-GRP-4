
exports.up = function (knex) {
  return knex.schema.createTable('tasks', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.string('title', 255).notNullable();

    table.text('description').nullable();

    table.enu('status', ['pending', 'completed'])
      .notNullable()
      .defaultTo('pending');

    table.enu('priority', ['low', 'medium', 'high'])
      .notNullable()
      .defaultTo('medium');

    table.timestamp('due_date', { useTz: true }).nullable();

    table.timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('status');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tasks');
};
