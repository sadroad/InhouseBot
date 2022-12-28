/**
 * Client
 */

import * as runtime from ".././runtime/index.d.ts";
declare const prisma: unique symbol;
export type PrismaPromise<A> = Promise<A> & { [prisma]: true };
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P;
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}`
    ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]>
    : UnwrapPromise<Tuple[K]>;
};

/**
 * Model ServerInformation
 */
export type ServerInformation = {
  id: number;
  queue_channel: bigint;
  command_channel: bigint;
  top_emoji: string;
  jungle_emoji: string;
  middle_emoji: string;
  bottom_emoji: string;
  support_emoji: string;
};

/**
 * Model Player
 */
export type Player = {
  id: number;
  discord_id: bigint;
  mu: number;
  sigma: number;
};

/**
 * Model Account
 */
export type Account = {
  id: number;
  puuid: string;
  player_id: bigint;
};

/**
 * Model Game
 */
export type Game = {
  id: number;
  winner: boolean;
};

/**
 * Model Game_Player
 */
export type Game_Player = {
  id: number;
  game_id: number;
  role: string;
  blue_side: boolean;
  player_id: bigint;
};

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ServerInformations
 * const serverInformations = await prisma.serverInformation.findMany()
 * ```
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = "log" extends keyof T
    ? T["log"] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<T["log"]>
    : never
    : never,
  GlobalReject extends
    | Prisma.RejectOnNotFound
    | Prisma.RejectPerOperation
    | false
    | undefined = "rejectOnNotFound" extends keyof T ? T["rejectOnNotFound"]
      : false,
