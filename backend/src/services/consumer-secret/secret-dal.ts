import { TDbClient } from "@app/db";
import { TableName } from "@app/db/schemas";
import { ormify } from "@app/lib/knex";

export type TConsumerSecretDALFactory = ReturnType<typeof consumerSecretDALFactory>;

// First of all generate the schema, then come here and you'll have the types ready
export const consumerSecretDALFactory = (db: TDbClient) => {
  const secretOrm = ormify(db, TableName.Secret);

  // TODO: actually implement the queries to DB

  // const update = async (filter: Partial<TSecrets>, data: Omit<TSecretsUpdate, "version">, tx?: Knex) => {
  //   try {
  //     const sec = await (tx || db)(TableName.Secret).where(filter).update(data).increment("version", 1).returning("*");
  //     return sec;
  //   } catch (error) {
  //     throw new DatabaseError({ error, name: "update secret" });
  //   }
  // };

  return {
    ...secretOrm
  };
};
