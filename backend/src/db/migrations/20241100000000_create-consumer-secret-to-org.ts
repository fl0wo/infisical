import { Knex } from "knex";

import { TableName } from "../schemas";

export async function up(knex: Knex): Promise<void> {
  // create new table "consumer_secret"
  // with columns: id, createdByUserId, organizationId, encryptedValue, encryptedComment, name, type
  await knex.schema.createTable(TableName.ConsumerSecret, (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("createdByUserId").notNullable();
    t.uuid("organizationId").notNullable();
    t.text("encryptedValue").notNullable();
    t.text("encryptedComment").nullable();
    t.text("name").notNullable();
    t.text("type").notNullable();
    t.timestamp("createdAt").defaultTo(knex.fn.now());
    t.timestamp("updatedAt").defaultTo(knex.fn.now());

    t.foreign("createdByUserId").references("id").inTable(TableName.Users).onDelete("CASCADE");
    t.foreign("organizationId").references("id").inTable(TableName.Organization).onDelete("CASCADE");
  });

  // // create index on organizationId
  // await knex.schema.alterTable(TableName.ConsumerSecret, (t) => {
  //     t.index("organizationId");
  // });
  //
  // // create index on name
  // await knex.schema.alterTable(TableName.ConsumerSecret, (t) => {
  //     t.index("name");
  // });
}

export async function down(knex: Knex): Promise<void> {
  // drop tables in reverse order
  await knex.schema.dropTable(TableName.ConsumerSecret);
}