> {
  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ServerInformations
   * const serverInformations = await prisma.serverInformation.findMany()
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | "beforeExit")>(
    eventType: V,
    callback: (
      event: V extends "query" ? Prisma.QueryEvent
        : V extends "beforeExit" ? () => Promise<void>
        : Prisma.LogEvent,
    ) => void,
  ): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): Promise<UnwrapTuple<P>>;

  $transaction<R>(
    fn: (prisma: Prisma.TransactionClient) => Promise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): Promise<R>;

  /**
   * `prisma.serverInformation`: Exposes CRUD operations for the **ServerInformation** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more ServerInformations
   * const serverInformations = await prisma.serverInformation.findMany()
   * ```
   */
  get serverInformation(): Prisma.ServerInformationDelegate<GlobalReject>;

  /**
   * `prisma.player`: Exposes CRUD operations for the **Player** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Players
   * const players = await prisma.player.findMany()
   * ```
   */
  get player(): Prisma.PlayerDelegate<GlobalReject>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   */
  get account(): Prisma.AccountDelegate<GlobalReject>;

  /**
   * `prisma.game`: Exposes CRUD operations for the **Game** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Games
   * const games = await prisma.game.findMany()
   * ```
   */
  get game(): Prisma.GameDelegate<GlobalReject>;

  /**
   * `prisma.game_Player`: Exposes CRUD operations for the **Game_Player** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Game_Players
   * const game_Players = await prisma.game_Player.findMany()
   * ```
   */
  get game_Player(): Prisma.Game_PlayerDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;
  export import NotFoundError = runtime.NotFoundError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Prisma Client JS version: 4.7.1
   * Query Engine version: 272861e07ab64f234d3ffc4094e32bd61775599c
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from.
   */
  export type JsonObject = { [Key in string]?: JsonValue };

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue =
    | string
    | number
    | boolean
    | JsonObject
    | JsonArray
    | null;

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {
    readonly [Key in string]?: InputJsonValue | null;
  };

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray
    extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue =
    | string
    | number
    | boolean
    | InputJsonObject
    | InputJsonArray;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };
  type HasSelect = {
    select: any;
  };
  type HasInclude = {
    include: any;
  };
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? "Please either choose `select` or `include`"
    : T extends HasSelect ? U
    : T extends HasInclude ? U
    : S;

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends
    PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> =
    PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> =
    & {
      [key in keyof T]: key extends keyof U ? T[key] : never;
    }
    & (T extends SelectAndInclude
      ? "Please either choose `select` or `include`."
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> =
    & {
      [key in keyof T]: key extends keyof U ? T[key] : never;
    }
    & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T)
    : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any> ? False
    : T extends Date ? False
    : T extends Uint8Array ? False
    : T extends BigInt ? False
    : T extends object ? True
    : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> =
    & Omit<O, K>
    & {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean,
  > = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> =
    & {
      [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
    }
    & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> =
    & {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
    }
    & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> =
    {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
    }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A
    : 
      & {
        [K in keyof A]: A[K];
      }
      & {};

  export type OptionalFlat<O> =
    & {
      [K in keyof O]?: O[K];
    }
    & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown ? 
        | (K extends keyof O ? { [P in K]: O[P] } & O : O)
        | { [P in keyof O as P extends K ? K : never]-?: O[P] } & O
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 // anything `never` is false
    : A1 extends A2 ? 1
    : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Exact<A, W = unknown> = W extends unknown
    ? A extends Narrowable ? Cast<A, W> : Cast<
      { [K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never },
      { [K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K] }
    >
    : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
      [P in keyof T]: P extends keyof O ? O[P]
        : never;
    }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, "_avg" | "_sum" | "_count" | "_min" | "_max">,
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<"OR", K>, Extends<"AND", K>>,
      Extends<"NOT", K>
    > extends True
      // infer is only needed to not hit TS limit
      // based on the brilliant idea of Pierre-Antoine Mills
      // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
      ? T[K] extends infer TK ? GetHavingFields<
          UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
        >
      : never
      : {} extends FieldPaths<T[K]> ? never
      : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<
    T,
    TupleToUnion<K>
  >;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never
    : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never ? never
    : FieldRef<Model, FieldType>;

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(
      prisma: PrismaClient<any, any>,
      debug?: boolean,
      hooks?: Hooks | undefined,
    );
    request<T>(
      document: any,
      dataPath?: string[],
      rootField?: string,
      typeName?: string,
      isList?: boolean,
      callsite?: string,
    ): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(
      document: any,
      data: any,
      path: string[],
      rootField?: string,
      isList?: boolean,
    ): any;
  }

  export const ModelName: {
    ServerInformation: "ServerInformation";
    Player: "Player";
    Account: "Account";
    Game: "Game";
    Game_Player: "Game_Player";
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  export type RejectOnNotFound = boolean | ((error: Error) => Error);
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound };
  export type RejectPerOperation = {
    [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound;
  };
  type IsReject<T> = T extends true ? True
    : T extends (err: Error) => Error ? True
    : False;
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions["rejectOnNotFound"],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName,
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
      ? Action extends keyof GlobalRejectSettings
        ? GlobalRejectSettings[Action] extends RejectOnNotFound
          ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
          ? Model extends keyof GlobalRejectSettings[Action]
            ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>;
  export type ErrorFormat = "pretty" | "colorless" | "minimal";

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null.
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>;
  }

  export type Hooks = {
    beforeRequest?: (
      options: {
        query: string;
        path: string[];
        rootField?: string;
        typeName?: string;
        document: any;
      },
    ) => any;
  };

  /* Types for Logging */
  export type LogLevel = "info" | "query" | "warn" | "error";
  export type LogDefinition = {
    level: LogLevel;
    emit: "stdout" | "event";
  };

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends
    LogDefinition ? T["emit"] extends "event" ? T["level"] : never : never;
  export type GetEvents<T extends any> = T extends
    Array<LogLevel | LogDefinition>
    ? GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | "findUnique"
    | "findMany"
    | "findFirst"
    | "create"
    | "createMany"
    | "update"
    | "updateMany"
    | "upsert"
    | "delete"
    | "deleteMany"
    | "executeRaw"
    | "queryRaw"
    | "aggregate"
    | "count"
    | "runCommandRaw"
    | "findRaw";

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName;
    action: PrismaAction;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
  };

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>;

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>,
  ): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
  >;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type PlayerCountOutputType
   */

  export type PlayerCountOutputType = {
    accounts: number;
    games: number;
  };

  export type PlayerCountOutputTypeSelect = {
    accounts?: boolean;
    games?: boolean;
  };

  export type PlayerCountOutputTypeGetPayload<
    S extends boolean | null | undefined | PlayerCountOutputTypeArgs,
  > = S extends { select: any; include: any }
    ? "Please either choose `select` or `include`"
    : S extends true ? PlayerCountOutputType
    : S extends undefined ? never
    : S extends { include: any } & (PlayerCountOutputTypeArgs)
      ? PlayerCountOutputType
    : S extends { select: any } & (PlayerCountOutputTypeArgs) ? {
        [P in TruthyKeys<S["select"]>]: P extends keyof PlayerCountOutputType
          ? PlayerCountOutputType[P]
          : never;
      }
    : PlayerCountOutputType;

  // Custom InputTypes

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the PlayerCountOutputType
     */
    select?: PlayerCountOutputTypeSelect | null;
  };

  /**
   * Count Type GameCountOutputType
   */

  export type GameCountOutputType = {
    players: number;
  };

  export type GameCountOutputTypeSelect = {
    players?: boolean;
  };

  export type GameCountOutputTypeGetPayload<
    S extends boolean | null | undefined | GameCountOutputTypeArgs,
  > = S extends { select: any; include: any }
    ? "Please either choose `select` or `include`"
    : S extends true ? GameCountOutputType
    : S extends undefined ? never
    : S extends { include: any } & (GameCountOutputTypeArgs)
      ? GameCountOutputType
    : S extends { select: any } & (GameCountOutputTypeArgs) ? {
        [P in TruthyKeys<S["select"]>]: P extends keyof GameCountOutputType
          ? GameCountOutputType[P]
          : never;
      }
    : GameCountOutputType;

  // Custom InputTypes

  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the GameCountOutputType
     */
    select?: GameCountOutputTypeSelect | null;
  };

  /**
   * Models
   */

  /**
   * Model ServerInformation
   */

  export type AggregateServerInformation = {
    _count: ServerInformationCountAggregateOutputType | null;
    _avg: ServerInformationAvgAggregateOutputType | null;
    _sum: ServerInformationSumAggregateOutputType | null;
    _min: ServerInformationMinAggregateOutputType | null;
    _max: ServerInformationMaxAggregateOutputType | null;
  };

  export type ServerInformationAvgAggregateOutputType = {
    id: number | null;
    queue_channel: number | null;
    command_channel: number | null;
  };

  export type ServerInformationSumAggregateOutputType = {
    id: number | null;
    queue_channel: bigint | null;
    command_channel: bigint | null;
  };

  export type ServerInformationMinAggregateOutputType = {
    id: number | null;
    queue_channel: bigint | null;
    command_channel: bigint | null;
    top_emoji: string | null;
    jungle_emoji: string | null;
    middle_emoji: string | null;
    bottom_emoji: string | null;
    support_emoji: string | null;
  };

  export type ServerInformationMaxAggregateOutputType = {
    id: number | null;
    queue_channel: bigint | null;
    command_channel: bigint | null;
    top_emoji: string | null;
    jungle_emoji: string | null;
    middle_emoji: string | null;
    bottom_emoji: string | null;
    support_emoji: string | null;
  };

  export type ServerInformationCountAggregateOutputType = {
    id: number;
    queue_channel: number;
    command_channel: number;
    top_emoji: number;
    jungle_emoji: number;
    middle_emoji: number;
    bottom_emoji: number;
    support_emoji: number;
    _all: number;
  };

  export type ServerInformationAvgAggregateInputType = {
    id?: true;
    queue_channel?: true;
    command_channel?: true;
  };

  export type ServerInformationSumAggregateInputType = {
    id?: true;
    queue_channel?: true;
    command_channel?: true;
  };

  export type ServerInformationMinAggregateInputType = {
    id?: true;
    queue_channel?: true;
    command_channel?: true;
    top_emoji?: true;
    jungle_emoji?: true;
    middle_emoji?: true;
    bottom_emoji?: true;
    support_emoji?: true;
  };

  export type ServerInformationMaxAggregateInputType = {
    id?: true;
    queue_channel?: true;
    command_channel?: true;
    top_emoji?: true;
    jungle_emoji?: true;
    middle_emoji?: true;
    bottom_emoji?: true;
    support_emoji?: true;
  };

  export type ServerInformationCountAggregateInputType = {
    id?: true;
    queue_channel?: true;
    command_channel?: true;
    top_emoji?: true;
    jungle_emoji?: true;
    middle_emoji?: true;
    bottom_emoji?: true;
    support_emoji?: true;
    _all?: true;
  };

  export type ServerInformationAggregateArgs = {
    /**
     * Filter which ServerInformation to aggregate.
     */
    where?: ServerInformationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ServerInformations to fetch.
     */
    orderBy?: Enumerable<ServerInformationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ServerInformationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ServerInformations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ServerInformations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ServerInformations
     */
    _count?: true | ServerInformationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     */
    _avg?: ServerInformationAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     */
    _sum?: ServerInformationSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: ServerInformationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: ServerInformationMaxAggregateInputType;
  };

  export type GetServerInformationAggregateType<
    T extends ServerInformationAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateServerInformation]: P extends
      "_count" | "count" ? T[P] extends true ? number
      : GetScalarType<T[P], AggregateServerInformation[P]>
      : GetScalarType<T[P], AggregateServerInformation[P]>;
  };

  export type ServerInformationGroupByArgs = {
    where?: ServerInformationWhereInput;
    orderBy?: Enumerable<ServerInformationOrderByWithAggregationInput>;
    by: Array<ServerInformationScalarFieldEnum>;
    having?: ServerInformationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ServerInformationCountAggregateInputType | true;
    _avg?: ServerInformationAvgAggregateInputType;
    _sum?: ServerInformationSumAggregateInputType;
    _min?: ServerInformationMinAggregateInputType;
    _max?: ServerInformationMaxAggregateInputType;
  };

  export type ServerInformationGroupByOutputType = {
    id: number;
    queue_channel: bigint;
    command_channel: bigint;
    top_emoji: string;
    jungle_emoji: string;
    middle_emoji: string;
    bottom_emoji: string;
    support_emoji: string;
    _count: ServerInformationCountAggregateOutputType | null;
    _avg: ServerInformationAvgAggregateOutputType | null;
    _sum: ServerInformationSumAggregateOutputType | null;
    _min: ServerInformationMinAggregateOutputType | null;
    _max: ServerInformationMaxAggregateOutputType | null;
  };

  type GetServerInformationGroupByPayload<
    T extends ServerInformationGroupByArgs,
  > = PrismaPromise<
    Array<
      & PickArray<ServerInformationGroupByOutputType, T["by"]>
      & {
        [P in ((keyof T) & (keyof ServerInformationGroupByOutputType))]:
          P extends "_count" ? T[P] extends boolean ? number
            : GetScalarType<T[P], ServerInformationGroupByOutputType[P]>
            : GetScalarType<T[P], ServerInformationGroupByOutputType[P]>;
      }
    >
  >;

  export type ServerInformationSelect = {
    id?: boolean;
    queue_channel?: boolean;
    command_channel?: boolean;
    top_emoji?: boolean;
    jungle_emoji?: boolean;
    middle_emoji?: boolean;
    bottom_emoji?: boolean;
    support_emoji?: boolean;
  };

  export type ServerInformationGetPayload<
    S extends boolean | null | undefined | ServerInformationArgs,
  > = S extends { select: any; include: any }
    ? "Please either choose `select` or `include`"
    : S extends true ? ServerInformation
    : S extends undefined ? never
    : S extends
      { include: any } & (ServerInformationArgs | ServerInformationFindManyArgs)
      ? ServerInformation
    : S extends
      { select: any } & (ServerInformationArgs | ServerInformationFindManyArgs)
      ? {
        [P in TruthyKeys<S["select"]>]: P extends keyof ServerInformation
          ? ServerInformation[P]
          : never;
      }
    : ServerInformation;

  type ServerInformationCountArgs = Merge<
    Omit<ServerInformationFindManyArgs, "select" | "include"> & {
      select?: ServerInformationCountAggregateInputType | true;
    }
  >;

  export interface ServerInformationDelegate<
    GlobalRejectSettings extends
      | Prisma.RejectOnNotFound
      | Prisma.RejectPerOperation
      | false
      | undefined,
  > {
    /**
     * Find zero or one ServerInformation that matches the filter.
     * @param {ServerInformationFindUniqueArgs} args - Arguments to find a ServerInformation
     * @example
     * // Get one ServerInformation
     * const serverInformation = await prisma.serverInformation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<
      T extends ServerInformationFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, ServerInformationFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "ServerInformation"
    > extends True
      ? Prisma__ServerInformationClient<ServerInformationGetPayload<T>>
      : Prisma__ServerInformationClient<
        ServerInformationGetPayload<T> | null,
        null
      >;

    /**
     * Find one ServerInformation that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {ServerInformationFindUniqueOrThrowArgs} args - Arguments to find a ServerInformation
     * @example
     * // Get one ServerInformation
     * const serverInformation = await prisma.serverInformation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServerInformationFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ServerInformationFindUniqueOrThrowArgs>,
    ): Prisma__ServerInformationClient<ServerInformationGetPayload<T>>;

    /**
     * Find the first ServerInformation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerInformationFindFirstArgs} args - Arguments to find a ServerInformation
     * @example
     * // Get one ServerInformation
     * const serverInformation = await prisma.serverInformation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<
      T extends ServerInformationFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, ServerInformationFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "ServerInformation"
    > extends True
      ? Prisma__ServerInformationClient<ServerInformationGetPayload<T>>
      : Prisma__ServerInformationClient<
        ServerInformationGetPayload<T> | null,
        null
      >;

    /**
     * Find the first ServerInformation that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerInformationFindFirstOrThrowArgs} args - Arguments to find a ServerInformation
     * @example
     * // Get one ServerInformation
     * const serverInformation = await prisma.serverInformation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServerInformationFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ServerInformationFindFirstOrThrowArgs>,
    ): Prisma__ServerInformationClient<ServerInformationGetPayload<T>>;

    /**
     * Find zero or more ServerInformations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerInformationFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ServerInformations
     * const serverInformations = await prisma.serverInformation.findMany()
     *
     * // Get first 10 ServerInformations
     * const serverInformations = await prisma.serverInformation.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const serverInformationWithIdOnly = await prisma.serverInformation.findMany({ select: { id: true } })
     */
    findMany<T extends ServerInformationFindManyArgs>(
      args?: SelectSubset<T, ServerInformationFindManyArgs>,
    ): PrismaPromise<Array<ServerInformationGetPayload<T>>>;

    /**
     * Create a ServerInformation.
     * @param {ServerInformationCreateArgs} args - Arguments to create a ServerInformation.
     * @example
     * // Create one ServerInformation
     * const ServerInformation = await prisma.serverInformation.create({
     *   data: {
     *     // ... data to create a ServerInformation
     *   }
     * })
     */
    create<T extends ServerInformationCreateArgs>(
      args: SelectSubset<T, ServerInformationCreateArgs>,
    ): Prisma__ServerInformationClient<ServerInformationGetPayload<T>>;

    /**
     * Create many ServerInformations.
     *     @param {ServerInformationCreateManyArgs} args - Arguments to create many ServerInformations.
     *     @example
     *     // Create many ServerInformations
     *     const serverInformation = await prisma.serverInformation.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     */
    createMany<T extends ServerInformationCreateManyArgs>(
      args?: SelectSubset<T, ServerInformationCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a ServerInformation.
     * @param {ServerInformationDeleteArgs} args - Arguments to delete one ServerInformation.
     * @example
     * // Delete one ServerInformation
     * const ServerInformation = await prisma.serverInformation.delete({
     *   where: {
     *     // ... filter to delete one ServerInformation
     *   }
     * })
     */
    delete<T extends ServerInformationDeleteArgs>(
      args: SelectSubset<T, ServerInformationDeleteArgs>,
    ): Prisma__ServerInformationClient<ServerInformationGetPayload<T>>;

    /**
     * Update one ServerInformation.
     * @param {ServerInformationUpdateArgs} args - Arguments to update one ServerInformation.
     * @example
     * // Update one ServerInformation
     * const serverInformation = await prisma.serverInformation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     */
    update<T extends ServerInformationUpdateArgs>(
      args: SelectSubset<T, ServerInformationUpdateArgs>,
    ): Prisma__ServerInformationClient<ServerInformationGetPayload<T>>;

    /**
     * Delete zero or more ServerInformations.
     * @param {ServerInformationDeleteManyArgs} args - Arguments to filter ServerInformations to delete.
     * @example
     * // Delete a few ServerInformations
     * const { count } = await prisma.serverInformation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    deleteMany<T extends ServerInformationDeleteManyArgs>(
      args?: SelectSubset<T, ServerInformationDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more ServerInformations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerInformationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ServerInformations
     * const serverInformation = await prisma.serverInformation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     */
    updateMany<T extends ServerInformationUpdateManyArgs>(
      args: SelectSubset<T, ServerInformationUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one ServerInformation.
     * @param {ServerInformationUpsertArgs} args - Arguments to update or create a ServerInformation.
     * @example
     * // Update or create a ServerInformation
     * const serverInformation = await prisma.serverInformation.upsert({
     *   create: {
     *     // ... data to create a ServerInformation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ServerInformation we want to update
     *   }
     * })
     */
    upsert<T extends ServerInformationUpsertArgs>(
      args: SelectSubset<T, ServerInformationUpsertArgs>,
    ): Prisma__ServerInformationClient<ServerInformationGetPayload<T>>;

    /**
     * Count the number of ServerInformations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerInformationCountArgs} args - Arguments to filter ServerInformations to count.
     * @example
     * // Count the number of ServerInformations
     * const count = await prisma.serverInformation.count({
     *   where: {
     *     // ... the filter for the ServerInformations we want to count
     *   }
     * })
     */
    count<T extends ServerInformationCountArgs>(
      args?: Subset<T, ServerInformationCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any> ? T["select"] extends true ? number
        : GetScalarType<T["select"], ServerInformationCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a ServerInformation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerInformationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends ServerInformationAggregateArgs>(
      args: Subset<T, ServerInformationAggregateArgs>,
    ): PrismaPromise<GetServerInformationAggregateType<T>>;

    /**
     * Group by ServerInformation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerInformationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     */
    groupBy<
      T extends ServerInformationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServerInformationGroupByArgs["orderBy"] }
        : { orderBy?: ServerInformationGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False ? {
            [P in HavingFields]: P extends ByFields ? never
              : P extends string
                ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                Error,
                "Field ",
                P,
                ` in "having" needs to be provided in "by"`,
              ];
          }[HavingFields]
        : "take" extends Keys<T>
          ? "orderBy" extends Keys<T> ? ByValid extends True ? {}
            : {
              [P in OrderFields]: P extends ByFields ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
            }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
          ? "orderBy" extends Keys<T> ? ByValid extends True ? {}
            : {
              [P in OrderFields]: P extends ByFields ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
            }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True ? {}
        : {
          [P in OrderFields]: P extends ByFields ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
        }[OrderFields],
    >(
      args:
        & SubsetIntersection<T, ServerInformationGroupByArgs, OrderByArg>
        & InputErrors,
    ): {} extends InputErrors ? GetServerInformationGroupByPayload<T>
      : PrismaPromise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ServerInformation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ServerInformationClient<T, Null = never>
    implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * ServerInformation base type for findUnique actions
   */
  export type ServerInformationFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the ServerInformation
     */
    select?: ServerInformationSelect | null;
    /**
     * Filter, which ServerInformation to fetch.
     */
    where: ServerInformationWhereUniqueInput;
  };

  /**
   * ServerInformation: findUnique
   */
  export interface ServerInformationFindUniqueArgs
    extends ServerInformationFindUniqueArgsBase {
    /**
     * Throw an Error if query returns no results
     * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
     */
    rejectOnNotFound?: RejectOnNotFound;
  }

  /**
   * ServerInformation findUniqueOrThrow
   */
  export type ServerInformationFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the ServerInformation
     */
    select?: ServerInformationSelect | null;
    /**
     * Filter, which ServerInformation to fetch.
     */
    where: ServerInformationWhereUniqueInput;
  };

  /**
   * ServerInformation base type for findFirst actions
   */
  export type ServerInformationFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the ServerInformation
     */
    select?: ServerInformationSelect | null;
    /**
     * Filter, which ServerInformation to fetch.
     */
    where?: ServerInformationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ServerInformations to fetch.
     */
    orderBy?: Enumerable<ServerInformationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ServerInformations.
     */
    cursor?: ServerInformationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ServerInformations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ServerInformations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ServerInformations.
     */
    distinct?: Enumerable<ServerInformationScalarFieldEnum>;
  };

  /**
   * ServerInformation: findFirst
   */
  export interface ServerInformationFindFirstArgs
    extends ServerInformationFindFirstArgsBase {
    /**
     * Throw an Error if query returns no results
     * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
     */
    rejectOnNotFound?: RejectOnNotFound;
  }

  /**
   * ServerInformation findFirstOrThrow
   */
  export type ServerInformationFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the ServerInformation
     */
    select?: ServerInformationSelect | null;
    /**
     * Filter, which ServerInformation to fetch.
     */
    where?: ServerInformationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ServerInformations to fetch.
     */
    orderBy?: Enumerable<ServerInformationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ServerInformations.
     */
    cursor?: ServerInformationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ServerInformations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ServerInformations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ServerInformations.
     */
    distinct?: Enumerable<ServerInformationScalarFieldEnum>;
  };

  /**
   * ServerInformation findMany
   */
  export type ServerInformationFindManyArgs = {
    /**
     * Select specific fields to fetch from the ServerInformation
     */
    select?: ServerInformationSelect | null;
    /**
     * Filter, which ServerInformations to fetch.
     */
    where?: ServerInformationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ServerInformations to fetch.
     */
    orderBy?: Enumerable<ServerInformationOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ServerInformations.
     */
    cursor?: ServerInformationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ServerInformations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ServerInformations.
     */
    skip?: number;
    distinct?: Enumerable<ServerInformationScalarFieldEnum>;
  };

  /**
   * ServerInformation create
   */
  export type ServerInformationCreateArgs = {
    /**
     * Select specific fields to fetch from the ServerInformation
     */
    select?: ServerInformationSelect | null;
    /**
     * The data needed to create a ServerInformation.
     */
    data: XOR<
      ServerInformationCreateInput,
      ServerInformationUncheckedCreateInput
    >;
  };

  /**
   * ServerInformation createMany
   */
  export type ServerInformationCreateManyArgs = {
    /**
     * The data used to create many ServerInformations.
     */
    data: Enumerable<ServerInformationCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * ServerInformation update
   */
  export type ServerInformationUpdateArgs = {
    /**
     * Select specific fields to fetch from the ServerInformation
     */
    select?: ServerInformationSelect | null;
    /**
     * The data needed to update a ServerInformation.
     */
    data: XOR<
      ServerInformationUpdateInput,
      ServerInformationUncheckedUpdateInput
    >;
    /**
     * Choose, which ServerInformation to update.
     */
    where: ServerInformationWhereUniqueInput;
  };

  /**
   * ServerInformation updateMany
   */
  export type ServerInformationUpdateManyArgs = {
    /**
     * The data used to update ServerInformations.
     */
    data: XOR<
      ServerInformationUpdateManyMutationInput,
      ServerInformationUncheckedUpdateManyInput
    >;
    /**
     * Filter which ServerInformations to update
     */
    where?: ServerInformationWhereInput;
  };

  /**
   * ServerInformation upsert
   */
  export type ServerInformationUpsertArgs = {
    /**
     * Select specific fields to fetch from the ServerInformation
     */
    select?: ServerInformationSelect | null;
    /**
     * The filter to search for the ServerInformation to update in case it exists.
     */
    where: ServerInformationWhereUniqueInput;
    /**
     * In case the ServerInformation found by the `where` argument doesn't exist, create a new ServerInformation with this data.
     */
    create: XOR<
      ServerInformationCreateInput,
      ServerInformationUncheckedCreateInput
    >;
    /**
     * In case the ServerInformation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      ServerInformationUpdateInput,
      ServerInformationUncheckedUpdateInput
    >;
  };

  /**
   * ServerInformation delete
   */
  export type ServerInformationDeleteArgs = {
    /**
     * Select specific fields to fetch from the ServerInformation
     */
    select?: ServerInformationSelect | null;
    /**
     * Filter which ServerInformation to delete.
     */
    where: ServerInformationWhereUniqueInput;
  };

  /**
   * ServerInformation deleteMany
   */
  export type ServerInformationDeleteManyArgs = {
    /**
     * Filter which ServerInformations to delete
     */
    where?: ServerInformationWhereInput;
  };

  /**
   * ServerInformation without action
   */
  export type ServerInformationArgs = {
    /**
     * Select specific fields to fetch from the ServerInformation
     */
    select?: ServerInformationSelect | null;
  };

  /**
   * Model Player
   */

  export type AggregatePlayer = {
    _count: PlayerCountAggregateOutputType | null;
    _avg: PlayerAvgAggregateOutputType | null;
    _sum: PlayerSumAggregateOutputType | null;
    _min: PlayerMinAggregateOutputType | null;
    _max: PlayerMaxAggregateOutputType | null;
  };

  export type PlayerAvgAggregateOutputType = {
    id: number | null;
    discord_id: number | null;
    mu: number | null;
    sigma: number | null;
  };

  export type PlayerSumAggregateOutputType = {
    id: number | null;
    discord_id: bigint | null;
    mu: number | null;
    sigma: number | null;
  };

  export type PlayerMinAggregateOutputType = {
    id: number | null;
    discord_id: bigint | null;
    mu: number | null;
    sigma: number | null;
  };

  export type PlayerMaxAggregateOutputType = {
    id: number | null;
    discord_id: bigint | null;
    mu: number | null;
    sigma: number | null;
  };

  export type PlayerCountAggregateOutputType = {
    id: number;
    discord_id: number;
    mu: number;
    sigma: number;
    _all: number;
  };

  export type PlayerAvgAggregateInputType = {
    id?: true;
    discord_id?: true;
    mu?: true;
    sigma?: true;
  };

  export type PlayerSumAggregateInputType = {
    id?: true;
    discord_id?: true;
    mu?: true;
    sigma?: true;
  };

  export type PlayerMinAggregateInputType = {
    id?: true;
    discord_id?: true;
    mu?: true;
    sigma?: true;
  };

  export type PlayerMaxAggregateInputType = {
    id?: true;
    discord_id?: true;
    mu?: true;
    sigma?: true;
  };

  export type PlayerCountAggregateInputType = {
    id?: true;
    discord_id?: true;
    mu?: true;
    sigma?: true;
    _all?: true;
  };

  export type PlayerAggregateArgs = {
    /**
     * Filter which Player to aggregate.
     */
    where?: PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Players to fetch.
     */
    orderBy?: Enumerable<PlayerOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Players.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Players
     */
    _count?: true | PlayerCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     */
    _avg?: PlayerAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     */
    _sum?: PlayerSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: PlayerMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: PlayerMaxAggregateInputType;
  };

  export type GetPlayerAggregateType<T extends PlayerAggregateArgs> = {
    [P in keyof T & keyof AggregatePlayer]: P extends "_count" | "count"
      ? T[P] extends true ? number
      : GetScalarType<T[P], AggregatePlayer[P]>
      : GetScalarType<T[P], AggregatePlayer[P]>;
  };

  export type PlayerGroupByArgs = {
    where?: PlayerWhereInput;
    orderBy?: Enumerable<PlayerOrderByWithAggregationInput>;
    by: Array<PlayerScalarFieldEnum>;
    having?: PlayerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlayerCountAggregateInputType | true;
    _avg?: PlayerAvgAggregateInputType;
    _sum?: PlayerSumAggregateInputType;
    _min?: PlayerMinAggregateInputType;
    _max?: PlayerMaxAggregateInputType;
  };

  export type PlayerGroupByOutputType = {
    id: number;
    discord_id: bigint;
    mu: number;
    sigma: number;
    _count: PlayerCountAggregateOutputType | null;
    _avg: PlayerAvgAggregateOutputType | null;
    _sum: PlayerSumAggregateOutputType | null;
    _min: PlayerMinAggregateOutputType | null;
    _max: PlayerMaxAggregateOutputType | null;
  };

  type GetPlayerGroupByPayload<T extends PlayerGroupByArgs> = PrismaPromise<
    Array<
      & PickArray<PlayerGroupByOutputType, T["by"]>
      & {
        [P in ((keyof T) & (keyof PlayerGroupByOutputType))]: P extends "_count"
          ? T[P] extends boolean ? number
          : GetScalarType<T[P], PlayerGroupByOutputType[P]>
          : GetScalarType<T[P], PlayerGroupByOutputType[P]>;
      }
    >
  >;

  export type PlayerSelect = {
    id?: boolean;
    discord_id?: boolean;
    accounts?: boolean | AccountFindManyArgs;
    games?: boolean | Game_PlayerFindManyArgs;
    mu?: boolean;
    sigma?: boolean;
    _count?: boolean | PlayerCountOutputTypeArgs;
  };

  export type PlayerInclude = {
    accounts?: boolean | AccountFindManyArgs;
    games?: boolean | Game_PlayerFindManyArgs;
    _count?: boolean | PlayerCountOutputTypeArgs;
  };

  export type PlayerGetPayload<
    S extends boolean | null | undefined | PlayerArgs,
  > = S extends { select: any; include: any }
    ? "Please either choose `select` or `include`"
    : S extends true ? Player
    : S extends undefined ? never
    : S extends { include: any } & (PlayerArgs | PlayerFindManyArgs) ? 
        & Player
        & {
          [P in TruthyKeys<S["include"]>]: P extends "accounts"
            ? Array<AccountGetPayload<S["include"][P]>>
            : P extends "games" ? Array<Game_PlayerGetPayload<S["include"][P]>>
            : P extends "_count"
              ? PlayerCountOutputTypeGetPayload<S["include"][P]>
            : never;
        }
    : S extends { select: any } & (PlayerArgs | PlayerFindManyArgs) ? {
        [P in TruthyKeys<S["select"]>]: P extends "accounts"
          ? Array<AccountGetPayload<S["select"][P]>>
          : P extends "games" ? Array<Game_PlayerGetPayload<S["select"][P]>>
          : P extends "_count" ? PlayerCountOutputTypeGetPayload<S["select"][P]>
          : P extends keyof Player ? Player[P]
          : never;
      }
    : Player;

  type PlayerCountArgs = Merge<
    Omit<PlayerFindManyArgs, "select" | "include"> & {
      select?: PlayerCountAggregateInputType | true;
    }
  >;

  export interface PlayerDelegate<
    GlobalRejectSettings extends
      | Prisma.RejectOnNotFound
      | Prisma.RejectPerOperation
      | false
      | undefined,
  > {
    /**
     * Find zero or one Player that matches the filter.
     * @param {PlayerFindUniqueArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<
      T extends PlayerFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, PlayerFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "Player"
    > extends True ? Prisma__PlayerClient<PlayerGetPayload<T>>
      : Prisma__PlayerClient<PlayerGetPayload<T> | null, null>;

    /**
     * Find one Player that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {PlayerFindUniqueOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, PlayerFindUniqueOrThrowArgs>,
    ): Prisma__PlayerClient<PlayerGetPayload<T>>;

    /**
     * Find the first Player that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<
      T extends PlayerFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, PlayerFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "Player"
    > extends True ? Prisma__PlayerClient<PlayerGetPayload<T>>
      : Prisma__PlayerClient<PlayerGetPayload<T> | null, null>;

    /**
     * Find the first Player that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PlayerFindFirstOrThrowArgs>,
    ): Prisma__PlayerClient<PlayerGetPayload<T>>;

    /**
     * Find zero or more Players that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Players
     * const players = await prisma.player.findMany()
     *
     * // Get first 10 Players
     * const players = await prisma.player.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const playerWithIdOnly = await prisma.player.findMany({ select: { id: true } })
     */
    findMany<T extends PlayerFindManyArgs>(
      args?: SelectSubset<T, PlayerFindManyArgs>,
    ): PrismaPromise<Array<PlayerGetPayload<T>>>;

    /**
     * Create a Player.
     * @param {PlayerCreateArgs} args - Arguments to create a Player.
     * @example
     * // Create one Player
     * const Player = await prisma.player.create({
     *   data: {
     *     // ... data to create a Player
     *   }
     * })
     */
    create<T extends PlayerCreateArgs>(
      args: SelectSubset<T, PlayerCreateArgs>,
    ): Prisma__PlayerClient<PlayerGetPayload<T>>;

    /**
     * Create many Players.
     *     @param {PlayerCreateManyArgs} args - Arguments to create many Players.
     *     @example
     *     // Create many Players
     *     const player = await prisma.player.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     */
    createMany<T extends PlayerCreateManyArgs>(
      args?: SelectSubset<T, PlayerCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a Player.
     * @param {PlayerDeleteArgs} args - Arguments to delete one Player.
     * @example
     * // Delete one Player
     * const Player = await prisma.player.delete({
     *   where: {
     *     // ... filter to delete one Player
     *   }
     * })
     */
    delete<T extends PlayerDeleteArgs>(
      args: SelectSubset<T, PlayerDeleteArgs>,
    ): Prisma__PlayerClient<PlayerGetPayload<T>>;

    /**
     * Update one Player.
     * @param {PlayerUpdateArgs} args - Arguments to update one Player.
     * @example
     * // Update one Player
     * const player = await prisma.player.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     */
    update<T extends PlayerUpdateArgs>(
      args: SelectSubset<T, PlayerUpdateArgs>,
    ): Prisma__PlayerClient<PlayerGetPayload<T>>;

    /**
     * Delete zero or more Players.
     * @param {PlayerDeleteManyArgs} args - Arguments to filter Players to delete.
     * @example
     * // Delete a few Players
     * const { count } = await prisma.player.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    deleteMany<T extends PlayerDeleteManyArgs>(
      args?: SelectSubset<T, PlayerDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     */
    updateMany<T extends PlayerUpdateManyArgs>(
      args: SelectSubset<T, PlayerUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one Player.
     * @param {PlayerUpsertArgs} args - Arguments to update or create a Player.
     * @example
     * // Update or create a Player
     * const player = await prisma.player.upsert({
     *   create: {
     *     // ... data to create a Player
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player we want to update
     *   }
     * })
     */
    upsert<T extends PlayerUpsertArgs>(
      args: SelectSubset<T, PlayerUpsertArgs>,
    ): Prisma__PlayerClient<PlayerGetPayload<T>>;

    /**
     * Count the number of Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerCountArgs} args - Arguments to filter Players to count.
     * @example
     * // Count the number of Players
     * const count = await prisma.player.count({
     *   where: {
     *     // ... the filter for the Players we want to count
     *   }
     * })
     */
    count<T extends PlayerCountArgs>(
      args?: Subset<T, PlayerCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any> ? T["select"] extends true ? number
        : GetScalarType<T["select"], PlayerCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends PlayerAggregateArgs>(
      args: Subset<T, PlayerAggregateArgs>,
    ): PrismaPromise<GetPlayerAggregateType<T>>;

    /**
     * Group by Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     */
    groupBy<
      T extends PlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayerGroupByArgs["orderBy"] }
        : { orderBy?: PlayerGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False ? {
            [P in HavingFields]: P extends ByFields ? never
              : P extends string
                ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                Error,
                "Field ",
                P,
                ` in "having" needs to be provided in "by"`,
              ];
          }[HavingFields]
        : "take" extends Keys<T>
          ? "orderBy" extends Keys<T> ? ByValid extends True ? {}
            : {
              [P in OrderFields]: P extends ByFields ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
            }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
          ? "orderBy" extends Keys<T> ? ByValid extends True ? {}
            : {
              [P in OrderFields]: P extends ByFields ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
            }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True ? {}
        : {
          [P in OrderFields]: P extends ByFields ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
        }[OrderFields],
    >(
      args: SubsetIntersection<T, PlayerGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetPlayerGroupByPayload<T>
      : PrismaPromise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Player.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__PlayerClient<T, Null = never>
    implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    accounts<T extends AccountFindManyArgs = {}>(
      args?: Subset<T, AccountFindManyArgs>,
    ): PrismaPromise<Array<AccountGetPayload<T>> | Null>;

    games<T extends Game_PlayerFindManyArgs = {}>(
      args?: Subset<T, Game_PlayerFindManyArgs>,
    ): PrismaPromise<Array<Game_PlayerGetPayload<T>> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Player base type for findUnique actions
   */
  export type PlayerFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PlayerInclude | null;
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput;
  };

  /**
   * Player: findUnique
   */
  export interface PlayerFindUniqueArgs extends PlayerFindUniqueArgsBase {
    /**
     * Throw an Error if query returns no results
     * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
     */
    rejectOnNotFound?: RejectOnNotFound;
  }

  /**
   * Player findUniqueOrThrow
   */
  export type PlayerFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PlayerInclude | null;
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput;
  };

  /**
   * Player base type for findFirst actions
   */
  export type PlayerFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PlayerInclude | null;
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Players to fetch.
     */
    orderBy?: Enumerable<PlayerOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Players.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Players.
     */
    distinct?: Enumerable<PlayerScalarFieldEnum>;
  };

  /**
   * Player: findFirst
   */
  export interface PlayerFindFirstArgs extends PlayerFindFirstArgsBase {
    /**
     * Throw an Error if query returns no results
     * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
     */
    rejectOnNotFound?: RejectOnNotFound;
  }

  /**
   * Player findFirstOrThrow
   */
  export type PlayerFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PlayerInclude | null;
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Players to fetch.
     */
    orderBy?: Enumerable<PlayerOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Players.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Players.
     */
    distinct?: Enumerable<PlayerScalarFieldEnum>;
  };

  /**
   * Player findMany
   */
  export type PlayerFindManyArgs = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PlayerInclude | null;
    /**
     * Filter, which Players to fetch.
     */
    where?: PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Players to fetch.
     */
    orderBy?: Enumerable<PlayerOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Players.
     */
    cursor?: PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Players.
     */
    skip?: number;
    distinct?: Enumerable<PlayerScalarFieldEnum>;
  };

  /**
   * Player create
   */
  export type PlayerCreateArgs = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PlayerInclude | null;
    /**
     * The data needed to create a Player.
     */
    data: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>;
  };

  /**
   * Player createMany
   */
  export type PlayerCreateManyArgs = {
    /**
     * The data used to create many Players.
     */
    data: Enumerable<PlayerCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * Player update
   */
  export type PlayerUpdateArgs = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PlayerInclude | null;
    /**
     * The data needed to update a Player.
     */
    data: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>;
    /**
     * Choose, which Player to update.
     */
    where: PlayerWhereUniqueInput;
  };

  /**
   * Player updateMany
   */
  export type PlayerUpdateManyArgs = {
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>;
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput;
  };

  /**
   * Player upsert
   */
  export type PlayerUpsertArgs = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PlayerInclude | null;
    /**
     * The filter to search for the Player to update in case it exists.
     */
    where: PlayerWhereUniqueInput;
    /**
     * In case the Player found by the `where` argument doesn't exist, create a new Player with this data.
     */
    create: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>;
    /**
     * In case the Player was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>;
  };

  /**
   * Player delete
   */
  export type PlayerDeleteArgs = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PlayerInclude | null;
    /**
     * Filter which Player to delete.
     */
    where: PlayerWhereUniqueInput;
  };

  /**
   * Player deleteMany
   */
  export type PlayerDeleteManyArgs = {
    /**
     * Filter which Players to delete
     */
    where?: PlayerWhereInput;
  };

  /**
   * Player without action
   */
  export type PlayerArgs = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PlayerInclude | null;
  };

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null;
    _avg: AccountAvgAggregateOutputType | null;
    _sum: AccountSumAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
  };

  export type AccountAvgAggregateOutputType = {
    id: number | null;
    player_id: number | null;
  };

  export type AccountSumAggregateOutputType = {
    id: number | null;
    player_id: bigint | null;
  };

  export type AccountMinAggregateOutputType = {
    id: number | null;
    puuid: string | null;
    player_id: bigint | null;
  };

  export type AccountMaxAggregateOutputType = {
    id: number | null;
    puuid: string | null;
    player_id: bigint | null;
  };

  export type AccountCountAggregateOutputType = {
    id: number;
    puuid: number;
    player_id: number;
    _all: number;
  };

  export type AccountAvgAggregateInputType = {
    id?: true;
    player_id?: true;
  };

  export type AccountSumAggregateInputType = {
    id?: true;
    player_id?: true;
  };

  export type AccountMinAggregateInputType = {
    id?: true;
    puuid?: true;
    player_id?: true;
  };

  export type AccountMaxAggregateInputType = {
    id?: true;
    puuid?: true;
    player_id?: true;
  };

  export type AccountCountAggregateInputType = {
    id?: true;
    puuid?: true;
    player_id?: true;
    _all?: true;
  };

  export type AccountAggregateArgs = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: Enumerable<AccountOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Accounts
     */
    _count?: true | AccountCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     */
    _avg?: AccountAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     */
    _sum?: AccountSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: AccountMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: AccountMaxAggregateInputType;
  };

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
    [P in keyof T & keyof AggregateAccount]: P extends "_count" | "count"
      ? T[P] extends true ? number
      : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>;
  };

  export type AccountGroupByArgs = {
    where?: AccountWhereInput;
    orderBy?: Enumerable<AccountOrderByWithAggregationInput>;
    by: Array<AccountScalarFieldEnum>;
    having?: AccountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountCountAggregateInputType | true;
    _avg?: AccountAvgAggregateInputType;
    _sum?: AccountSumAggregateInputType;
    _min?: AccountMinAggregateInputType;
    _max?: AccountMaxAggregateInputType;
  };

  export type AccountGroupByOutputType = {
    id: number;
    puuid: string;
    player_id: bigint;
    _count: AccountCountAggregateOutputType | null;
    _avg: AccountAvgAggregateOutputType | null;
    _sum: AccountSumAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
  };

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = PrismaPromise<
    Array<
      & PickArray<AccountGroupByOutputType, T["by"]>
      & {
        [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends
          "_count" ? T[P] extends boolean ? number
          : GetScalarType<T[P], AccountGroupByOutputType[P]>
          : GetScalarType<T[P], AccountGroupByOutputType[P]>;
      }
    >
  >;

  export type AccountSelect = {
    id?: boolean;
    puuid?: boolean;
    player?: boolean | PlayerArgs;
    player_id?: boolean;
  };

  export type AccountInclude = {
    player?: boolean | PlayerArgs;
  };

  export type AccountGetPayload<
    S extends boolean | null | undefined | AccountArgs,
  > = S extends { select: any; include: any }
    ? "Please either choose `select` or `include`"
    : S extends true ? Account
    : S extends undefined ? never
    : S extends { include: any } & (AccountArgs | AccountFindManyArgs) ? 
        & Account
        & {
          [P in TruthyKeys<S["include"]>]: P extends "player"
            ? PlayerGetPayload<S["include"][P]>
            : never;
        }
    : S extends { select: any } & (AccountArgs | AccountFindManyArgs) ? {
        [P in TruthyKeys<S["select"]>]: P extends "player"
          ? PlayerGetPayload<S["select"][P]>
          : P extends keyof Account ? Account[P]
          : never;
      }
    : Account;

  type AccountCountArgs = Merge<
    Omit<AccountFindManyArgs, "select" | "include"> & {
      select?: AccountCountAggregateInputType | true;
    }
  >;

  export interface AccountDelegate<
    GlobalRejectSettings extends
      | Prisma.RejectOnNotFound
      | Prisma.RejectPerOperation
      | false
      | undefined,
  > {
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<
      T extends AccountFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, AccountFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "Account"
    > extends True ? Prisma__AccountClient<AccountGetPayload<T>>
      : Prisma__AccountClient<AccountGetPayload<T> | null, null>;

    /**
     * Find one Account that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, AccountFindUniqueOrThrowArgs>,
    ): Prisma__AccountClient<AccountGetPayload<T>>;

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<
      T extends AccountFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, AccountFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "Account"
    > extends True ? Prisma__AccountClient<AccountGetPayload<T>>
      : Prisma__AccountClient<AccountGetPayload<T> | null, null>;

    /**
     * Find the first Account that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AccountFindFirstOrThrowArgs>,
    ): Prisma__AccountClient<AccountGetPayload<T>>;

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     *
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     */
    findMany<T extends AccountFindManyArgs>(
      args?: SelectSubset<T, AccountFindManyArgs>,
    ): PrismaPromise<Array<AccountGetPayload<T>>>;

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     */
    create<T extends AccountCreateArgs>(
      args: SelectSubset<T, AccountCreateArgs>,
    ): Prisma__AccountClient<AccountGetPayload<T>>;

    /**
     * Create many Accounts.
     *     @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     *     @example
     *     // Create many Accounts
     *     const account = await prisma.account.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     */
    createMany<T extends AccountCreateManyArgs>(
      args?: SelectSubset<T, AccountCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     */
    delete<T extends AccountDeleteArgs>(
      args: SelectSubset<T, AccountDeleteArgs>,
    ): Prisma__AccountClient<AccountGetPayload<T>>;

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     */
    update<T extends AccountUpdateArgs>(
      args: SelectSubset<T, AccountUpdateArgs>,
    ): Prisma__AccountClient<AccountGetPayload<T>>;

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    deleteMany<T extends AccountDeleteManyArgs>(
      args?: SelectSubset<T, AccountDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     */
    updateMany<T extends AccountUpdateManyArgs>(
      args: SelectSubset<T, AccountUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(
      args: SelectSubset<T, AccountUpsertArgs>,
    ): Prisma__AccountClient<AccountGetPayload<T>>;

    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
     */
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any> ? T["select"] extends true ? number
        : GetScalarType<T["select"], AccountCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends AccountAggregateArgs>(
      args: Subset<T, AccountAggregateArgs>,
    ): PrismaPromise<GetAccountAggregateType<T>>;

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     */
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs["orderBy"] }
        : { orderBy?: AccountGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False ? {
            [P in HavingFields]: P extends ByFields ? never
              : P extends string
                ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                Error,
                "Field ",
                P,
                ` in "having" needs to be provided in "by"`,
              ];
          }[HavingFields]
        : "take" extends Keys<T>
          ? "orderBy" extends Keys<T> ? ByValid extends True ? {}
            : {
              [P in OrderFields]: P extends ByFields ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
            }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
          ? "orderBy" extends Keys<T> ? ByValid extends True ? {}
            : {
              [P in OrderFields]: P extends ByFields ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
            }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True ? {}
        : {
          [P in OrderFields]: P extends ByFields ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
        }[OrderFields],
    >(
      args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetAccountGroupByPayload<T>
      : PrismaPromise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__AccountClient<T, Null = never>
    implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    player<T extends PlayerArgs = {}>(
      args?: Subset<T, PlayerArgs>,
    ): Prisma__PlayerClient<PlayerGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Account base type for findUnique actions
   */
  export type AccountFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude | null;
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account: findUnique
   */
  export interface AccountFindUniqueArgs extends AccountFindUniqueArgsBase {
    /**
     * Throw an Error if query returns no results
     * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
     */
    rejectOnNotFound?: RejectOnNotFound;
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude | null;
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account base type for findFirst actions
   */
  export type AccountFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude | null;
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: Enumerable<AccountOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Accounts.
     */
    distinct?: Enumerable<AccountScalarFieldEnum>;
  };

  /**
   * Account: findFirst
   */
  export interface AccountFindFirstArgs extends AccountFindFirstArgsBase {
    /**
     * Throw an Error if query returns no results
     * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
     */
    rejectOnNotFound?: RejectOnNotFound;
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude | null;
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: Enumerable<AccountOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Accounts.
     */
    distinct?: Enumerable<AccountScalarFieldEnum>;
  };

  /**
   * Account findMany
   */
  export type AccountFindManyArgs = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude | null;
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?: Enumerable<AccountOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    distinct?: Enumerable<AccountScalarFieldEnum>;
  };

  /**
   * Account create
   */
  export type AccountCreateArgs = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude | null;
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
  };

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs = {
    /**
     * The data used to create many Accounts.
     */
    data: Enumerable<AccountCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * Account update
   */
  export type AccountUpdateArgs = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude | null;
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>;
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput;
  };

  /**
   * Account upsert
   */
  export type AccountUpsertArgs = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude | null;
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput;
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
  };

  /**
   * Account delete
   */
  export type AccountDeleteArgs = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude | null;
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput;
  };

  /**
   * Account without action
   */
  export type AccountArgs = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AccountInclude | null;
  };

  /**
   * Model Game
   */

  export type AggregateGame = {
    _count: GameCountAggregateOutputType | null;
    _avg: GameAvgAggregateOutputType | null;
    _sum: GameSumAggregateOutputType | null;
    _min: GameMinAggregateOutputType | null;
    _max: GameMaxAggregateOutputType | null;
  };

  export type GameAvgAggregateOutputType = {
    id: number | null;
  };

  export type GameSumAggregateOutputType = {
    id: number | null;
  };

  export type GameMinAggregateOutputType = {
    id: number | null;
    winner: boolean | null;
  };

  export type GameMaxAggregateOutputType = {
    id: number | null;
    winner: boolean | null;
  };

  export type GameCountAggregateOutputType = {
    id: number;
    winner: number;
    _all: number;
  };

  export type GameAvgAggregateInputType = {
    id?: true;
  };

  export type GameSumAggregateInputType = {
    id?: true;
  };

  export type GameMinAggregateInputType = {
    id?: true;
    winner?: true;
  };

  export type GameMaxAggregateInputType = {
    id?: true;
    winner?: true;
  };

  export type GameCountAggregateInputType = {
    id?: true;
    winner?: true;
    _all?: true;
  };

  export type GameAggregateArgs = {
    /**
     * Filter which Game to aggregate.
     */
    where?: GameWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Games to fetch.
     */
    orderBy?: Enumerable<GameOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: GameWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Games from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Games.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Games
     */
    _count?: true | GameCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     */
    _avg?: GameAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     */
    _sum?: GameSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: GameMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: GameMaxAggregateInputType;
  };

  export type GetGameAggregateType<T extends GameAggregateArgs> = {
    [P in keyof T & keyof AggregateGame]: P extends "_count" | "count"
      ? T[P] extends true ? number
      : GetScalarType<T[P], AggregateGame[P]>
      : GetScalarType<T[P], AggregateGame[P]>;
  };

  export type GameGroupByArgs = {
    where?: GameWhereInput;
    orderBy?: Enumerable<GameOrderByWithAggregationInput>;
    by: Array<GameScalarFieldEnum>;
    having?: GameScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: GameCountAggregateInputType | true;
    _avg?: GameAvgAggregateInputType;
    _sum?: GameSumAggregateInputType;
    _min?: GameMinAggregateInputType;
    _max?: GameMaxAggregateInputType;
  };

  export type GameGroupByOutputType = {
    id: number;
    winner: boolean;
    _count: GameCountAggregateOutputType | null;
    _avg: GameAvgAggregateOutputType | null;
    _sum: GameSumAggregateOutputType | null;
    _min: GameMinAggregateOutputType | null;
    _max: GameMaxAggregateOutputType | null;
  };

  type GetGameGroupByPayload<T extends GameGroupByArgs> = PrismaPromise<
    Array<
      & PickArray<GameGroupByOutputType, T["by"]>
      & {
        [P in ((keyof T) & (keyof GameGroupByOutputType))]: P extends "_count"
          ? T[P] extends boolean ? number
          : GetScalarType<T[P], GameGroupByOutputType[P]>
          : GetScalarType<T[P], GameGroupByOutputType[P]>;
      }
    >
  >;

  export type GameSelect = {
    id?: boolean;
    winner?: boolean;
    players?: boolean | Game_PlayerFindManyArgs;
    _count?: boolean | GameCountOutputTypeArgs;
  };

  export type GameInclude = {
    players?: boolean | Game_PlayerFindManyArgs;
    _count?: boolean | GameCountOutputTypeArgs;
  };

  export type GameGetPayload<S extends boolean | null | undefined | GameArgs> =
    S extends { select: any; include: any }
      ? "Please either choose `select` or `include`"
      : S extends true ? Game
      : S extends undefined ? never
      : S extends { include: any } & (GameArgs | GameFindManyArgs) ? 
          & Game
          & {
            [P in TruthyKeys<S["include"]>]: P extends "players"
              ? Array<Game_PlayerGetPayload<S["include"][P]>>
              : P extends "_count"
                ? GameCountOutputTypeGetPayload<S["include"][P]>
              : never;
          }
      : S extends { select: any } & (GameArgs | GameFindManyArgs) ? {
          [P in TruthyKeys<S["select"]>]: P extends "players"
            ? Array<Game_PlayerGetPayload<S["select"][P]>>
            : P extends "_count" ? GameCountOutputTypeGetPayload<S["select"][P]>
            : P extends keyof Game ? Game[P]
            : never;
        }
      : Game;

  type GameCountArgs = Merge<
    Omit<GameFindManyArgs, "select" | "include"> & {
      select?: GameCountAggregateInputType | true;
    }
  >;

  export interface GameDelegate<
    GlobalRejectSettings extends
      | Prisma.RejectOnNotFound
      | Prisma.RejectPerOperation
      | false
      | undefined,
  > {
    /**
     * Find zero or one Game that matches the filter.
     * @param {GameFindUniqueArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<
      T extends GameFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, GameFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "Game"
    > extends True ? Prisma__GameClient<GameGetPayload<T>>
      : Prisma__GameClient<GameGetPayload<T> | null, null>;

    /**
     * Find one Game that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {GameFindUniqueOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, GameFindUniqueOrThrowArgs>,
    ): Prisma__GameClient<GameGetPayload<T>>;

    /**
     * Find the first Game that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<
      T extends GameFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, GameFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "Game"
    > extends True ? Prisma__GameClient<GameGetPayload<T>>
      : Prisma__GameClient<GameGetPayload<T> | null, null>;

    /**
     * Find the first Game that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameFindFirstOrThrowArgs>(
      args?: SelectSubset<T, GameFindFirstOrThrowArgs>,
    ): Prisma__GameClient<GameGetPayload<T>>;

    /**
     * Find zero or more Games that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Games
     * const games = await prisma.game.findMany()
     *
     * // Get first 10 Games
     * const games = await prisma.game.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const gameWithIdOnly = await prisma.game.findMany({ select: { id: true } })
     */
    findMany<T extends GameFindManyArgs>(
      args?: SelectSubset<T, GameFindManyArgs>,
    ): PrismaPromise<Array<GameGetPayload<T>>>;

    /**
     * Create a Game.
     * @param {GameCreateArgs} args - Arguments to create a Game.
     * @example
     * // Create one Game
     * const Game = await prisma.game.create({
     *   data: {
     *     // ... data to create a Game
     *   }
     * })
     */
    create<T extends GameCreateArgs>(
      args: SelectSubset<T, GameCreateArgs>,
    ): Prisma__GameClient<GameGetPayload<T>>;

    /**
     * Create many Games.
     *     @param {GameCreateManyArgs} args - Arguments to create many Games.
     *     @example
     *     // Create many Games
     *     const game = await prisma.game.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     */
    createMany<T extends GameCreateManyArgs>(
      args?: SelectSubset<T, GameCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a Game.
     * @param {GameDeleteArgs} args - Arguments to delete one Game.
     * @example
     * // Delete one Game
     * const Game = await prisma.game.delete({
     *   where: {
     *     // ... filter to delete one Game
     *   }
     * })
     */
    delete<T extends GameDeleteArgs>(
      args: SelectSubset<T, GameDeleteArgs>,
    ): Prisma__GameClient<GameGetPayload<T>>;

    /**
     * Update one Game.
     * @param {GameUpdateArgs} args - Arguments to update one Game.
     * @example
     * // Update one Game
     * const game = await prisma.game.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     */
    update<T extends GameUpdateArgs>(
      args: SelectSubset<T, GameUpdateArgs>,
    ): Prisma__GameClient<GameGetPayload<T>>;

    /**
     * Delete zero or more Games.
     * @param {GameDeleteManyArgs} args - Arguments to filter Games to delete.
     * @example
     * // Delete a few Games
     * const { count } = await prisma.game.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    deleteMany<T extends GameDeleteManyArgs>(
      args?: SelectSubset<T, GameDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Games
     * const game = await prisma.game.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     */
    updateMany<T extends GameUpdateManyArgs>(
      args: SelectSubset<T, GameUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one Game.
     * @param {GameUpsertArgs} args - Arguments to update or create a Game.
     * @example
     * // Update or create a Game
     * const game = await prisma.game.upsert({
     *   create: {
     *     // ... data to create a Game
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Game we want to update
     *   }
     * })
     */
    upsert<T extends GameUpsertArgs>(
      args: SelectSubset<T, GameUpsertArgs>,
    ): Prisma__GameClient<GameGetPayload<T>>;

    /**
     * Count the number of Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameCountArgs} args - Arguments to filter Games to count.
     * @example
     * // Count the number of Games
     * const count = await prisma.game.count({
     *   where: {
     *     // ... the filter for the Games we want to count
     *   }
     * })
     */
    count<T extends GameCountArgs>(
      args?: Subset<T, GameCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any> ? T["select"] extends true ? number
        : GetScalarType<T["select"], GameCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends GameAggregateArgs>(
      args: Subset<T, GameAggregateArgs>,
    ): PrismaPromise<GetGameAggregateType<T>>;

    /**
     * Group by Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     */
    groupBy<
      T extends GameGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameGroupByArgs["orderBy"] }
        : { orderBy?: GameGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False ? {
            [P in HavingFields]: P extends ByFields ? never
              : P extends string
                ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                Error,
                "Field ",
                P,
                ` in "having" needs to be provided in "by"`,
              ];
          }[HavingFields]
        : "take" extends Keys<T>
          ? "orderBy" extends Keys<T> ? ByValid extends True ? {}
            : {
              [P in OrderFields]: P extends ByFields ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
            }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
          ? "orderBy" extends Keys<T> ? ByValid extends True ? {}
            : {
              [P in OrderFields]: P extends ByFields ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
            }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True ? {}
        : {
          [P in OrderFields]: P extends ByFields ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
        }[OrderFields],
    >(
      args: SubsetIntersection<T, GameGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetGameGroupByPayload<T>
      : PrismaPromise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Game.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__GameClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    players<T extends Game_PlayerFindManyArgs = {}>(
      args?: Subset<T, Game_PlayerFindManyArgs>,
    ): PrismaPromise<Array<Game_PlayerGetPayload<T>> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Game base type for findUnique actions
   */
  export type GameFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GameInclude | null;
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput;
  };

  /**
   * Game: findUnique
   */
  export interface GameFindUniqueArgs extends GameFindUniqueArgsBase {
    /**
     * Throw an Error if query returns no results
     * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
     */
    rejectOnNotFound?: RejectOnNotFound;
  }

  /**
   * Game findUniqueOrThrow
   */
  export type GameFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GameInclude | null;
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput;
  };

  /**
   * Game base type for findFirst actions
   */
  export type GameFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GameInclude | null;
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Games to fetch.
     */
    orderBy?: Enumerable<GameOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Games from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Games.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Games.
     */
    distinct?: Enumerable<GameScalarFieldEnum>;
  };

  /**
   * Game: findFirst
   */
  export interface GameFindFirstArgs extends GameFindFirstArgsBase {
    /**
     * Throw an Error if query returns no results
     * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
     */
    rejectOnNotFound?: RejectOnNotFound;
  }

  /**
   * Game findFirstOrThrow
   */
  export type GameFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GameInclude | null;
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Games to fetch.
     */
    orderBy?: Enumerable<GameOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Games from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Games.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Games.
     */
    distinct?: Enumerable<GameScalarFieldEnum>;
  };

  /**
   * Game findMany
   */
  export type GameFindManyArgs = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GameInclude | null;
    /**
     * Filter, which Games to fetch.
     */
    where?: GameWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Games to fetch.
     */
    orderBy?: Enumerable<GameOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Games.
     */
    cursor?: GameWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Games from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Games.
     */
    skip?: number;
    distinct?: Enumerable<GameScalarFieldEnum>;
  };

  /**
   * Game create
   */
  export type GameCreateArgs = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GameInclude | null;
    /**
     * The data needed to create a Game.
     */
    data: XOR<GameCreateInput, GameUncheckedCreateInput>;
  };

  /**
   * Game createMany
   */
  export type GameCreateManyArgs = {
    /**
     * The data used to create many Games.
     */
    data: Enumerable<GameCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * Game update
   */
  export type GameUpdateArgs = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GameInclude | null;
    /**
     * The data needed to update a Game.
     */
    data: XOR<GameUpdateInput, GameUncheckedUpdateInput>;
    /**
     * Choose, which Game to update.
     */
    where: GameWhereUniqueInput;
  };

  /**
   * Game updateMany
   */
  export type GameUpdateManyArgs = {
    /**
     * The data used to update Games.
     */
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>;
    /**
     * Filter which Games to update
     */
    where?: GameWhereInput;
  };

  /**
   * Game upsert
   */
  export type GameUpsertArgs = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GameInclude | null;
    /**
     * The filter to search for the Game to update in case it exists.
     */
    where: GameWhereUniqueInput;
    /**
     * In case the Game found by the `where` argument doesn't exist, create a new Game with this data.
     */
    create: XOR<GameCreateInput, GameUncheckedCreateInput>;
    /**
     * In case the Game was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameUpdateInput, GameUncheckedUpdateInput>;
  };

  /**
   * Game delete
   */
  export type GameDeleteArgs = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GameInclude | null;
    /**
     * Filter which Game to delete.
     */
    where: GameWhereUniqueInput;
  };

  /**
   * Game deleteMany
   */
  export type GameDeleteManyArgs = {
    /**
     * Filter which Games to delete
     */
    where?: GameWhereInput;
  };

  /**
   * Game without action
   */
  export type GameArgs = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: GameInclude | null;
  };

  /**
   * Model Game_Player
   */

  export type AggregateGame_Player = {
    _count: Game_PlayerCountAggregateOutputType | null;
    _avg: Game_PlayerAvgAggregateOutputType | null;
    _sum: Game_PlayerSumAggregateOutputType | null;
    _min: Game_PlayerMinAggregateOutputType | null;
    _max: Game_PlayerMaxAggregateOutputType | null;
  };

  export type Game_PlayerAvgAggregateOutputType = {
    id: number | null;
    game_id: number | null;
    player_id: number | null;
  };

  export type Game_PlayerSumAggregateOutputType = {
    id: number | null;
    game_id: number | null;
    player_id: bigint | null;
  };

  export type Game_PlayerMinAggregateOutputType = {
    id: number | null;
    game_id: number | null;
    role: string | null;
    blue_side: boolean | null;
    player_id: bigint | null;
  };

  export type Game_PlayerMaxAggregateOutputType = {
    id: number | null;
    game_id: number | null;
    role: string | null;
    blue_side: boolean | null;
    player_id: bigint | null;
  };

  export type Game_PlayerCountAggregateOutputType = {
    id: number;
    game_id: number;
    role: number;
    blue_side: number;
    player_id: number;
    _all: number;
  };

  export type Game_PlayerAvgAggregateInputType = {
    id?: true;
    game_id?: true;
    player_id?: true;
  };

  export type Game_PlayerSumAggregateInputType = {
    id?: true;
    game_id?: true;
    player_id?: true;
  };

  export type Game_PlayerMinAggregateInputType = {
    id?: true;
    game_id?: true;
    role?: true;
    blue_side?: true;
    player_id?: true;
  };

  export type Game_PlayerMaxAggregateInputType = {
    id?: true;
    game_id?: true;
    role?: true;
    blue_side?: true;
    player_id?: true;
  };

  export type Game_PlayerCountAggregateInputType = {
    id?: true;
    game_id?: true;
    role?: true;
    blue_side?: true;
    player_id?: true;
    _all?: true;
  };

  export type Game_PlayerAggregateArgs = {
    /**
     * Filter which Game_Player to aggregate.
     */
    where?: Game_PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Game_Players to fetch.
     */
    orderBy?: Enumerable<Game_PlayerOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Game_PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Game_Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Game_Players.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Game_Players
     */
    _count?: true | Game_PlayerCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     */
    _avg?: Game_PlayerAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     */
    _sum?: Game_PlayerSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     */
    _min?: Game_PlayerMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     */
    _max?: Game_PlayerMaxAggregateInputType;
  };

  export type GetGame_PlayerAggregateType<T extends Game_PlayerAggregateArgs> =
    {
      [P in keyof T & keyof AggregateGame_Player]: P extends "_count" | "count"
        ? T[P] extends true ? number
        : GetScalarType<T[P], AggregateGame_Player[P]>
        : GetScalarType<T[P], AggregateGame_Player[P]>;
    };

  export type Game_PlayerGroupByArgs = {
    where?: Game_PlayerWhereInput;
    orderBy?: Enumerable<Game_PlayerOrderByWithAggregationInput>;
    by: Array<Game_PlayerScalarFieldEnum>;
    having?: Game_PlayerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Game_PlayerCountAggregateInputType | true;
    _avg?: Game_PlayerAvgAggregateInputType;
    _sum?: Game_PlayerSumAggregateInputType;
    _min?: Game_PlayerMinAggregateInputType;
    _max?: Game_PlayerMaxAggregateInputType;
  };

  export type Game_PlayerGroupByOutputType = {
    id: number;
    game_id: number;
    role: string;
    blue_side: boolean;
    player_id: bigint;
    _count: Game_PlayerCountAggregateOutputType | null;
    _avg: Game_PlayerAvgAggregateOutputType | null;
    _sum: Game_PlayerSumAggregateOutputType | null;
    _min: Game_PlayerMinAggregateOutputType | null;
    _max: Game_PlayerMaxAggregateOutputType | null;
  };

  type GetGame_PlayerGroupByPayload<T extends Game_PlayerGroupByArgs> =
    PrismaPromise<
      Array<
        & PickArray<Game_PlayerGroupByOutputType, T["by"]>
        & {
          [P in ((keyof T) & (keyof Game_PlayerGroupByOutputType))]: P extends
            "_count" ? T[P] extends boolean ? number
            : GetScalarType<T[P], Game_PlayerGroupByOutputType[P]>
            : GetScalarType<T[P], Game_PlayerGroupByOutputType[P]>;
        }
      >
    >;

  export type Game_PlayerSelect = {
    id?: boolean;
    game?: boolean | GameArgs;
    game_id?: boolean;
    role?: boolean;
    blue_side?: boolean;
    player?: boolean | PlayerArgs;
    player_id?: boolean;
  };

  export type Game_PlayerInclude = {
    game?: boolean | GameArgs;
    player?: boolean | PlayerArgs;
  };

  export type Game_PlayerGetPayload<
    S extends boolean | null | undefined | Game_PlayerArgs,
  > = S extends { select: any; include: any }
    ? "Please either choose `select` or `include`"
    : S extends true ? Game_Player
    : S extends undefined ? never
    : S extends { include: any } & (Game_PlayerArgs | Game_PlayerFindManyArgs)
      ? 
        & Game_Player
        & {
          [P in TruthyKeys<S["include"]>]: P extends "game"
            ? GameGetPayload<S["include"][P]>
            : P extends "player" ? PlayerGetPayload<S["include"][P]>
            : never;
        }
    : S extends { select: any } & (Game_PlayerArgs | Game_PlayerFindManyArgs)
      ? {
        [P in TruthyKeys<S["select"]>]: P extends "game"
          ? GameGetPayload<S["select"][P]>
          : P extends "player" ? PlayerGetPayload<S["select"][P]>
          : P extends keyof Game_Player ? Game_Player[P]
          : never;
      }
    : Game_Player;

  type Game_PlayerCountArgs = Merge<
    Omit<Game_PlayerFindManyArgs, "select" | "include"> & {
      select?: Game_PlayerCountAggregateInputType | true;
    }
  >;

  export interface Game_PlayerDelegate<
    GlobalRejectSettings extends
      | Prisma.RejectOnNotFound
      | Prisma.RejectPerOperation
      | false
      | undefined,
  > {
    /**
     * Find zero or one Game_Player that matches the filter.
     * @param {Game_PlayerFindUniqueArgs} args - Arguments to find a Game_Player
     * @example
     * // Get one Game_Player
     * const game_Player = await prisma.game_Player.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<
      T extends Game_PlayerFindUniqueArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args: SelectSubset<T, Game_PlayerFindUniqueArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findUnique",
      "Game_Player"
    > extends True ? Prisma__Game_PlayerClient<Game_PlayerGetPayload<T>>
      : Prisma__Game_PlayerClient<Game_PlayerGetPayload<T> | null, null>;

    /**
     * Find one Game_Player that matches the filter or throw an error  with `error.code='P2025'`
     *     if no matches were found.
     * @param {Game_PlayerFindUniqueOrThrowArgs} args - Arguments to find a Game_Player
     * @example
     * // Get one Game_Player
     * const game_Player = await prisma.game_Player.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends Game_PlayerFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, Game_PlayerFindUniqueOrThrowArgs>,
    ): Prisma__Game_PlayerClient<Game_PlayerGetPayload<T>>;

    /**
     * Find the first Game_Player that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Game_PlayerFindFirstArgs} args - Arguments to find a Game_Player
     * @example
     * // Get one Game_Player
     * const game_Player = await prisma.game_Player.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<
      T extends Game_PlayerFindFirstArgs,
      LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound
        ? T["rejectOnNotFound"]
        : undefined,
    >(
      args?: SelectSubset<T, Game_PlayerFindFirstArgs>,
    ): HasReject<
      GlobalRejectSettings,
      LocalRejectSettings,
      "findFirst",
      "Game_Player"
    > extends True ? Prisma__Game_PlayerClient<Game_PlayerGetPayload<T>>
      : Prisma__Game_PlayerClient<Game_PlayerGetPayload<T> | null, null>;

    /**
     * Find the first Game_Player that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Game_PlayerFindFirstOrThrowArgs} args - Arguments to find a Game_Player
     * @example
     * // Get one Game_Player
     * const game_Player = await prisma.game_Player.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends Game_PlayerFindFirstOrThrowArgs>(
      args?: SelectSubset<T, Game_PlayerFindFirstOrThrowArgs>,
    ): Prisma__Game_PlayerClient<Game_PlayerGetPayload<T>>;

    /**
     * Find zero or more Game_Players that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Game_PlayerFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Game_Players
     * const game_Players = await prisma.game_Player.findMany()
     *
     * // Get first 10 Game_Players
     * const game_Players = await prisma.game_Player.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const game_PlayerWithIdOnly = await prisma.game_Player.findMany({ select: { id: true } })
     */
    findMany<T extends Game_PlayerFindManyArgs>(
      args?: SelectSubset<T, Game_PlayerFindManyArgs>,
    ): PrismaPromise<Array<Game_PlayerGetPayload<T>>>;

    /**
     * Create a Game_Player.
     * @param {Game_PlayerCreateArgs} args - Arguments to create a Game_Player.
     * @example
     * // Create one Game_Player
     * const Game_Player = await prisma.game_Player.create({
     *   data: {
     *     // ... data to create a Game_Player
     *   }
     * })
     */
    create<T extends Game_PlayerCreateArgs>(
      args: SelectSubset<T, Game_PlayerCreateArgs>,
    ): Prisma__Game_PlayerClient<Game_PlayerGetPayload<T>>;

    /**
     * Create many Game_Players.
     *     @param {Game_PlayerCreateManyArgs} args - Arguments to create many Game_Players.
     *     @example
     *     // Create many Game_Players
     *     const game_Player = await prisma.game_Player.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     */
    createMany<T extends Game_PlayerCreateManyArgs>(
      args?: SelectSubset<T, Game_PlayerCreateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Delete a Game_Player.
     * @param {Game_PlayerDeleteArgs} args - Arguments to delete one Game_Player.
     * @example
     * // Delete one Game_Player
     * const Game_Player = await prisma.game_Player.delete({
     *   where: {
     *     // ... filter to delete one Game_Player
     *   }
     * })
     */
    delete<T extends Game_PlayerDeleteArgs>(
      args: SelectSubset<T, Game_PlayerDeleteArgs>,
    ): Prisma__Game_PlayerClient<Game_PlayerGetPayload<T>>;

    /**
     * Update one Game_Player.
     * @param {Game_PlayerUpdateArgs} args - Arguments to update one Game_Player.
     * @example
     * // Update one Game_Player
     * const game_Player = await prisma.game_Player.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     */
    update<T extends Game_PlayerUpdateArgs>(
      args: SelectSubset<T, Game_PlayerUpdateArgs>,
    ): Prisma__Game_PlayerClient<Game_PlayerGetPayload<T>>;

    /**
     * Delete zero or more Game_Players.
     * @param {Game_PlayerDeleteManyArgs} args - Arguments to filter Game_Players to delete.
     * @example
     * // Delete a few Game_Players
     * const { count } = await prisma.game_Player.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    deleteMany<T extends Game_PlayerDeleteManyArgs>(
      args?: SelectSubset<T, Game_PlayerDeleteManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Game_Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Game_PlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Game_Players
     * const game_Player = await prisma.game_Player.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     */
    updateMany<T extends Game_PlayerUpdateManyArgs>(
      args: SelectSubset<T, Game_PlayerUpdateManyArgs>,
    ): PrismaPromise<BatchPayload>;

    /**
     * Create or update one Game_Player.
     * @param {Game_PlayerUpsertArgs} args - Arguments to update or create a Game_Player.
     * @example
     * // Update or create a Game_Player
     * const game_Player = await prisma.game_Player.upsert({
     *   create: {
     *     // ... data to create a Game_Player
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Game_Player we want to update
     *   }
     * })
     */
    upsert<T extends Game_PlayerUpsertArgs>(
      args: SelectSubset<T, Game_PlayerUpsertArgs>,
    ): Prisma__Game_PlayerClient<Game_PlayerGetPayload<T>>;

    /**
     * Count the number of Game_Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Game_PlayerCountArgs} args - Arguments to filter Game_Players to count.
     * @example
     * // Count the number of Game_Players
     * const count = await prisma.game_Player.count({
     *   where: {
     *     // ... the filter for the Game_Players we want to count
     *   }
     * })
     */
    count<T extends Game_PlayerCountArgs>(
      args?: Subset<T, Game_PlayerCountArgs>,
    ): PrismaPromise<
      T extends _Record<"select", any> ? T["select"] extends true ? number
        : GetScalarType<T["select"], Game_PlayerCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Game_Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Game_PlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     */
    aggregate<T extends Game_PlayerAggregateArgs>(
      args: Subset<T, Game_PlayerAggregateArgs>,
    ): PrismaPromise<GetGame_PlayerAggregateType<T>>;

    /**
     * Group by Game_Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Game_PlayerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     */
    groupBy<
      T extends Game_PlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Game_PlayerGroupByArgs["orderBy"] }
        : { orderBy?: Game_PlayerGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends TupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False ? {
            [P in HavingFields]: P extends ByFields ? never
              : P extends string
                ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
              : [
                Error,
                "Field ",
                P,
                ` in "having" needs to be provided in "by"`,
              ];
          }[HavingFields]
        : "take" extends Keys<T>
          ? "orderBy" extends Keys<T> ? ByValid extends True ? {}
            : {
              [P in OrderFields]: P extends ByFields ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
            }[OrderFields]
          : 'Error: If you provide "take", you also need to provide "orderBy"'
        : "skip" extends Keys<T>
          ? "orderBy" extends Keys<T> ? ByValid extends True ? {}
            : {
              [P in OrderFields]: P extends ByFields ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
            }[OrderFields]
          : 'Error: If you provide "skip", you also need to provide "orderBy"'
        : ByValid extends True ? {}
        : {
          [P in OrderFields]: P extends ByFields ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
        }[OrderFields],
    >(
      args:
        & SubsetIntersection<T, Game_PlayerGroupByArgs, OrderByArg>
        & InputErrors,
    ): {} extends InputErrors ? GetGame_PlayerGroupByPayload<T>
      : PrismaPromise<InputErrors>;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Game_Player.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__Game_PlayerClient<T, Null = never>
    implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(
      _dmmf: runtime.DMMFClass,
      _fetcher: PrismaClientFetcher,
      _queryType: "query" | "mutation",
      _rootField: string,
      _clientMethod: string,
      _args: any,
      _dataPath: string[],
      _errorFormat: ErrorFormat,
      _measurePerformance?: boolean | undefined,
      _isList?: boolean,
    );
    readonly [Symbol.toStringTag]: "PrismaClientPromise";

    game<T extends GameArgs = {}>(
      args?: Subset<T, GameArgs>,
    ): Prisma__GameClient<GameGetPayload<T> | Null>;

    player<T extends PlayerArgs = {}>(
      args?: Subset<T, PlayerArgs>,
    ): Prisma__PlayerClient<PlayerGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Game_Player base type for findUnique actions
   */
  export type Game_PlayerFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Game_Player
     */
    select?: Game_PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: Game_PlayerInclude | null;
    /**
     * Filter, which Game_Player to fetch.
     */
    where: Game_PlayerWhereUniqueInput;
  };

  /**
   * Game_Player: findUnique
   */
  export interface Game_PlayerFindUniqueArgs
    extends Game_PlayerFindUniqueArgsBase {
    /**
     * Throw an Error if query returns no results
     * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
     */
    rejectOnNotFound?: RejectOnNotFound;
  }

  /**
   * Game_Player findUniqueOrThrow
   */
  export type Game_PlayerFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Game_Player
     */
    select?: Game_PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: Game_PlayerInclude | null;
    /**
     * Filter, which Game_Player to fetch.
     */
    where: Game_PlayerWhereUniqueInput;
  };

  /**
   * Game_Player base type for findFirst actions
   */
  export type Game_PlayerFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Game_Player
     */
    select?: Game_PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: Game_PlayerInclude | null;
    /**
     * Filter, which Game_Player to fetch.
     */
    where?: Game_PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Game_Players to fetch.
     */
    orderBy?: Enumerable<Game_PlayerOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Game_Players.
     */
    cursor?: Game_PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Game_Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Game_Players.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Game_Players.
     */
    distinct?: Enumerable<Game_PlayerScalarFieldEnum>;
  };

  /**
   * Game_Player: findFirst
   */
  export interface Game_PlayerFindFirstArgs
    extends Game_PlayerFindFirstArgsBase {
    /**
     * Throw an Error if query returns no results
     * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
     */
    rejectOnNotFound?: RejectOnNotFound;
  }

  /**
   * Game_Player findFirstOrThrow
   */
  export type Game_PlayerFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Game_Player
     */
    select?: Game_PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: Game_PlayerInclude | null;
    /**
     * Filter, which Game_Player to fetch.
     */
    where?: Game_PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Game_Players to fetch.
     */
    orderBy?: Enumerable<Game_PlayerOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Game_Players.
     */
    cursor?: Game_PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Game_Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Game_Players.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Game_Players.
     */
    distinct?: Enumerable<Game_PlayerScalarFieldEnum>;
  };

  /**
   * Game_Player findMany
   */
  export type Game_PlayerFindManyArgs = {
    /**
     * Select specific fields to fetch from the Game_Player
     */
    select?: Game_PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: Game_PlayerInclude | null;
    /**
     * Filter, which Game_Players to fetch.
     */
    where?: Game_PlayerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Game_Players to fetch.
     */
    orderBy?: Enumerable<Game_PlayerOrderByWithRelationInput>;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Game_Players.
     */
    cursor?: Game_PlayerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Game_Players from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Game_Players.
     */
    skip?: number;
    distinct?: Enumerable<Game_PlayerScalarFieldEnum>;
  };

  /**
   * Game_Player create
   */
  export type Game_PlayerCreateArgs = {
    /**
     * Select specific fields to fetch from the Game_Player
     */
    select?: Game_PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: Game_PlayerInclude | null;
    /**
     * The data needed to create a Game_Player.
     */
    data: XOR<Game_PlayerCreateInput, Game_PlayerUncheckedCreateInput>;
  };

  /**
   * Game_Player createMany
   */
  export type Game_PlayerCreateManyArgs = {
    /**
     * The data used to create many Game_Players.
     */
    data: Enumerable<Game_PlayerCreateManyInput>;
    skipDuplicates?: boolean;
  };

  /**
   * Game_Player update
   */
  export type Game_PlayerUpdateArgs = {
    /**
     * Select specific fields to fetch from the Game_Player
     */
    select?: Game_PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: Game_PlayerInclude | null;
    /**
     * The data needed to update a Game_Player.
     */
    data: XOR<Game_PlayerUpdateInput, Game_PlayerUncheckedUpdateInput>;
    /**
     * Choose, which Game_Player to update.
     */
    where: Game_PlayerWhereUniqueInput;
  };

  /**
   * Game_Player updateMany
   */
  export type Game_PlayerUpdateManyArgs = {
    /**
     * The data used to update Game_Players.
     */
    data: XOR<
      Game_PlayerUpdateManyMutationInput,
      Game_PlayerUncheckedUpdateManyInput
    >;
    /**
     * Filter which Game_Players to update
     */
    where?: Game_PlayerWhereInput;
  };

  /**
   * Game_Player upsert
   */
  export type Game_PlayerUpsertArgs = {
    /**
     * Select specific fields to fetch from the Game_Player
     */
    select?: Game_PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: Game_PlayerInclude | null;
    /**
     * The filter to search for the Game_Player to update in case it exists.
     */
    where: Game_PlayerWhereUniqueInput;
    /**
     * In case the Game_Player found by the `where` argument doesn't exist, create a new Game_Player with this data.
     */
    create: XOR<Game_PlayerCreateInput, Game_PlayerUncheckedCreateInput>;
    /**
     * In case the Game_Player was found with the provided `where` argument, update it with this data.
     */
    update: XOR<Game_PlayerUpdateInput, Game_PlayerUncheckedUpdateInput>;
  };

  /**
   * Game_Player delete
   */
  export type Game_PlayerDeleteArgs = {
    /**
     * Select specific fields to fetch from the Game_Player
     */
    select?: Game_PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: Game_PlayerInclude | null;
    /**
     * Filter which Game_Player to delete.
     */
    where: Game_PlayerWhereUniqueInput;
  };

  /**
   * Game_Player deleteMany
   */
  export type Game_PlayerDeleteManyArgs = {
    /**
     * Filter which Game_Players to delete
     */
    where?: Game_PlayerWhereInput;
  };

  /**
   * Game_Player without action
   */
  export type Game_PlayerArgs = {
    /**
     * Select specific fields to fetch from the Game_Player
     */
    select?: Game_PlayerSelect | null;
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: Game_PlayerInclude | null;
  };

  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const AccountScalarFieldEnum: {
    id: "id";
    puuid: "puuid";
    player_id: "player_id";
  };

  export type AccountScalarFieldEnum =
    (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];

  export const GameScalarFieldEnum: {
    id: "id";
    winner: "winner";
  };

  export type GameScalarFieldEnum =
    (typeof GameScalarFieldEnum)[keyof typeof GameScalarFieldEnum];

  export const Game_PlayerScalarFieldEnum: {
    id: "id";
    game_id: "game_id";
    role: "role";
    blue_side: "blue_side";
    player_id: "player_id";
  };

  export type Game_PlayerScalarFieldEnum = (typeof Game_PlayerScalarFieldEnum)[
    keyof typeof Game_PlayerScalarFieldEnum
  ];

  export const PlayerScalarFieldEnum: {
    id: "id";
    discord_id: "discord_id";
    mu: "mu";
    sigma: "sigma";
  };

  export type PlayerScalarFieldEnum =
    (typeof PlayerScalarFieldEnum)[keyof typeof PlayerScalarFieldEnum];

  export const QueryMode: {
    default: "default";
    insensitive: "insensitive";
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const ServerInformationScalarFieldEnum: {
    id: "id";
    queue_channel: "queue_channel";
    command_channel: "command_channel";
    top_emoji: "top_emoji";
    jungle_emoji: "jungle_emoji";
    middle_emoji: "middle_emoji";
    bottom_emoji: "bottom_emoji";
    support_emoji: "support_emoji";
  };

  export type ServerInformationScalarFieldEnum =
    (typeof ServerInformationScalarFieldEnum)[
      keyof typeof ServerInformationScalarFieldEnum
    ];

  export const SortOrder: {
    asc: "asc";
    desc: "desc";
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const TransactionIsolationLevel: {
    Serializable: "Serializable";
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  /**
   * Deep Input Types
   */

  export type ServerInformationWhereInput = {
    AND?: Enumerable<ServerInformationWhereInput>;
    OR?: Enumerable<ServerInformationWhereInput>;
    NOT?: Enumerable<ServerInformationWhereInput>;
    id?: IntFilter | number;
    queue_channel?: BigIntFilter | bigint | number;
    command_channel?: BigIntFilter | bigint | number;
    top_emoji?: StringFilter | string;
    jungle_emoji?: StringFilter | string;
    middle_emoji?: StringFilter | string;
    bottom_emoji?: StringFilter | string;
    support_emoji?: StringFilter | string;
  };

  export type ServerInformationOrderByWithRelationInput = {
    id?: SortOrder;
    queue_channel?: SortOrder;
    command_channel?: SortOrder;
    top_emoji?: SortOrder;
    jungle_emoji?: SortOrder;
    middle_emoji?: SortOrder;
    bottom_emoji?: SortOrder;
    support_emoji?: SortOrder;
  };

  export type ServerInformationWhereUniqueInput = {
    id?: number;
  };

  export type ServerInformationOrderByWithAggregationInput = {
    id?: SortOrder;
    queue_channel?: SortOrder;
    command_channel?: SortOrder;
    top_emoji?: SortOrder;
    jungle_emoji?: SortOrder;
    middle_emoji?: SortOrder;
    bottom_emoji?: SortOrder;
    support_emoji?: SortOrder;
    _count?: ServerInformationCountOrderByAggregateInput;
    _avg?: ServerInformationAvgOrderByAggregateInput;
    _max?: ServerInformationMaxOrderByAggregateInput;
    _min?: ServerInformationMinOrderByAggregateInput;
    _sum?: ServerInformationSumOrderByAggregateInput;
  };

  export type ServerInformationScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ServerInformationScalarWhereWithAggregatesInput>;
    OR?: Enumerable<ServerInformationScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<ServerInformationScalarWhereWithAggregatesInput>;
    id?: IntWithAggregatesFilter | number;
    queue_channel?: BigIntWithAggregatesFilter | bigint | number;
    command_channel?: BigIntWithAggregatesFilter | bigint | number;
    top_emoji?: StringWithAggregatesFilter | string;
    jungle_emoji?: StringWithAggregatesFilter | string;
    middle_emoji?: StringWithAggregatesFilter | string;
    bottom_emoji?: StringWithAggregatesFilter | string;
    support_emoji?: StringWithAggregatesFilter | string;
  };

  export type PlayerWhereInput = {
    AND?: Enumerable<PlayerWhereInput>;
    OR?: Enumerable<PlayerWhereInput>;
    NOT?: Enumerable<PlayerWhereInput>;
    id?: IntFilter | number;
    discord_id?: BigIntFilter | bigint | number;
    accounts?: AccountListRelationFilter;
    games?: Game_PlayerListRelationFilter;
    mu?: FloatFilter | number;
    sigma?: FloatFilter | number;
  };

  export type PlayerOrderByWithRelationInput = {
    id?: SortOrder;
    discord_id?: SortOrder;
    accounts?: AccountOrderByRelationAggregateInput;
    games?: Game_PlayerOrderByRelationAggregateInput;
    mu?: SortOrder;
    sigma?: SortOrder;
  };

  export type PlayerWhereUniqueInput = {
    id?: number;
    discord_id?: bigint | number;
  };

  export type PlayerOrderByWithAggregationInput = {
    id?: SortOrder;
    discord_id?: SortOrder;
    mu?: SortOrder;
    sigma?: SortOrder;
    _count?: PlayerCountOrderByAggregateInput;
    _avg?: PlayerAvgOrderByAggregateInput;
    _max?: PlayerMaxOrderByAggregateInput;
    _min?: PlayerMinOrderByAggregateInput;
    _sum?: PlayerSumOrderByAggregateInput;
  };

  export type PlayerScalarWhereWithAggregatesInput = {
    AND?: Enumerable<PlayerScalarWhereWithAggregatesInput>;
    OR?: Enumerable<PlayerScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<PlayerScalarWhereWithAggregatesInput>;
    id?: IntWithAggregatesFilter | number;
    discord_id?: BigIntWithAggregatesFilter | bigint | number;
    mu?: FloatWithAggregatesFilter | number;
    sigma?: FloatWithAggregatesFilter | number;
  };

  export type AccountWhereInput = {
    AND?: Enumerable<AccountWhereInput>;
    OR?: Enumerable<AccountWhereInput>;
    NOT?: Enumerable<AccountWhereInput>;
    id?: IntFilter | number;
    puuid?: StringFilter | string;
    player?: XOR<PlayerRelationFilter, PlayerWhereInput>;
    player_id?: BigIntFilter | bigint | number;
  };

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder;
    puuid?: SortOrder;
    player?: PlayerOrderByWithRelationInput;
    player_id?: SortOrder;
  };

  export type AccountWhereUniqueInput = {
    id?: number;
    puuid?: string;
  };

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder;
    puuid?: SortOrder;
    player_id?: SortOrder;
    _count?: AccountCountOrderByAggregateInput;
    _avg?: AccountAvgOrderByAggregateInput;
    _max?: AccountMaxOrderByAggregateInput;
    _min?: AccountMinOrderByAggregateInput;
    _sum?: AccountSumOrderByAggregateInput;
  };

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: Enumerable<AccountScalarWhereWithAggregatesInput>;
    OR?: Enumerable<AccountScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<AccountScalarWhereWithAggregatesInput>;
    id?: IntWithAggregatesFilter | number;
    puuid?: StringWithAggregatesFilter | string;
    player_id?: BigIntWithAggregatesFilter | bigint | number;
  };

  export type GameWhereInput = {
    AND?: Enumerable<GameWhereInput>;
    OR?: Enumerable<GameWhereInput>;
    NOT?: Enumerable<GameWhereInput>;
    id?: IntFilter | number;
    winner?: BoolFilter | boolean;
    players?: Game_PlayerListRelationFilter;
  };

  export type GameOrderByWithRelationInput = {
    id?: SortOrder;
    winner?: SortOrder;
    players?: Game_PlayerOrderByRelationAggregateInput;
  };

  export type GameWhereUniqueInput = {
    id?: number;
  };

  export type GameOrderByWithAggregationInput = {
    id?: SortOrder;
    winner?: SortOrder;
    _count?: GameCountOrderByAggregateInput;
    _avg?: GameAvgOrderByAggregateInput;
    _max?: GameMaxOrderByAggregateInput;
    _min?: GameMinOrderByAggregateInput;
    _sum?: GameSumOrderByAggregateInput;
  };

  export type GameScalarWhereWithAggregatesInput = {
    AND?: Enumerable<GameScalarWhereWithAggregatesInput>;
    OR?: Enumerable<GameScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<GameScalarWhereWithAggregatesInput>;
    id?: IntWithAggregatesFilter | number;
    winner?: BoolWithAggregatesFilter | boolean;
  };

  export type Game_PlayerWhereInput = {
    AND?: Enumerable<Game_PlayerWhereInput>;
    OR?: Enumerable<Game_PlayerWhereInput>;
    NOT?: Enumerable<Game_PlayerWhereInput>;
    id?: IntFilter | number;
    game?: XOR<GameRelationFilter, GameWhereInput>;
    game_id?: IntFilter | number;
    role?: StringFilter | string;
    blue_side?: BoolFilter | boolean;
    player?: XOR<PlayerRelationFilter, PlayerWhereInput>;
    player_id?: BigIntFilter | bigint | number;
  };

  export type Game_PlayerOrderByWithRelationInput = {
    id?: SortOrder;
    game?: GameOrderByWithRelationInput;
    game_id?: SortOrder;
    role?: SortOrder;
    blue_side?: SortOrder;
    player?: PlayerOrderByWithRelationInput;
    player_id?: SortOrder;
  };

  export type Game_PlayerWhereUniqueInput = {
    id?: number;
  };

  export type Game_PlayerOrderByWithAggregationInput = {
    id?: SortOrder;
    game_id?: SortOrder;
    role?: SortOrder;
    blue_side?: SortOrder;
    player_id?: SortOrder;
    _count?: Game_PlayerCountOrderByAggregateInput;
    _avg?: Game_PlayerAvgOrderByAggregateInput;
    _max?: Game_PlayerMaxOrderByAggregateInput;
    _min?: Game_PlayerMinOrderByAggregateInput;
    _sum?: Game_PlayerSumOrderByAggregateInput;
  };

  export type Game_PlayerScalarWhereWithAggregatesInput = {
    AND?: Enumerable<Game_PlayerScalarWhereWithAggregatesInput>;
    OR?: Enumerable<Game_PlayerScalarWhereWithAggregatesInput>;
    NOT?: Enumerable<Game_PlayerScalarWhereWithAggregatesInput>;
    id?: IntWithAggregatesFilter | number;
    game_id?: IntWithAggregatesFilter | number;
    role?: StringWithAggregatesFilter | string;
    blue_side?: BoolWithAggregatesFilter | boolean;
    player_id?: BigIntWithAggregatesFilter | bigint | number;
  };

  export type ServerInformationCreateInput = {
    queue_channel: bigint | number;
    command_channel: bigint | number;
    top_emoji: string;
    jungle_emoji: string;
    middle_emoji: string;
    bottom_emoji: string;
    support_emoji: string;
  };

  export type ServerInformationUncheckedCreateInput = {
    id?: number;
    queue_channel: bigint | number;
    command_channel: bigint | number;
    top_emoji: string;
    jungle_emoji: string;
    middle_emoji: string;
    bottom_emoji: string;
    support_emoji: string;
  };

  export type ServerInformationUpdateInput = {
    queue_channel?: BigIntFieldUpdateOperationsInput | bigint | number;
    command_channel?: BigIntFieldUpdateOperationsInput | bigint | number;
    top_emoji?: StringFieldUpdateOperationsInput | string;
    jungle_emoji?: StringFieldUpdateOperationsInput | string;
    middle_emoji?: StringFieldUpdateOperationsInput | string;
    bottom_emoji?: StringFieldUpdateOperationsInput | string;
    support_emoji?: StringFieldUpdateOperationsInput | string;
  };

  export type ServerInformationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    queue_channel?: BigIntFieldUpdateOperationsInput | bigint | number;
    command_channel?: BigIntFieldUpdateOperationsInput | bigint | number;
    top_emoji?: StringFieldUpdateOperationsInput | string;
    jungle_emoji?: StringFieldUpdateOperationsInput | string;
    middle_emoji?: StringFieldUpdateOperationsInput | string;
    bottom_emoji?: StringFieldUpdateOperationsInput | string;
    support_emoji?: StringFieldUpdateOperationsInput | string;
  };

  export type ServerInformationCreateManyInput = {
    id?: number;
    queue_channel: bigint | number;
    command_channel: bigint | number;
    top_emoji: string;
    jungle_emoji: string;
    middle_emoji: string;
    bottom_emoji: string;
    support_emoji: string;
  };

  export type ServerInformationUpdateManyMutationInput = {
    queue_channel?: BigIntFieldUpdateOperationsInput | bigint | number;
    command_channel?: BigIntFieldUpdateOperationsInput | bigint | number;
    top_emoji?: StringFieldUpdateOperationsInput | string;
    jungle_emoji?: StringFieldUpdateOperationsInput | string;
    middle_emoji?: StringFieldUpdateOperationsInput | string;
    bottom_emoji?: StringFieldUpdateOperationsInput | string;
    support_emoji?: StringFieldUpdateOperationsInput | string;
  };

  export type ServerInformationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    queue_channel?: BigIntFieldUpdateOperationsInput | bigint | number;
    command_channel?: BigIntFieldUpdateOperationsInput | bigint | number;
    top_emoji?: StringFieldUpdateOperationsInput | string;
    jungle_emoji?: StringFieldUpdateOperationsInput | string;
    middle_emoji?: StringFieldUpdateOperationsInput | string;
    bottom_emoji?: StringFieldUpdateOperationsInput | string;
    support_emoji?: StringFieldUpdateOperationsInput | string;
  };

  export type PlayerCreateInput = {
    discord_id: bigint | number;
    accounts?: AccountCreateNestedManyWithoutPlayerInput;
    games?: Game_PlayerCreateNestedManyWithoutPlayerInput;
    mu: number;
    sigma: number;
  };

  export type PlayerUncheckedCreateInput = {
    id?: number;
    discord_id: bigint | number;
    accounts?: AccountUncheckedCreateNestedManyWithoutPlayerInput;
    games?: Game_PlayerUncheckedCreateNestedManyWithoutPlayerInput;
    mu: number;
    sigma: number;
  };

  export type PlayerUpdateInput = {
    discord_id?: BigIntFieldUpdateOperationsInput | bigint | number;
    accounts?: AccountUpdateManyWithoutPlayerNestedInput;
    games?: Game_PlayerUpdateManyWithoutPlayerNestedInput;
    mu?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
  };

  export type PlayerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    discord_id?: BigIntFieldUpdateOperationsInput | bigint | number;
    accounts?: AccountUncheckedUpdateManyWithoutPlayerNestedInput;
    games?: Game_PlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    mu?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
  };

  export type PlayerCreateManyInput = {
    id?: number;
    discord_id: bigint | number;
    mu: number;
    sigma: number;
  };

  export type PlayerUpdateManyMutationInput = {
    discord_id?: BigIntFieldUpdateOperationsInput | bigint | number;
    mu?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
  };

  export type PlayerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    discord_id?: BigIntFieldUpdateOperationsInput | bigint | number;
    mu?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
  };

  export type AccountCreateInput = {
    puuid: string;
    player: PlayerCreateNestedOneWithoutAccountsInput;
  };

  export type AccountUncheckedCreateInput = {
    id?: number;
    puuid: string;
    player_id: bigint | number;
  };

  export type AccountUpdateInput = {
    puuid?: StringFieldUpdateOperationsInput | string;
    player?: PlayerUpdateOneRequiredWithoutAccountsNestedInput;
  };

  export type AccountUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    puuid?: StringFieldUpdateOperationsInput | string;
    player_id?: BigIntFieldUpdateOperationsInput | bigint | number;
  };

  export type AccountCreateManyInput = {
    id?: number;
    puuid: string;
    player_id: bigint | number;
  };

  export type AccountUpdateManyMutationInput = {
    puuid?: StringFieldUpdateOperationsInput | string;
  };

  export type AccountUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    puuid?: StringFieldUpdateOperationsInput | string;
    player_id?: BigIntFieldUpdateOperationsInput | bigint | number;
  };

  export type GameCreateInput = {
    winner: boolean;
    players?: Game_PlayerCreateNestedManyWithoutGameInput;
  };

  export type GameUncheckedCreateInput = {
    id?: number;
    winner: boolean;
    players?: Game_PlayerUncheckedCreateNestedManyWithoutGameInput;
  };

  export type GameUpdateInput = {
    winner?: BoolFieldUpdateOperationsInput | boolean;
    players?: Game_PlayerUpdateManyWithoutGameNestedInput;
  };

  export type GameUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    winner?: BoolFieldUpdateOperationsInput | boolean;
    players?: Game_PlayerUncheckedUpdateManyWithoutGameNestedInput;
  };

  export type GameCreateManyInput = {
    id?: number;
    winner: boolean;
  };

  export type GameUpdateManyMutationInput = {
    winner?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type GameUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    winner?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type Game_PlayerCreateInput = {
    game: GameCreateNestedOneWithoutPlayersInput;
    role: string;
    blue_side: boolean;
    player: PlayerCreateNestedOneWithoutGamesInput;
  };

  export type Game_PlayerUncheckedCreateInput = {
    id?: number;
    game_id: number;
    role: string;
    blue_side: boolean;
    player_id: bigint | number;
  };

  export type Game_PlayerUpdateInput = {
    game?: GameUpdateOneRequiredWithoutPlayersNestedInput;
    role?: StringFieldUpdateOperationsInput | string;
    blue_side?: BoolFieldUpdateOperationsInput | boolean;
    player?: PlayerUpdateOneRequiredWithoutGamesNestedInput;
  };

  export type Game_PlayerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    game_id?: IntFieldUpdateOperationsInput | number;
    role?: StringFieldUpdateOperationsInput | string;
    blue_side?: BoolFieldUpdateOperationsInput | boolean;
    player_id?: BigIntFieldUpdateOperationsInput | bigint | number;
  };

  export type Game_PlayerCreateManyInput = {
    id?: number;
    game_id: number;
    role: string;
    blue_side: boolean;
    player_id: bigint | number;
  };

  export type Game_PlayerUpdateManyMutationInput = {
    role?: StringFieldUpdateOperationsInput | string;
    blue_side?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type Game_PlayerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    game_id?: IntFieldUpdateOperationsInput | number;
    role?: StringFieldUpdateOperationsInput | string;
    blue_side?: BoolFieldUpdateOperationsInput | boolean;
    player_id?: BigIntFieldUpdateOperationsInput | bigint | number;
  };

  export type IntFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntFilter | number;
  };

  export type BigIntFilter = {
    equals?: bigint | number;
    in?: Enumerable<bigint> | Enumerable<number>;
    notIn?: Enumerable<bigint> | Enumerable<number>;
    lt?: bigint | number;
    lte?: bigint | number;
    gt?: bigint | number;
    gte?: bigint | number;
    not?: NestedBigIntFilter | bigint | number;
  };

  export type StringFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: QueryMode;
    not?: NestedStringFilter | string;
  };

  export type ServerInformationCountOrderByAggregateInput = {
    id?: SortOrder;
    queue_channel?: SortOrder;
    command_channel?: SortOrder;
    top_emoji?: SortOrder;
    jungle_emoji?: SortOrder;
    middle_emoji?: SortOrder;
    bottom_emoji?: SortOrder;
    support_emoji?: SortOrder;
  };

  export type ServerInformationAvgOrderByAggregateInput = {
    id?: SortOrder;
    queue_channel?: SortOrder;
    command_channel?: SortOrder;
  };

  export type ServerInformationMaxOrderByAggregateInput = {
    id?: SortOrder;
    queue_channel?: SortOrder;
    command_channel?: SortOrder;
    top_emoji?: SortOrder;
    jungle_emoji?: SortOrder;
    middle_emoji?: SortOrder;
    bottom_emoji?: SortOrder;
    support_emoji?: SortOrder;
  };

  export type ServerInformationMinOrderByAggregateInput = {
    id?: SortOrder;
    queue_channel?: SortOrder;
    command_channel?: SortOrder;
    top_emoji?: SortOrder;
    jungle_emoji?: SortOrder;
    middle_emoji?: SortOrder;
    bottom_emoji?: SortOrder;
    support_emoji?: SortOrder;
  };

  export type ServerInformationSumOrderByAggregateInput = {
    id?: SortOrder;
    queue_channel?: SortOrder;
    command_channel?: SortOrder;
  };

  export type IntWithAggregatesFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntWithAggregatesFilter | number;
    _count?: NestedIntFilter;
    _avg?: NestedFloatFilter;
    _sum?: NestedIntFilter;
    _min?: NestedIntFilter;
    _max?: NestedIntFilter;
  };

  export type BigIntWithAggregatesFilter = {
    equals?: bigint | number;
    in?: Enumerable<bigint> | Enumerable<number>;
    notIn?: Enumerable<bigint> | Enumerable<number>;
    lt?: bigint | number;
    lte?: bigint | number;
    gt?: bigint | number;
    gte?: bigint | number;
    not?: NestedBigIntWithAggregatesFilter | bigint | number;
    _count?: NestedIntFilter;
    _avg?: NestedFloatFilter;
    _sum?: NestedBigIntFilter;
    _min?: NestedBigIntFilter;
    _max?: NestedBigIntFilter;
  };

  export type StringWithAggregatesFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter | string;
    _count?: NestedIntFilter;
    _min?: NestedStringFilter;
    _max?: NestedStringFilter;
  };

  export type AccountListRelationFilter = {
    every?: AccountWhereInput;
    some?: AccountWhereInput;
    none?: AccountWhereInput;
  };

  export type Game_PlayerListRelationFilter = {
    every?: Game_PlayerWhereInput;
    some?: Game_PlayerWhereInput;
    none?: Game_PlayerWhereInput;
  };

  export type FloatFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedFloatFilter | number;
  };

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type Game_PlayerOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type PlayerCountOrderByAggregateInput = {
    id?: SortOrder;
    discord_id?: SortOrder;
    mu?: SortOrder;
    sigma?: SortOrder;
  };

  export type PlayerAvgOrderByAggregateInput = {
    id?: SortOrder;
    discord_id?: SortOrder;
    mu?: SortOrder;
    sigma?: SortOrder;
  };

  export type PlayerMaxOrderByAggregateInput = {
    id?: SortOrder;
    discord_id?: SortOrder;
    mu?: SortOrder;
    sigma?: SortOrder;
  };

  export type PlayerMinOrderByAggregateInput = {
    id?: SortOrder;
    discord_id?: SortOrder;
    mu?: SortOrder;
    sigma?: SortOrder;
  };

  export type PlayerSumOrderByAggregateInput = {
    id?: SortOrder;
    discord_id?: SortOrder;
    mu?: SortOrder;
    sigma?: SortOrder;
  };

  export type FloatWithAggregatesFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedFloatWithAggregatesFilter | number;
    _count?: NestedIntFilter;
    _avg?: NestedFloatFilter;
    _sum?: NestedFloatFilter;
    _min?: NestedFloatFilter;
    _max?: NestedFloatFilter;
  };

  export type PlayerRelationFilter = {
    is?: PlayerWhereInput;
    isNot?: PlayerWhereInput;
  };

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder;
    puuid?: SortOrder;
    player_id?: SortOrder;
  };

  export type AccountAvgOrderByAggregateInput = {
    id?: SortOrder;
    player_id?: SortOrder;
  };

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder;
    puuid?: SortOrder;
    player_id?: SortOrder;
  };

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder;
    puuid?: SortOrder;
    player_id?: SortOrder;
  };

  export type AccountSumOrderByAggregateInput = {
    id?: SortOrder;
    player_id?: SortOrder;
  };

  export type BoolFilter = {
    equals?: boolean;
    not?: NestedBoolFilter | boolean;
  };

  export type GameCountOrderByAggregateInput = {
    id?: SortOrder;
    winner?: SortOrder;
  };

  export type GameAvgOrderByAggregateInput = {
    id?: SortOrder;
  };

  export type GameMaxOrderByAggregateInput = {
    id?: SortOrder;
    winner?: SortOrder;
  };

  export type GameMinOrderByAggregateInput = {
    id?: SortOrder;
    winner?: SortOrder;
  };

  export type GameSumOrderByAggregateInput = {
    id?: SortOrder;
  };

  export type BoolWithAggregatesFilter = {
    equals?: boolean;
    not?: NestedBoolWithAggregatesFilter | boolean;
    _count?: NestedIntFilter;
    _min?: NestedBoolFilter;
    _max?: NestedBoolFilter;
  };

  export type GameRelationFilter = {
    is?: GameWhereInput;
    isNot?: GameWhereInput;
  };

  export type Game_PlayerCountOrderByAggregateInput = {
    id?: SortOrder;
    game_id?: SortOrder;
    role?: SortOrder;
    blue_side?: SortOrder;
    player_id?: SortOrder;
  };

  export type Game_PlayerAvgOrderByAggregateInput = {
    id?: SortOrder;
    game_id?: SortOrder;
    player_id?: SortOrder;
  };

  export type Game_PlayerMaxOrderByAggregateInput = {
    id?: SortOrder;
    game_id?: SortOrder;
    role?: SortOrder;
    blue_side?: SortOrder;
    player_id?: SortOrder;
  };

  export type Game_PlayerMinOrderByAggregateInput = {
    id?: SortOrder;
    game_id?: SortOrder;
    role?: SortOrder;
    blue_side?: SortOrder;
    player_id?: SortOrder;
  };

  export type Game_PlayerSumOrderByAggregateInput = {
    id?: SortOrder;
    game_id?: SortOrder;
    player_id?: SortOrder;
  };

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number;
    increment?: bigint | number;
    decrement?: bigint | number;
    multiply?: bigint | number;
    divide?: bigint | number;
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type AccountCreateNestedManyWithoutPlayerInput = {
    create?: XOR<
      Enumerable<AccountCreateWithoutPlayerInput>,
      Enumerable<AccountUncheckedCreateWithoutPlayerInput>
    >;
    connectOrCreate?: Enumerable<AccountCreateOrConnectWithoutPlayerInput>;
    createMany?: AccountCreateManyPlayerInputEnvelope;
    connect?: Enumerable<AccountWhereUniqueInput>;
  };

  export type Game_PlayerCreateNestedManyWithoutPlayerInput = {
    create?: XOR<
      Enumerable<Game_PlayerCreateWithoutPlayerInput>,
      Enumerable<Game_PlayerUncheckedCreateWithoutPlayerInput>
    >;
    connectOrCreate?: Enumerable<Game_PlayerCreateOrConnectWithoutPlayerInput>;
    createMany?: Game_PlayerCreateManyPlayerInputEnvelope;
    connect?: Enumerable<Game_PlayerWhereUniqueInput>;
  };

  export type AccountUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: XOR<
      Enumerable<AccountCreateWithoutPlayerInput>,
      Enumerable<AccountUncheckedCreateWithoutPlayerInput>
    >;
    connectOrCreate?: Enumerable<AccountCreateOrConnectWithoutPlayerInput>;
    createMany?: AccountCreateManyPlayerInputEnvelope;
    connect?: Enumerable<AccountWhereUniqueInput>;
  };

  export type Game_PlayerUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: XOR<
      Enumerable<Game_PlayerCreateWithoutPlayerInput>,
      Enumerable<Game_PlayerUncheckedCreateWithoutPlayerInput>
    >;
    connectOrCreate?: Enumerable<Game_PlayerCreateOrConnectWithoutPlayerInput>;
    createMany?: Game_PlayerCreateManyPlayerInputEnvelope;
    connect?: Enumerable<Game_PlayerWhereUniqueInput>;
  };

  export type AccountUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<
      Enumerable<AccountCreateWithoutPlayerInput>,
      Enumerable<AccountUncheckedCreateWithoutPlayerInput>
    >;
    connectOrCreate?: Enumerable<AccountCreateOrConnectWithoutPlayerInput>;
    upsert?: Enumerable<AccountUpsertWithWhereUniqueWithoutPlayerInput>;
    createMany?: AccountCreateManyPlayerInputEnvelope;
    set?: Enumerable<AccountWhereUniqueInput>;
    disconnect?: Enumerable<AccountWhereUniqueInput>;
    delete?: Enumerable<AccountWhereUniqueInput>;
    connect?: Enumerable<AccountWhereUniqueInput>;
    update?: Enumerable<AccountUpdateWithWhereUniqueWithoutPlayerInput>;
    updateMany?: Enumerable<AccountUpdateManyWithWhereWithoutPlayerInput>;
    deleteMany?: Enumerable<AccountScalarWhereInput>;
  };

  export type Game_PlayerUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<
      Enumerable<Game_PlayerCreateWithoutPlayerInput>,
      Enumerable<Game_PlayerUncheckedCreateWithoutPlayerInput>
    >;
    connectOrCreate?: Enumerable<Game_PlayerCreateOrConnectWithoutPlayerInput>;
    upsert?: Enumerable<Game_PlayerUpsertWithWhereUniqueWithoutPlayerInput>;
    createMany?: Game_PlayerCreateManyPlayerInputEnvelope;
    set?: Enumerable<Game_PlayerWhereUniqueInput>;
    disconnect?: Enumerable<Game_PlayerWhereUniqueInput>;
    delete?: Enumerable<Game_PlayerWhereUniqueInput>;
    connect?: Enumerable<Game_PlayerWhereUniqueInput>;
    update?: Enumerable<Game_PlayerUpdateWithWhereUniqueWithoutPlayerInput>;
    updateMany?: Enumerable<Game_PlayerUpdateManyWithWhereWithoutPlayerInput>;
    deleteMany?: Enumerable<Game_PlayerScalarWhereInput>;
  };

  export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type AccountUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<
      Enumerable<AccountCreateWithoutPlayerInput>,
      Enumerable<AccountUncheckedCreateWithoutPlayerInput>
    >;
    connectOrCreate?: Enumerable<AccountCreateOrConnectWithoutPlayerInput>;
    upsert?: Enumerable<AccountUpsertWithWhereUniqueWithoutPlayerInput>;
    createMany?: AccountCreateManyPlayerInputEnvelope;
    set?: Enumerable<AccountWhereUniqueInput>;
    disconnect?: Enumerable<AccountWhereUniqueInput>;
    delete?: Enumerable<AccountWhereUniqueInput>;
    connect?: Enumerable<AccountWhereUniqueInput>;
    update?: Enumerable<AccountUpdateWithWhereUniqueWithoutPlayerInput>;
    updateMany?: Enumerable<AccountUpdateManyWithWhereWithoutPlayerInput>;
    deleteMany?: Enumerable<AccountScalarWhereInput>;
  };

  export type Game_PlayerUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<
      Enumerable<Game_PlayerCreateWithoutPlayerInput>,
      Enumerable<Game_PlayerUncheckedCreateWithoutPlayerInput>
    >;
    connectOrCreate?: Enumerable<Game_PlayerCreateOrConnectWithoutPlayerInput>;
    upsert?: Enumerable<Game_PlayerUpsertWithWhereUniqueWithoutPlayerInput>;
    createMany?: Game_PlayerCreateManyPlayerInputEnvelope;
    set?: Enumerable<Game_PlayerWhereUniqueInput>;
    disconnect?: Enumerable<Game_PlayerWhereUniqueInput>;
    delete?: Enumerable<Game_PlayerWhereUniqueInput>;
    connect?: Enumerable<Game_PlayerWhereUniqueInput>;
    update?: Enumerable<Game_PlayerUpdateWithWhereUniqueWithoutPlayerInput>;
    updateMany?: Enumerable<Game_PlayerUpdateManyWithWhereWithoutPlayerInput>;
    deleteMany?: Enumerable<Game_PlayerScalarWhereInput>;
  };

  export type PlayerCreateNestedOneWithoutAccountsInput = {
    create?: XOR<
      PlayerCreateWithoutAccountsInput,
      PlayerUncheckedCreateWithoutAccountsInput
    >;
    connectOrCreate?: PlayerCreateOrConnectWithoutAccountsInput;
    connect?: PlayerWhereUniqueInput;
  };

  export type PlayerUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<
      PlayerCreateWithoutAccountsInput,
      PlayerUncheckedCreateWithoutAccountsInput
    >;
    connectOrCreate?: PlayerCreateOrConnectWithoutAccountsInput;
    upsert?: PlayerUpsertWithoutAccountsInput;
    connect?: PlayerWhereUniqueInput;
    update?: XOR<
      PlayerUpdateWithoutAccountsInput,
      PlayerUncheckedUpdateWithoutAccountsInput
    >;
  };

  export type Game_PlayerCreateNestedManyWithoutGameInput = {
    create?: XOR<
      Enumerable<Game_PlayerCreateWithoutGameInput>,
      Enumerable<Game_PlayerUncheckedCreateWithoutGameInput>
    >;
    connectOrCreate?: Enumerable<Game_PlayerCreateOrConnectWithoutGameInput>;
    createMany?: Game_PlayerCreateManyGameInputEnvelope;
    connect?: Enumerable<Game_PlayerWhereUniqueInput>;
  };

  export type Game_PlayerUncheckedCreateNestedManyWithoutGameInput = {
    create?: XOR<
      Enumerable<Game_PlayerCreateWithoutGameInput>,
      Enumerable<Game_PlayerUncheckedCreateWithoutGameInput>
    >;
    connectOrCreate?: Enumerable<Game_PlayerCreateOrConnectWithoutGameInput>;
    createMany?: Game_PlayerCreateManyGameInputEnvelope;
    connect?: Enumerable<Game_PlayerWhereUniqueInput>;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type Game_PlayerUpdateManyWithoutGameNestedInput = {
    create?: XOR<
      Enumerable<Game_PlayerCreateWithoutGameInput>,
      Enumerable<Game_PlayerUncheckedCreateWithoutGameInput>
    >;
    connectOrCreate?: Enumerable<Game_PlayerCreateOrConnectWithoutGameInput>;
    upsert?: Enumerable<Game_PlayerUpsertWithWhereUniqueWithoutGameInput>;
    createMany?: Game_PlayerCreateManyGameInputEnvelope;
    set?: Enumerable<Game_PlayerWhereUniqueInput>;
    disconnect?: Enumerable<Game_PlayerWhereUniqueInput>;
    delete?: Enumerable<Game_PlayerWhereUniqueInput>;
    connect?: Enumerable<Game_PlayerWhereUniqueInput>;
    update?: Enumerable<Game_PlayerUpdateWithWhereUniqueWithoutGameInput>;
    updateMany?: Enumerable<Game_PlayerUpdateManyWithWhereWithoutGameInput>;
    deleteMany?: Enumerable<Game_PlayerScalarWhereInput>;
  };

  export type Game_PlayerUncheckedUpdateManyWithoutGameNestedInput = {
    create?: XOR<
      Enumerable<Game_PlayerCreateWithoutGameInput>,
      Enumerable<Game_PlayerUncheckedCreateWithoutGameInput>
    >;
    connectOrCreate?: Enumerable<Game_PlayerCreateOrConnectWithoutGameInput>;
    upsert?: Enumerable<Game_PlayerUpsertWithWhereUniqueWithoutGameInput>;
    createMany?: Game_PlayerCreateManyGameInputEnvelope;
    set?: Enumerable<Game_PlayerWhereUniqueInput>;
    disconnect?: Enumerable<Game_PlayerWhereUniqueInput>;
    delete?: Enumerable<Game_PlayerWhereUniqueInput>;
    connect?: Enumerable<Game_PlayerWhereUniqueInput>;
    update?: Enumerable<Game_PlayerUpdateWithWhereUniqueWithoutGameInput>;
    updateMany?: Enumerable<Game_PlayerUpdateManyWithWhereWithoutGameInput>;
    deleteMany?: Enumerable<Game_PlayerScalarWhereInput>;
  };

  export type GameCreateNestedOneWithoutPlayersInput = {
    create?: XOR<
      GameCreateWithoutPlayersInput,
      GameUncheckedCreateWithoutPlayersInput
    >;
    connectOrCreate?: GameCreateOrConnectWithoutPlayersInput;
    connect?: GameWhereUniqueInput;
  };

  export type PlayerCreateNestedOneWithoutGamesInput = {
    create?: XOR<
      PlayerCreateWithoutGamesInput,
      PlayerUncheckedCreateWithoutGamesInput
    >;
    connectOrCreate?: PlayerCreateOrConnectWithoutGamesInput;
    connect?: PlayerWhereUniqueInput;
  };

  export type GameUpdateOneRequiredWithoutPlayersNestedInput = {
    create?: XOR<
      GameCreateWithoutPlayersInput,
      GameUncheckedCreateWithoutPlayersInput
    >;
    connectOrCreate?: GameCreateOrConnectWithoutPlayersInput;
    upsert?: GameUpsertWithoutPlayersInput;
    connect?: GameWhereUniqueInput;
    update?: XOR<
      GameUpdateWithoutPlayersInput,
      GameUncheckedUpdateWithoutPlayersInput
    >;
  };

  export type PlayerUpdateOneRequiredWithoutGamesNestedInput = {
    create?: XOR<
      PlayerCreateWithoutGamesInput,
      PlayerUncheckedCreateWithoutGamesInput
    >;
    connectOrCreate?: PlayerCreateOrConnectWithoutGamesInput;
    upsert?: PlayerUpsertWithoutGamesInput;
    connect?: PlayerWhereUniqueInput;
    update?: XOR<
      PlayerUpdateWithoutGamesInput,
      PlayerUncheckedUpdateWithoutGamesInput
    >;
  };

  export type NestedIntFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntFilter | number;
  };

  export type NestedBigIntFilter = {
    equals?: bigint | number;
    in?: Enumerable<bigint> | Enumerable<number>;
    notIn?: Enumerable<bigint> | Enumerable<number>;
    lt?: bigint | number;
    lte?: bigint | number;
    gt?: bigint | number;
    gte?: bigint | number;
    not?: NestedBigIntFilter | bigint | number;
  };

  export type NestedStringFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    not?: NestedStringFilter | string;
  };

  export type NestedIntWithAggregatesFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedIntWithAggregatesFilter | number;
    _count?: NestedIntFilter;
    _avg?: NestedFloatFilter;
    _sum?: NestedIntFilter;
    _min?: NestedIntFilter;
    _max?: NestedIntFilter;
  };

  export type NestedFloatFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedFloatFilter | number;
  };

  export type NestedBigIntWithAggregatesFilter = {
    equals?: bigint | number;
    in?: Enumerable<bigint> | Enumerable<number>;
    notIn?: Enumerable<bigint> | Enumerable<number>;
    lt?: bigint | number;
    lte?: bigint | number;
    gt?: bigint | number;
    gte?: bigint | number;
    not?: NestedBigIntWithAggregatesFilter | bigint | number;
    _count?: NestedIntFilter;
    _avg?: NestedFloatFilter;
    _sum?: NestedBigIntFilter;
    _min?: NestedBigIntFilter;
    _max?: NestedBigIntFilter;
  };

  export type NestedStringWithAggregatesFilter = {
    equals?: string;
    in?: Enumerable<string>;
    notIn?: Enumerable<string>;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    not?: NestedStringWithAggregatesFilter | string;
    _count?: NestedIntFilter;
    _min?: NestedStringFilter;
    _max?: NestedStringFilter;
  };

  export type NestedFloatWithAggregatesFilter = {
    equals?: number;
    in?: Enumerable<number>;
    notIn?: Enumerable<number>;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    not?: NestedFloatWithAggregatesFilter | number;
    _count?: NestedIntFilter;
    _avg?: NestedFloatFilter;
    _sum?: NestedFloatFilter;
    _min?: NestedFloatFilter;
    _max?: NestedFloatFilter;
  };

  export type NestedBoolFilter = {
    equals?: boolean;
    not?: NestedBoolFilter | boolean;
  };

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean;
    not?: NestedBoolWithAggregatesFilter | boolean;
    _count?: NestedIntFilter;
    _min?: NestedBoolFilter;
    _max?: NestedBoolFilter;
  };

  export type AccountCreateWithoutPlayerInput = {
    puuid: string;
  };

  export type AccountUncheckedCreateWithoutPlayerInput = {
    id?: number;
    puuid: string;
  };

  export type AccountCreateOrConnectWithoutPlayerInput = {
    where: AccountWhereUniqueInput;
    create: XOR<
      AccountCreateWithoutPlayerInput,
      AccountUncheckedCreateWithoutPlayerInput
    >;
  };

  export type AccountCreateManyPlayerInputEnvelope = {
    data: Enumerable<AccountCreateManyPlayerInput>;
    skipDuplicates?: boolean;
  };

  export type Game_PlayerCreateWithoutPlayerInput = {
    game: GameCreateNestedOneWithoutPlayersInput;
    role: string;
    blue_side: boolean;
  };

  export type Game_PlayerUncheckedCreateWithoutPlayerInput = {
    id?: number;
    game_id: number;
    role: string;
    blue_side: boolean;
  };

  export type Game_PlayerCreateOrConnectWithoutPlayerInput = {
    where: Game_PlayerWhereUniqueInput;
    create: XOR<
      Game_PlayerCreateWithoutPlayerInput,
      Game_PlayerUncheckedCreateWithoutPlayerInput
    >;
  };

  export type Game_PlayerCreateManyPlayerInputEnvelope = {
    data: Enumerable<Game_PlayerCreateManyPlayerInput>;
    skipDuplicates?: boolean;
  };

  export type AccountUpsertWithWhereUniqueWithoutPlayerInput = {
    where: AccountWhereUniqueInput;
    update: XOR<
      AccountUpdateWithoutPlayerInput,
      AccountUncheckedUpdateWithoutPlayerInput
    >;
    create: XOR<
      AccountCreateWithoutPlayerInput,
      AccountUncheckedCreateWithoutPlayerInput
    >;
  };

  export type AccountUpdateWithWhereUniqueWithoutPlayerInput = {
    where: AccountWhereUniqueInput;
    data: XOR<
      AccountUpdateWithoutPlayerInput,
      AccountUncheckedUpdateWithoutPlayerInput
    >;
  };

  export type AccountUpdateManyWithWhereWithoutPlayerInput = {
    where: AccountScalarWhereInput;
    data: XOR<
      AccountUpdateManyMutationInput,
      AccountUncheckedUpdateManyWithoutAccountsInput
    >;
  };

  export type AccountScalarWhereInput = {
    AND?: Enumerable<AccountScalarWhereInput>;
    OR?: Enumerable<AccountScalarWhereInput>;
    NOT?: Enumerable<AccountScalarWhereInput>;
    id?: IntFilter | number;
    puuid?: StringFilter | string;
    player_id?: BigIntFilter | bigint | number;
  };

  export type Game_PlayerUpsertWithWhereUniqueWithoutPlayerInput = {
    where: Game_PlayerWhereUniqueInput;
    update: XOR<
      Game_PlayerUpdateWithoutPlayerInput,
      Game_PlayerUncheckedUpdateWithoutPlayerInput
    >;
    create: XOR<
      Game_PlayerCreateWithoutPlayerInput,
      Game_PlayerUncheckedCreateWithoutPlayerInput
    >;
  };

  export type Game_PlayerUpdateWithWhereUniqueWithoutPlayerInput = {
    where: Game_PlayerWhereUniqueInput;
    data: XOR<
      Game_PlayerUpdateWithoutPlayerInput,
      Game_PlayerUncheckedUpdateWithoutPlayerInput
    >;
  };

  export type Game_PlayerUpdateManyWithWhereWithoutPlayerInput = {
    where: Game_PlayerScalarWhereInput;
    data: XOR<
      Game_PlayerUpdateManyMutationInput,
      Game_PlayerUncheckedUpdateManyWithoutGamesInput
    >;
  };

  export type Game_PlayerScalarWhereInput = {
    AND?: Enumerable<Game_PlayerScalarWhereInput>;
    OR?: Enumerable<Game_PlayerScalarWhereInput>;
    NOT?: Enumerable<Game_PlayerScalarWhereInput>;
    id?: IntFilter | number;
    game_id?: IntFilter | number;
    role?: StringFilter | string;
    blue_side?: BoolFilter | boolean;
    player_id?: BigIntFilter | bigint | number;
  };

  export type PlayerCreateWithoutAccountsInput = {
    discord_id: bigint | number;
    games?: Game_PlayerCreateNestedManyWithoutPlayerInput;
    mu: number;
    sigma: number;
  };

  export type PlayerUncheckedCreateWithoutAccountsInput = {
    id?: number;
    discord_id: bigint | number;
    games?: Game_PlayerUncheckedCreateNestedManyWithoutPlayerInput;
    mu: number;
    sigma: number;
  };

  export type PlayerCreateOrConnectWithoutAccountsInput = {
    where: PlayerWhereUniqueInput;
    create: XOR<
      PlayerCreateWithoutAccountsInput,
      PlayerUncheckedCreateWithoutAccountsInput
    >;
  };

  export type PlayerUpsertWithoutAccountsInput = {
    update: XOR<
      PlayerUpdateWithoutAccountsInput,
      PlayerUncheckedUpdateWithoutAccountsInput
    >;
    create: XOR<
      PlayerCreateWithoutAccountsInput,
      PlayerUncheckedCreateWithoutAccountsInput
    >;
  };

  export type PlayerUpdateWithoutAccountsInput = {
    discord_id?: BigIntFieldUpdateOperationsInput | bigint | number;
    games?: Game_PlayerUpdateManyWithoutPlayerNestedInput;
    mu?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
  };

  export type PlayerUncheckedUpdateWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number;
    discord_id?: BigIntFieldUpdateOperationsInput | bigint | number;
    games?: Game_PlayerUncheckedUpdateManyWithoutPlayerNestedInput;
    mu?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
  };

  export type Game_PlayerCreateWithoutGameInput = {
    role: string;
    blue_side: boolean;
    player: PlayerCreateNestedOneWithoutGamesInput;
  };

  export type Game_PlayerUncheckedCreateWithoutGameInput = {
    id?: number;
    role: string;
    blue_side: boolean;
    player_id: bigint | number;
  };

  export type Game_PlayerCreateOrConnectWithoutGameInput = {
    where: Game_PlayerWhereUniqueInput;
    create: XOR<
      Game_PlayerCreateWithoutGameInput,
      Game_PlayerUncheckedCreateWithoutGameInput
    >;
  };

  export type Game_PlayerCreateManyGameInputEnvelope = {
    data: Enumerable<Game_PlayerCreateManyGameInput>;
    skipDuplicates?: boolean;
  };

  export type Game_PlayerUpsertWithWhereUniqueWithoutGameInput = {
    where: Game_PlayerWhereUniqueInput;
    update: XOR<
      Game_PlayerUpdateWithoutGameInput,
      Game_PlayerUncheckedUpdateWithoutGameInput
    >;
    create: XOR<
      Game_PlayerCreateWithoutGameInput,
      Game_PlayerUncheckedCreateWithoutGameInput
    >;
  };

  export type Game_PlayerUpdateWithWhereUniqueWithoutGameInput = {
    where: Game_PlayerWhereUniqueInput;
    data: XOR<
      Game_PlayerUpdateWithoutGameInput,
      Game_PlayerUncheckedUpdateWithoutGameInput
    >;
  };

  export type Game_PlayerUpdateManyWithWhereWithoutGameInput = {
    where: Game_PlayerScalarWhereInput;
    data: XOR<
      Game_PlayerUpdateManyMutationInput,
      Game_PlayerUncheckedUpdateManyWithoutPlayersInput
    >;
  };

  export type GameCreateWithoutPlayersInput = {
    winner: boolean;
  };

  export type GameUncheckedCreateWithoutPlayersInput = {
    id?: number;
    winner: boolean;
  };

  export type GameCreateOrConnectWithoutPlayersInput = {
    where: GameWhereUniqueInput;
    create: XOR<
      GameCreateWithoutPlayersInput,
      GameUncheckedCreateWithoutPlayersInput
    >;
  };

  export type PlayerCreateWithoutGamesInput = {
    discord_id: bigint | number;
    accounts?: AccountCreateNestedManyWithoutPlayerInput;
    mu: number;
    sigma: number;
  };

  export type PlayerUncheckedCreateWithoutGamesInput = {
    id?: number;
    discord_id: bigint | number;
    accounts?: AccountUncheckedCreateNestedManyWithoutPlayerInput;
    mu: number;
    sigma: number;
  };

  export type PlayerCreateOrConnectWithoutGamesInput = {
    where: PlayerWhereUniqueInput;
    create: XOR<
      PlayerCreateWithoutGamesInput,
      PlayerUncheckedCreateWithoutGamesInput
    >;
  };

  export type GameUpsertWithoutPlayersInput = {
    update: XOR<
      GameUpdateWithoutPlayersInput,
      GameUncheckedUpdateWithoutPlayersInput
    >;
    create: XOR<
      GameCreateWithoutPlayersInput,
      GameUncheckedCreateWithoutPlayersInput
    >;
  };

  export type GameUpdateWithoutPlayersInput = {
    winner?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type GameUncheckedUpdateWithoutPlayersInput = {
    id?: IntFieldUpdateOperationsInput | number;
    winner?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type PlayerUpsertWithoutGamesInput = {
    update: XOR<
      PlayerUpdateWithoutGamesInput,
      PlayerUncheckedUpdateWithoutGamesInput
    >;
    create: XOR<
      PlayerCreateWithoutGamesInput,
      PlayerUncheckedCreateWithoutGamesInput
    >;
  };

  export type PlayerUpdateWithoutGamesInput = {
    discord_id?: BigIntFieldUpdateOperationsInput | bigint | number;
    accounts?: AccountUpdateManyWithoutPlayerNestedInput;
    mu?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
  };

  export type PlayerUncheckedUpdateWithoutGamesInput = {
    id?: IntFieldUpdateOperationsInput | number;
    discord_id?: BigIntFieldUpdateOperationsInput | bigint | number;
    accounts?: AccountUncheckedUpdateManyWithoutPlayerNestedInput;
    mu?: FloatFieldUpdateOperationsInput | number;
    sigma?: FloatFieldUpdateOperationsInput | number;
  };

  export type AccountCreateManyPlayerInput = {
    id?: number;
    puuid: string;
  };

  export type Game_PlayerCreateManyPlayerInput = {
    id?: number;
    game_id: number;
    role: string;
    blue_side: boolean;
  };

  export type AccountUpdateWithoutPlayerInput = {
    puuid?: StringFieldUpdateOperationsInput | string;
  };

  export type AccountUncheckedUpdateWithoutPlayerInput = {
    id?: IntFieldUpdateOperationsInput | number;
    puuid?: StringFieldUpdateOperationsInput | string;
  };

  export type AccountUncheckedUpdateManyWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number;
    puuid?: StringFieldUpdateOperationsInput | string;
  };

  export type Game_PlayerUpdateWithoutPlayerInput = {
    game?: GameUpdateOneRequiredWithoutPlayersNestedInput;
    role?: StringFieldUpdateOperationsInput | string;
    blue_side?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type Game_PlayerUncheckedUpdateWithoutPlayerInput = {
    id?: IntFieldUpdateOperationsInput | number;
    game_id?: IntFieldUpdateOperationsInput | number;
    role?: StringFieldUpdateOperationsInput | string;
    blue_side?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type Game_PlayerUncheckedUpdateManyWithoutGamesInput = {
    id?: IntFieldUpdateOperationsInput | number;
    game_id?: IntFieldUpdateOperationsInput | number;
    role?: StringFieldUpdateOperationsInput | string;
    blue_side?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type Game_PlayerCreateManyGameInput = {
    id?: number;
    role: string;
    blue_side: boolean;
    player_id: bigint | number;
  };

  export type Game_PlayerUpdateWithoutGameInput = {
    role?: StringFieldUpdateOperationsInput | string;
    blue_side?: BoolFieldUpdateOperationsInput | boolean;
    player?: PlayerUpdateOneRequiredWithoutGamesNestedInput;
  };

  export type Game_PlayerUncheckedUpdateWithoutGameInput = {
    id?: IntFieldUpdateOperationsInput | number;
    role?: StringFieldUpdateOperationsInput | string;
    blue_side?: BoolFieldUpdateOperationsInput | boolean;
    player_id?: BigIntFieldUpdateOperationsInput | bigint | number;
  };

  export type Game_PlayerUncheckedUpdateManyWithoutPlayersInput = {
    id?: IntFieldUpdateOperationsInput | number;
    role?: StringFieldUpdateOperationsInput | string;
    blue_side?: BoolFieldUpdateOperationsInput | boolean;
    player_id?: BigIntFieldUpdateOperationsInput | bigint | number;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
