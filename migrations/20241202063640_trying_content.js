/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async (knex) => {
    // Create users table
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable().unique();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
    });
  
    // Create stories table
    await knex.schema.createTable('stories', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('content').notNullable();
      table.integer('creator_user_id').references('id').inTable('users');
    });
  
    // Create parts table
    await knex.schema.createTable('parts', (table) => {
      table.increments('id').primary();
      table.integer('story_id').references('id').inTable('stories');
      table.string('title').notNullable();
      table.text('content').notNullable();
      table.integer('writer_user_id').references('id').inTable('users');
      table.integer('likes_count').defaultTo(0);
      table.integer('cumulative_likes').defaultTo(0);
    });
  
    // Create part_branches table
    await knex.schema.createTable('part_branches', (table) => {
      table.integer('part_id').references('id').inTable('parts');
      table.integer('next_part_id').references('id').inTable('parts');
      table.primary(['part_id', 'next_part_id']);
    });
  
    // Create comments table
    await knex.schema.createTable('comments', (table) => {
      table.increments('id').primary();
      table.integer('part_id').references('id').inTable('parts');
      table.integer('user_id').references('id').inTable('users');
      table.text('content').notNullable();
      table.integer('parent_id').references('id').inTable('comments');
      table.integer('likes_count').defaultTo(0);
    });
  
    // Create part_likes table
    await knex.schema.createTable('part_likes', (table) => {
      table.increments('id').primary();
      table.integer('part_id').references('id').inTable('parts');
      table.integer('user_id').references('id').inTable('users');
    });
  
    // Create comment_likes table
    await knex.schema.createTable('comment_likes', (table) => {
      table.increments('id').primary();
      table.integer('comment_id').references('id').inTable('comments');
      table.integer('user_id').references('id').inTable('users');
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = async (knex) => {
    await knex.schema.dropTable('comment_likes');
    await knex.schema.dropTable('part_likes');
    await knex.schema.dropTable('comments');
    await knex.schema.dropTable('part_branches');
    await knex.schema.dropTable('parts');
    await knex.schema.dropTable('stories');
    await knex.schema.dropTable('users');
  };
  