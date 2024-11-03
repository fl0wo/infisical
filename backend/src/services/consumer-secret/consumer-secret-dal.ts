import { Knex } from "knex";

import { TDbClient } from "@app/db";
import { TableName } from "@app/db/schemas";
import { TConsumerSecrets, TConsumerSecretsInsert } from "@app/db/schemas/consumer-secrets";
import { DatabaseError } from "@app/lib/errors";
import { ormify } from "@app/lib/knex";

export type TConsumerSecretDALFactory = ReturnType<typeof consumerSecretDALFactory>;

export const consumerSecretDALFactory = (db: TDbClient) => {
  // @ts-expect-error - not sure why TableName.ConsumerSecret is not accepted as type
  const secretOrm = ormify(db, TableName.ConsumerSecret);

  const create = async (data: Omit<TConsumerSecretsInsert, "version">, tx?: Knex) => {
    try {
      console.log("Want to insert in consumer secret", data);
      const x = await (tx || db)(TableName.ConsumerSecret).insert(data).returning("*");
      return x as TConsumerSecrets[];
    } catch (error) {
      throw new DatabaseError({ error, name: "create secret" });
    }
  };

  return {
    ...secretOrm,
    create
  };
};
