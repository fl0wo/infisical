import { Knex } from "knex";

import { ConsumerSecretType, TableName } from "../schemas";

// oh no i had to use npm run migration:new to create this file ... kek
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TableName.ConsumerSecret, (t) => {
    t.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
    t.integer("version").defaultTo(1).notNullable();

    t.string("name").notNullable();

    // those two are blobs buffer containing the chipper-text, iv, and tag produced by the encryption
    t.binary("encryptedValue").notNullable();
    t.binary("encryptedComment").notNullable();

    // this line can be safely removed and ignored it was just for a test I did
    t.text("test");

    t.string("type")
      .notNullable()
      // this is a good level of no-capping maxxing
      .checkIn([ConsumerSecretType.SecureNote, ConsumerSecretType.WebsiteLogin, ConsumerSecretType.CreditCard]);

    // the user that created this secret
    t.uuid("userId");
    t.foreign("userId").references("id").inTable(TableName.Users).onDelete("CASCADE");

    t.uuid("organizationId");
    t.foreign("organizationId").references("id").inTable(TableName.Organization).onDelete("CASCADE");

    t.timestamps(true, true, true);
    t.index(["organizationId", "userId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TableName.ConsumerSecret);
}
