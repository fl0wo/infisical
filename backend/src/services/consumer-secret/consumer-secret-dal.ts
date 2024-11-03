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
      const x = (await (tx || db)(TableName.ConsumerSecret).insert(data).returning("*")) as TConsumerSecrets[];
      if (Array.isArray(x) && x.length > 0) {
        return x[0];
      }
      // todo: this sucks, fix it
      return x as unknown as TConsumerSecrets;
    } catch (error) {
      throw new DatabaseError({ error, name: "create secret" });
    }
  };

  const listByOrganizationId = async (organizationId: string) => {
    try {
      const secrets = await db(TableName.ConsumerSecret).where({ organizationId });
      return secrets as TConsumerSecrets[];
    } catch (error) {
      throw new DatabaseError({ error, name: "list secrets by organization id" });
    }
  };

  const deleteByConsumerSecretId = async (id: string) => {
    try {
      return await db(TableName.ConsumerSecret).where({ id }).delete();
    } catch (error) {
      throw new DatabaseError({ error, name: "delete secrets by id" });
    }
  };

  const getByConsumerSecretId = async (id: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const x = await db(TableName.ConsumerSecret).where({ id }).first();
      return x as unknown as TConsumerSecrets;
    } catch (error) {
      throw new DatabaseError({ error, name: "get secrets by id" });
    }
  };

  return {
    ...secretOrm,
    create,
    listByOrganizationId,
    deleteByConsumerSecretId,
    getByConsumerSecretId
  };
};
