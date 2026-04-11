import { PgSelect } from "drizzle-orm/pg-core";

export function withPagination<T extends PgSelect>(query: T, page: number, pageSize: number) {
    return query.limit(pageSize).offset((page - 1) * pageSize);

}