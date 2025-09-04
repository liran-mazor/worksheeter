
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Worksheet
 * 
 */
export type Worksheet = $Result.DefaultSelection<Prisma.$WorksheetPayload>
/**
 * Model Quiz
 * 
 */
export type Quiz = $Result.DefaultSelection<Prisma.$QuizPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const QuizStatus: {
  PROCESSING: 'PROCESSING',
  AVAILABLE: 'AVAILABLE',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type QuizStatus = (typeof QuizStatus)[keyof typeof QuizStatus]


export const Difficulty: {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED'
};

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty]

}

export type QuizStatus = $Enums.QuizStatus

export const QuizStatus: typeof $Enums.QuizStatus

export type Difficulty = $Enums.Difficulty

export const Difficulty: typeof $Enums.Difficulty

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Worksheets
 * const worksheets = await prisma.worksheet.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Worksheets
   * const worksheets = await prisma.worksheet.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

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
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

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
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


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
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.worksheet`: Exposes CRUD operations for the **Worksheet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Worksheets
    * const worksheets = await prisma.worksheet.findMany()
    * ```
    */
  get worksheet(): Prisma.WorksheetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.quiz`: Exposes CRUD operations for the **Quiz** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Quizzes
    * const quizzes = await prisma.quiz.findMany()
    * ```
    */
  get quiz(): Prisma.QuizDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.10.1
   * Query Engine version: 9b628578b3b7cae625e8c927178f15a170e74a9c
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

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
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Worksheet: 'Worksheet',
    Quiz: 'Quiz'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "worksheet" | "quiz"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Worksheet: {
        payload: Prisma.$WorksheetPayload<ExtArgs>
        fields: Prisma.WorksheetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorksheetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorksheetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorksheetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorksheetPayload>
          }
          findFirst: {
            args: Prisma.WorksheetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorksheetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorksheetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorksheetPayload>
          }
          findMany: {
            args: Prisma.WorksheetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorksheetPayload>[]
          }
          create: {
            args: Prisma.WorksheetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorksheetPayload>
          }
          createMany: {
            args: Prisma.WorksheetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorksheetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorksheetPayload>[]
          }
          delete: {
            args: Prisma.WorksheetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorksheetPayload>
          }
          update: {
            args: Prisma.WorksheetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorksheetPayload>
          }
          deleteMany: {
            args: Prisma.WorksheetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorksheetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorksheetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorksheetPayload>[]
          }
          upsert: {
            args: Prisma.WorksheetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorksheetPayload>
          }
          aggregate: {
            args: Prisma.WorksheetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorksheet>
          }
          groupBy: {
            args: Prisma.WorksheetGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorksheetGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorksheetCountArgs<ExtArgs>
            result: $Utils.Optional<WorksheetCountAggregateOutputType> | number
          }
        }
      }
      Quiz: {
        payload: Prisma.$QuizPayload<ExtArgs>
        fields: Prisma.QuizFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuizFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuizFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          findFirst: {
            args: Prisma.QuizFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuizFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          findMany: {
            args: Prisma.QuizFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>[]
          }
          create: {
            args: Prisma.QuizCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          createMany: {
            args: Prisma.QuizCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuizCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>[]
          }
          delete: {
            args: Prisma.QuizDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          update: {
            args: Prisma.QuizUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          deleteMany: {
            args: Prisma.QuizDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuizUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuizUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>[]
          }
          upsert: {
            args: Prisma.QuizUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuizPayload>
          }
          aggregate: {
            args: Prisma.QuizAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuiz>
          }
          groupBy: {
            args: Prisma.QuizGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuizGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuizCountArgs<ExtArgs>
            result: $Utils.Optional<QuizCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    worksheet?: WorksheetOmit
    quiz?: QuizOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type WorksheetCountOutputType
   */

  export type WorksheetCountOutputType = {
    quizzes: number
  }

  export type WorksheetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizzes?: boolean | WorksheetCountOutputTypeCountQuizzesArgs
  }

  // Custom InputTypes
  /**
   * WorksheetCountOutputType without action
   */
  export type WorksheetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorksheetCountOutputType
     */
    select?: WorksheetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorksheetCountOutputType without action
   */
  export type WorksheetCountOutputTypeCountQuizzesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Worksheet
   */

  export type AggregateWorksheet = {
    _count: WorksheetCountAggregateOutputType | null
    _avg: WorksheetAvgAggregateOutputType | null
    _sum: WorksheetSumAggregateOutputType | null
    _min: WorksheetMinAggregateOutputType | null
    _max: WorksheetMaxAggregateOutputType | null
  }

  export type WorksheetAvgAggregateOutputType = {
    version: number | null
  }

  export type WorksheetSumAggregateOutputType = {
    version: number | null
  }

  export type WorksheetMinAggregateOutputType = {
    id: string | null
    title: string | null
    userId: string | null
    keywords: string | null
    version: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorksheetMaxAggregateOutputType = {
    id: string | null
    title: string | null
    userId: string | null
    keywords: string | null
    version: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorksheetCountAggregateOutputType = {
    id: number
    title: number
    userId: number
    keywords: number
    version: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorksheetAvgAggregateInputType = {
    version?: true
  }

  export type WorksheetSumAggregateInputType = {
    version?: true
  }

  export type WorksheetMinAggregateInputType = {
    id?: true
    title?: true
    userId?: true
    keywords?: true
    version?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorksheetMaxAggregateInputType = {
    id?: true
    title?: true
    userId?: true
    keywords?: true
    version?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorksheetCountAggregateInputType = {
    id?: true
    title?: true
    userId?: true
    keywords?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorksheetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Worksheet to aggregate.
     */
    where?: WorksheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Worksheets to fetch.
     */
    orderBy?: WorksheetOrderByWithRelationInput | WorksheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorksheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Worksheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Worksheets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Worksheets
    **/
    _count?: true | WorksheetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WorksheetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WorksheetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorksheetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorksheetMaxAggregateInputType
  }

  export type GetWorksheetAggregateType<T extends WorksheetAggregateArgs> = {
        [P in keyof T & keyof AggregateWorksheet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorksheet[P]>
      : GetScalarType<T[P], AggregateWorksheet[P]>
  }




  export type WorksheetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorksheetWhereInput
    orderBy?: WorksheetOrderByWithAggregationInput | WorksheetOrderByWithAggregationInput[]
    by: WorksheetScalarFieldEnum[] | WorksheetScalarFieldEnum
    having?: WorksheetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorksheetCountAggregateInputType | true
    _avg?: WorksheetAvgAggregateInputType
    _sum?: WorksheetSumAggregateInputType
    _min?: WorksheetMinAggregateInputType
    _max?: WorksheetMaxAggregateInputType
  }

  export type WorksheetGroupByOutputType = {
    id: string
    title: string
    userId: string
    keywords: string
    version: number
    createdAt: Date
    updatedAt: Date
    _count: WorksheetCountAggregateOutputType | null
    _avg: WorksheetAvgAggregateOutputType | null
    _sum: WorksheetSumAggregateOutputType | null
    _min: WorksheetMinAggregateOutputType | null
    _max: WorksheetMaxAggregateOutputType | null
  }

  type GetWorksheetGroupByPayload<T extends WorksheetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorksheetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorksheetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorksheetGroupByOutputType[P]>
            : GetScalarType<T[P], WorksheetGroupByOutputType[P]>
        }
      >
    >


  export type WorksheetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    userId?: boolean
    keywords?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    quizzes?: boolean | Worksheet$quizzesArgs<ExtArgs>
    _count?: boolean | WorksheetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["worksheet"]>

  export type WorksheetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    userId?: boolean
    keywords?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["worksheet"]>

  export type WorksheetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    userId?: boolean
    keywords?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["worksheet"]>

  export type WorksheetSelectScalar = {
    id?: boolean
    title?: boolean
    userId?: boolean
    keywords?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorksheetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "userId" | "keywords" | "version" | "createdAt" | "updatedAt", ExtArgs["result"]["worksheet"]>
  export type WorksheetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    quizzes?: boolean | Worksheet$quizzesArgs<ExtArgs>
    _count?: boolean | WorksheetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorksheetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type WorksheetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $WorksheetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Worksheet"
    objects: {
      quizzes: Prisma.$QuizPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      userId: string
      keywords: string
      version: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["worksheet"]>
    composites: {}
  }

  type WorksheetGetPayload<S extends boolean | null | undefined | WorksheetDefaultArgs> = $Result.GetResult<Prisma.$WorksheetPayload, S>

  type WorksheetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorksheetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorksheetCountAggregateInputType | true
    }

  export interface WorksheetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Worksheet'], meta: { name: 'Worksheet' } }
    /**
     * Find zero or one Worksheet that matches the filter.
     * @param {WorksheetFindUniqueArgs} args - Arguments to find a Worksheet
     * @example
     * // Get one Worksheet
     * const worksheet = await prisma.worksheet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorksheetFindUniqueArgs>(args: SelectSubset<T, WorksheetFindUniqueArgs<ExtArgs>>): Prisma__WorksheetClient<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Worksheet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorksheetFindUniqueOrThrowArgs} args - Arguments to find a Worksheet
     * @example
     * // Get one Worksheet
     * const worksheet = await prisma.worksheet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorksheetFindUniqueOrThrowArgs>(args: SelectSubset<T, WorksheetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorksheetClient<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Worksheet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorksheetFindFirstArgs} args - Arguments to find a Worksheet
     * @example
     * // Get one Worksheet
     * const worksheet = await prisma.worksheet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorksheetFindFirstArgs>(args?: SelectSubset<T, WorksheetFindFirstArgs<ExtArgs>>): Prisma__WorksheetClient<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Worksheet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorksheetFindFirstOrThrowArgs} args - Arguments to find a Worksheet
     * @example
     * // Get one Worksheet
     * const worksheet = await prisma.worksheet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorksheetFindFirstOrThrowArgs>(args?: SelectSubset<T, WorksheetFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorksheetClient<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Worksheets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorksheetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Worksheets
     * const worksheets = await prisma.worksheet.findMany()
     * 
     * // Get first 10 Worksheets
     * const worksheets = await prisma.worksheet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const worksheetWithIdOnly = await prisma.worksheet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorksheetFindManyArgs>(args?: SelectSubset<T, WorksheetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Worksheet.
     * @param {WorksheetCreateArgs} args - Arguments to create a Worksheet.
     * @example
     * // Create one Worksheet
     * const Worksheet = await prisma.worksheet.create({
     *   data: {
     *     // ... data to create a Worksheet
     *   }
     * })
     * 
     */
    create<T extends WorksheetCreateArgs>(args: SelectSubset<T, WorksheetCreateArgs<ExtArgs>>): Prisma__WorksheetClient<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Worksheets.
     * @param {WorksheetCreateManyArgs} args - Arguments to create many Worksheets.
     * @example
     * // Create many Worksheets
     * const worksheet = await prisma.worksheet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorksheetCreateManyArgs>(args?: SelectSubset<T, WorksheetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Worksheets and returns the data saved in the database.
     * @param {WorksheetCreateManyAndReturnArgs} args - Arguments to create many Worksheets.
     * @example
     * // Create many Worksheets
     * const worksheet = await prisma.worksheet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Worksheets and only return the `id`
     * const worksheetWithIdOnly = await prisma.worksheet.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorksheetCreateManyAndReturnArgs>(args?: SelectSubset<T, WorksheetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Worksheet.
     * @param {WorksheetDeleteArgs} args - Arguments to delete one Worksheet.
     * @example
     * // Delete one Worksheet
     * const Worksheet = await prisma.worksheet.delete({
     *   where: {
     *     // ... filter to delete one Worksheet
     *   }
     * })
     * 
     */
    delete<T extends WorksheetDeleteArgs>(args: SelectSubset<T, WorksheetDeleteArgs<ExtArgs>>): Prisma__WorksheetClient<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Worksheet.
     * @param {WorksheetUpdateArgs} args - Arguments to update one Worksheet.
     * @example
     * // Update one Worksheet
     * const worksheet = await prisma.worksheet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorksheetUpdateArgs>(args: SelectSubset<T, WorksheetUpdateArgs<ExtArgs>>): Prisma__WorksheetClient<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Worksheets.
     * @param {WorksheetDeleteManyArgs} args - Arguments to filter Worksheets to delete.
     * @example
     * // Delete a few Worksheets
     * const { count } = await prisma.worksheet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorksheetDeleteManyArgs>(args?: SelectSubset<T, WorksheetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Worksheets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorksheetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Worksheets
     * const worksheet = await prisma.worksheet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorksheetUpdateManyArgs>(args: SelectSubset<T, WorksheetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Worksheets and returns the data updated in the database.
     * @param {WorksheetUpdateManyAndReturnArgs} args - Arguments to update many Worksheets.
     * @example
     * // Update many Worksheets
     * const worksheet = await prisma.worksheet.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Worksheets and only return the `id`
     * const worksheetWithIdOnly = await prisma.worksheet.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorksheetUpdateManyAndReturnArgs>(args: SelectSubset<T, WorksheetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Worksheet.
     * @param {WorksheetUpsertArgs} args - Arguments to update or create a Worksheet.
     * @example
     * // Update or create a Worksheet
     * const worksheet = await prisma.worksheet.upsert({
     *   create: {
     *     // ... data to create a Worksheet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Worksheet we want to update
     *   }
     * })
     */
    upsert<T extends WorksheetUpsertArgs>(args: SelectSubset<T, WorksheetUpsertArgs<ExtArgs>>): Prisma__WorksheetClient<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Worksheets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorksheetCountArgs} args - Arguments to filter Worksheets to count.
     * @example
     * // Count the number of Worksheets
     * const count = await prisma.worksheet.count({
     *   where: {
     *     // ... the filter for the Worksheets we want to count
     *   }
     * })
    **/
    count<T extends WorksheetCountArgs>(
      args?: Subset<T, WorksheetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorksheetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Worksheet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorksheetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    **/
    aggregate<T extends WorksheetAggregateArgs>(args: Subset<T, WorksheetAggregateArgs>): Prisma.PrismaPromise<GetWorksheetAggregateType<T>>

    /**
     * Group by Worksheet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorksheetGroupByArgs} args - Group by arguments.
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
     * 
    **/
    groupBy<
      T extends WorksheetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorksheetGroupByArgs['orderBy'] }
        : { orderBy?: WorksheetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorksheetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorksheetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Worksheet model
   */
  readonly fields: WorksheetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Worksheet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorksheetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    quizzes<T extends Worksheet$quizzesArgs<ExtArgs> = {}>(args?: Subset<T, Worksheet$quizzesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Worksheet model
   */
  interface WorksheetFieldRefs {
    readonly id: FieldRef<"Worksheet", 'String'>
    readonly title: FieldRef<"Worksheet", 'String'>
    readonly userId: FieldRef<"Worksheet", 'String'>
    readonly keywords: FieldRef<"Worksheet", 'String'>
    readonly version: FieldRef<"Worksheet", 'Int'>
    readonly createdAt: FieldRef<"Worksheet", 'DateTime'>
    readonly updatedAt: FieldRef<"Worksheet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Worksheet findUnique
   */
  export type WorksheetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorksheetInclude<ExtArgs> | null
    /**
     * Filter, which Worksheet to fetch.
     */
    where: WorksheetWhereUniqueInput
  }

  /**
   * Worksheet findUniqueOrThrow
   */
  export type WorksheetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorksheetInclude<ExtArgs> | null
    /**
     * Filter, which Worksheet to fetch.
     */
    where: WorksheetWhereUniqueInput
  }

  /**
   * Worksheet findFirst
   */
  export type WorksheetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorksheetInclude<ExtArgs> | null
    /**
     * Filter, which Worksheet to fetch.
     */
    where?: WorksheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Worksheets to fetch.
     */
    orderBy?: WorksheetOrderByWithRelationInput | WorksheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Worksheets.
     */
    cursor?: WorksheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Worksheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Worksheets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Worksheets.
     */
    distinct?: WorksheetScalarFieldEnum | WorksheetScalarFieldEnum[]
  }

  /**
   * Worksheet findFirstOrThrow
   */
  export type WorksheetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorksheetInclude<ExtArgs> | null
    /**
     * Filter, which Worksheet to fetch.
     */
    where?: WorksheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Worksheets to fetch.
     */
    orderBy?: WorksheetOrderByWithRelationInput | WorksheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Worksheets.
     */
    cursor?: WorksheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Worksheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Worksheets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Worksheets.
     */
    distinct?: WorksheetScalarFieldEnum | WorksheetScalarFieldEnum[]
  }

  /**
   * Worksheet findMany
   */
  export type WorksheetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorksheetInclude<ExtArgs> | null
    /**
     * Filter, which Worksheets to fetch.
     */
    where?: WorksheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Worksheets to fetch.
     */
    orderBy?: WorksheetOrderByWithRelationInput | WorksheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Worksheets.
     */
    cursor?: WorksheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Worksheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Worksheets.
     */
    skip?: number
    distinct?: WorksheetScalarFieldEnum | WorksheetScalarFieldEnum[]
  }

  /**
   * Worksheet create
   */
  export type WorksheetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorksheetInclude<ExtArgs> | null
    /**
     * The data needed to create a Worksheet.
     */
    data: XOR<WorksheetCreateInput, WorksheetUncheckedCreateInput>
  }

  /**
   * Worksheet createMany
   */
  export type WorksheetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Worksheets.
     */
    data: WorksheetCreateManyInput | WorksheetCreateManyInput[]
  }

  /**
   * Worksheet createManyAndReturn
   */
  export type WorksheetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * The data used to create many Worksheets.
     */
    data: WorksheetCreateManyInput | WorksheetCreateManyInput[]
  }

  /**
   * Worksheet update
   */
  export type WorksheetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorksheetInclude<ExtArgs> | null
    /**
     * The data needed to update a Worksheet.
     */
    data: XOR<WorksheetUpdateInput, WorksheetUncheckedUpdateInput>
    /**
     * Choose, which Worksheet to update.
     */
    where: WorksheetWhereUniqueInput
  }

  /**
   * Worksheet updateMany
   */
  export type WorksheetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Worksheets.
     */
    data: XOR<WorksheetUpdateManyMutationInput, WorksheetUncheckedUpdateManyInput>
    /**
     * Filter which Worksheets to update
     */
    where?: WorksheetWhereInput
    /**
     * Limit how many Worksheets to update.
     */
    limit?: number
  }

  /**
   * Worksheet updateManyAndReturn
   */
  export type WorksheetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * The data used to update Worksheets.
     */
    data: XOR<WorksheetUpdateManyMutationInput, WorksheetUncheckedUpdateManyInput>
    /**
     * Filter which Worksheets to update
     */
    where?: WorksheetWhereInput
    /**
     * Limit how many Worksheets to update.
     */
    limit?: number
  }

  /**
   * Worksheet upsert
   */
  export type WorksheetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorksheetInclude<ExtArgs> | null
    /**
     * The filter to search for the Worksheet to update in case it exists.
     */
    where: WorksheetWhereUniqueInput
    /**
     * In case the Worksheet found by the `where` argument doesn't exist, create a new Worksheet with this data.
     */
    create: XOR<WorksheetCreateInput, WorksheetUncheckedCreateInput>
    /**
     * In case the Worksheet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorksheetUpdateInput, WorksheetUncheckedUpdateInput>
  }

  /**
   * Worksheet delete
   */
  export type WorksheetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorksheetInclude<ExtArgs> | null
    /**
     * Filter which Worksheet to delete.
     */
    where: WorksheetWhereUniqueInput
  }

  /**
   * Worksheet deleteMany
   */
  export type WorksheetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Worksheets to delete
     */
    where?: WorksheetWhereInput
    /**
     * Limit how many Worksheets to delete.
     */
    limit?: number
  }

  /**
   * Worksheet.quizzes
   */
  export type Worksheet$quizzesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    where?: QuizWhereInput
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    cursor?: QuizWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Worksheet without action
   */
  export type WorksheetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Worksheet
     */
    select?: WorksheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Worksheet
     */
    omit?: WorksheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorksheetInclude<ExtArgs> | null
  }


  /**
   * Model Quiz
   */

  export type AggregateQuiz = {
    _count: QuizCountAggregateOutputType | null
    _avg: QuizAvgAggregateOutputType | null
    _sum: QuizSumAggregateOutputType | null
    _min: QuizMinAggregateOutputType | null
    _max: QuizMaxAggregateOutputType | null
  }

  export type QuizAvgAggregateOutputType = {
    score: number | null
    version: number | null
  }

  export type QuizSumAggregateOutputType = {
    score: number | null
    version: number | null
  }

  export type QuizMinAggregateOutputType = {
    id: string | null
    worksheetId: string | null
    userId: string | null
    title: string | null
    difficulty: $Enums.Difficulty | null
    questions: string | null
    status: $Enums.QuizStatus | null
    score: number | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    version: number | null
  }

  export type QuizMaxAggregateOutputType = {
    id: string | null
    worksheetId: string | null
    userId: string | null
    title: string | null
    difficulty: $Enums.Difficulty | null
    questions: string | null
    status: $Enums.QuizStatus | null
    score: number | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    version: number | null
  }

  export type QuizCountAggregateOutputType = {
    id: number
    worksheetId: number
    userId: number
    title: number
    difficulty: number
    questions: number
    status: number
    score: number
    completedAt: number
    createdAt: number
    updatedAt: number
    version: number
    _all: number
  }


  export type QuizAvgAggregateInputType = {
    score?: true
    version?: true
  }

  export type QuizSumAggregateInputType = {
    score?: true
    version?: true
  }

  export type QuizMinAggregateInputType = {
    id?: true
    worksheetId?: true
    userId?: true
    title?: true
    difficulty?: true
    questions?: true
    status?: true
    score?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    version?: true
  }

  export type QuizMaxAggregateInputType = {
    id?: true
    worksheetId?: true
    userId?: true
    title?: true
    difficulty?: true
    questions?: true
    status?: true
    score?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    version?: true
  }

  export type QuizCountAggregateInputType = {
    id?: true
    worksheetId?: true
    userId?: true
    title?: true
    difficulty?: true
    questions?: true
    status?: true
    score?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    version?: true
    _all?: true
  }

  export type QuizAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quiz to aggregate.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Quizzes
    **/
    _count?: true | QuizCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuizAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuizSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuizMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuizMaxAggregateInputType
  }

  export type GetQuizAggregateType<T extends QuizAggregateArgs> = {
        [P in keyof T & keyof AggregateQuiz]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuiz[P]>
      : GetScalarType<T[P], AggregateQuiz[P]>
  }




  export type QuizGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuizWhereInput
    orderBy?: QuizOrderByWithAggregationInput | QuizOrderByWithAggregationInput[]
    by: QuizScalarFieldEnum[] | QuizScalarFieldEnum
    having?: QuizScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuizCountAggregateInputType | true
    _avg?: QuizAvgAggregateInputType
    _sum?: QuizSumAggregateInputType
    _min?: QuizMinAggregateInputType
    _max?: QuizMaxAggregateInputType
  }

  export type QuizGroupByOutputType = {
    id: string
    worksheetId: string
    userId: string
    title: string
    difficulty: $Enums.Difficulty
    questions: string
    status: $Enums.QuizStatus
    score: number | null
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    version: number
    _count: QuizCountAggregateOutputType | null
    _avg: QuizAvgAggregateOutputType | null
    _sum: QuizSumAggregateOutputType | null
    _min: QuizMinAggregateOutputType | null
    _max: QuizMaxAggregateOutputType | null
  }

  type GetQuizGroupByPayload<T extends QuizGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuizGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuizGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuizGroupByOutputType[P]>
            : GetScalarType<T[P], QuizGroupByOutputType[P]>
        }
      >
    >


  export type QuizSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    worksheetId?: boolean
    userId?: boolean
    title?: boolean
    difficulty?: boolean
    questions?: boolean
    status?: boolean
    score?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
    worksheet?: boolean | WorksheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quiz"]>

  export type QuizSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    worksheetId?: boolean
    userId?: boolean
    title?: boolean
    difficulty?: boolean
    questions?: boolean
    status?: boolean
    score?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
    worksheet?: boolean | WorksheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quiz"]>

  export type QuizSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    worksheetId?: boolean
    userId?: boolean
    title?: boolean
    difficulty?: boolean
    questions?: boolean
    status?: boolean
    score?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
    worksheet?: boolean | WorksheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["quiz"]>

  export type QuizSelectScalar = {
    id?: boolean
    worksheetId?: boolean
    userId?: boolean
    title?: boolean
    difficulty?: boolean
    questions?: boolean
    status?: boolean
    score?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
  }

  export type QuizOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "worksheetId" | "userId" | "title" | "difficulty" | "questions" | "status" | "score" | "completedAt" | "createdAt" | "updatedAt" | "version", ExtArgs["result"]["quiz"]>
  export type QuizInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    worksheet?: boolean | WorksheetDefaultArgs<ExtArgs>
  }
  export type QuizIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    worksheet?: boolean | WorksheetDefaultArgs<ExtArgs>
  }
  export type QuizIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    worksheet?: boolean | WorksheetDefaultArgs<ExtArgs>
  }

  export type $QuizPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Quiz"
    objects: {
      worksheet: Prisma.$WorksheetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      worksheetId: string
      userId: string
      title: string
      difficulty: $Enums.Difficulty
      questions: string
      status: $Enums.QuizStatus
      score: number | null
      completedAt: Date | null
      createdAt: Date
      updatedAt: Date
      version: number
    }, ExtArgs["result"]["quiz"]>
    composites: {}
  }

  type QuizGetPayload<S extends boolean | null | undefined | QuizDefaultArgs> = $Result.GetResult<Prisma.$QuizPayload, S>

  type QuizCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuizFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuizCountAggregateInputType | true
    }

  export interface QuizDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Quiz'], meta: { name: 'Quiz' } }
    /**
     * Find zero or one Quiz that matches the filter.
     * @param {QuizFindUniqueArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuizFindUniqueArgs>(args: SelectSubset<T, QuizFindUniqueArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Quiz that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuizFindUniqueOrThrowArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuizFindUniqueOrThrowArgs>(args: SelectSubset<T, QuizFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Quiz that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizFindFirstArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuizFindFirstArgs>(args?: SelectSubset<T, QuizFindFirstArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Quiz that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizFindFirstOrThrowArgs} args - Arguments to find a Quiz
     * @example
     * // Get one Quiz
     * const quiz = await prisma.quiz.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuizFindFirstOrThrowArgs>(args?: SelectSubset<T, QuizFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Quizzes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Quizzes
     * const quizzes = await prisma.quiz.findMany()
     * 
     * // Get first 10 Quizzes
     * const quizzes = await prisma.quiz.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quizWithIdOnly = await prisma.quiz.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuizFindManyArgs>(args?: SelectSubset<T, QuizFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Quiz.
     * @param {QuizCreateArgs} args - Arguments to create a Quiz.
     * @example
     * // Create one Quiz
     * const Quiz = await prisma.quiz.create({
     *   data: {
     *     // ... data to create a Quiz
     *   }
     * })
     * 
     */
    create<T extends QuizCreateArgs>(args: SelectSubset<T, QuizCreateArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Quizzes.
     * @param {QuizCreateManyArgs} args - Arguments to create many Quizzes.
     * @example
     * // Create many Quizzes
     * const quiz = await prisma.quiz.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuizCreateManyArgs>(args?: SelectSubset<T, QuizCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Quizzes and returns the data saved in the database.
     * @param {QuizCreateManyAndReturnArgs} args - Arguments to create many Quizzes.
     * @example
     * // Create many Quizzes
     * const quiz = await prisma.quiz.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Quizzes and only return the `id`
     * const quizWithIdOnly = await prisma.quiz.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuizCreateManyAndReturnArgs>(args?: SelectSubset<T, QuizCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Quiz.
     * @param {QuizDeleteArgs} args - Arguments to delete one Quiz.
     * @example
     * // Delete one Quiz
     * const Quiz = await prisma.quiz.delete({
     *   where: {
     *     // ... filter to delete one Quiz
     *   }
     * })
     * 
     */
    delete<T extends QuizDeleteArgs>(args: SelectSubset<T, QuizDeleteArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Quiz.
     * @param {QuizUpdateArgs} args - Arguments to update one Quiz.
     * @example
     * // Update one Quiz
     * const quiz = await prisma.quiz.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuizUpdateArgs>(args: SelectSubset<T, QuizUpdateArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Quizzes.
     * @param {QuizDeleteManyArgs} args - Arguments to filter Quizzes to delete.
     * @example
     * // Delete a few Quizzes
     * const { count } = await prisma.quiz.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuizDeleteManyArgs>(args?: SelectSubset<T, QuizDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quizzes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Quizzes
     * const quiz = await prisma.quiz.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuizUpdateManyArgs>(args: SelectSubset<T, QuizUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Quizzes and returns the data updated in the database.
     * @param {QuizUpdateManyAndReturnArgs} args - Arguments to update many Quizzes.
     * @example
     * // Update many Quizzes
     * const quiz = await prisma.quiz.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Quizzes and only return the `id`
     * const quizWithIdOnly = await prisma.quiz.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QuizUpdateManyAndReturnArgs>(args: SelectSubset<T, QuizUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Quiz.
     * @param {QuizUpsertArgs} args - Arguments to update or create a Quiz.
     * @example
     * // Update or create a Quiz
     * const quiz = await prisma.quiz.upsert({
     *   create: {
     *     // ... data to create a Quiz
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Quiz we want to update
     *   }
     * })
     */
    upsert<T extends QuizUpsertArgs>(args: SelectSubset<T, QuizUpsertArgs<ExtArgs>>): Prisma__QuizClient<$Result.GetResult<Prisma.$QuizPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Quizzes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizCountArgs} args - Arguments to filter Quizzes to count.
     * @example
     * // Count the number of Quizzes
     * const count = await prisma.quiz.count({
     *   where: {
     *     // ... the filter for the Quizzes we want to count
     *   }
     * })
    **/
    count<T extends QuizCountArgs>(
      args?: Subset<T, QuizCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuizCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Quiz.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    **/
    aggregate<T extends QuizAggregateArgs>(args: Subset<T, QuizAggregateArgs>): Prisma.PrismaPromise<GetQuizAggregateType<T>>

    /**
     * Group by Quiz.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuizGroupByArgs} args - Group by arguments.
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
     * 
    **/
    groupBy<
      T extends QuizGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuizGroupByArgs['orderBy'] }
        : { orderBy?: QuizGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuizGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuizGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Quiz model
   */
  readonly fields: QuizFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Quiz.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuizClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    worksheet<T extends WorksheetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorksheetDefaultArgs<ExtArgs>>): Prisma__WorksheetClient<$Result.GetResult<Prisma.$WorksheetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Quiz model
   */
  interface QuizFieldRefs {
    readonly id: FieldRef<"Quiz", 'String'>
    readonly worksheetId: FieldRef<"Quiz", 'String'>
    readonly userId: FieldRef<"Quiz", 'String'>
    readonly title: FieldRef<"Quiz", 'String'>
    readonly difficulty: FieldRef<"Quiz", 'Difficulty'>
    readonly questions: FieldRef<"Quiz", 'String'>
    readonly status: FieldRef<"Quiz", 'QuizStatus'>
    readonly score: FieldRef<"Quiz", 'Int'>
    readonly completedAt: FieldRef<"Quiz", 'DateTime'>
    readonly createdAt: FieldRef<"Quiz", 'DateTime'>
    readonly updatedAt: FieldRef<"Quiz", 'DateTime'>
    readonly version: FieldRef<"Quiz", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Quiz findUnique
   */
  export type QuizFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz findUniqueOrThrow
   */
  export type QuizFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz findFirst
   */
  export type QuizFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quizzes.
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quizzes.
     */
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Quiz findFirstOrThrow
   */
  export type QuizFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quiz to fetch.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Quizzes.
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Quizzes.
     */
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Quiz findMany
   */
  export type QuizFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter, which Quizzes to fetch.
     */
    where?: QuizWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Quizzes to fetch.
     */
    orderBy?: QuizOrderByWithRelationInput | QuizOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Quizzes.
     */
    cursor?: QuizWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Quizzes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Quizzes.
     */
    skip?: number
    distinct?: QuizScalarFieldEnum | QuizScalarFieldEnum[]
  }

  /**
   * Quiz create
   */
  export type QuizCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * The data needed to create a Quiz.
     */
    data: XOR<QuizCreateInput, QuizUncheckedCreateInput>
  }

  /**
   * Quiz createMany
   */
  export type QuizCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Quizzes.
     */
    data: QuizCreateManyInput | QuizCreateManyInput[]
  }

  /**
   * Quiz createManyAndReturn
   */
  export type QuizCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * The data used to create many Quizzes.
     */
    data: QuizCreateManyInput | QuizCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Quiz update
   */
  export type QuizUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * The data needed to update a Quiz.
     */
    data: XOR<QuizUpdateInput, QuizUncheckedUpdateInput>
    /**
     * Choose, which Quiz to update.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz updateMany
   */
  export type QuizUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Quizzes.
     */
    data: XOR<QuizUpdateManyMutationInput, QuizUncheckedUpdateManyInput>
    /**
     * Filter which Quizzes to update
     */
    where?: QuizWhereInput
    /**
     * Limit how many Quizzes to update.
     */
    limit?: number
  }

  /**
   * Quiz updateManyAndReturn
   */
  export type QuizUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * The data used to update Quizzes.
     */
    data: XOR<QuizUpdateManyMutationInput, QuizUncheckedUpdateManyInput>
    /**
     * Filter which Quizzes to update
     */
    where?: QuizWhereInput
    /**
     * Limit how many Quizzes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Quiz upsert
   */
  export type QuizUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * The filter to search for the Quiz to update in case it exists.
     */
    where: QuizWhereUniqueInput
    /**
     * In case the Quiz found by the `where` argument doesn't exist, create a new Quiz with this data.
     */
    create: XOR<QuizCreateInput, QuizUncheckedCreateInput>
    /**
     * In case the Quiz was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuizUpdateInput, QuizUncheckedUpdateInput>
  }

  /**
   * Quiz delete
   */
  export type QuizDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
    /**
     * Filter which Quiz to delete.
     */
    where: QuizWhereUniqueInput
  }

  /**
   * Quiz deleteMany
   */
  export type QuizDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Quizzes to delete
     */
    where?: QuizWhereInput
    /**
     * Limit how many Quizzes to delete.
     */
    limit?: number
  }

  /**
   * Quiz without action
   */
  export type QuizDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Quiz
     */
    select?: QuizSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Quiz
     */
    omit?: QuizOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuizInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const WorksheetScalarFieldEnum: {
    id: 'id',
    title: 'title',
    userId: 'userId',
    keywords: 'keywords',
    version: 'version',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorksheetScalarFieldEnum = (typeof WorksheetScalarFieldEnum)[keyof typeof WorksheetScalarFieldEnum]


  export const QuizScalarFieldEnum: {
    id: 'id',
    worksheetId: 'worksheetId',
    userId: 'userId',
    title: 'title',
    difficulty: 'difficulty',
    questions: 'questions',
    status: 'status',
    score: 'score',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    version: 'version'
  };

  export type QuizScalarFieldEnum = (typeof QuizScalarFieldEnum)[keyof typeof QuizScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Difficulty'
   */
  export type EnumDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Difficulty'>
    


  /**
   * Reference to a field of type 'QuizStatus'
   */
  export type EnumQuizStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuizStatus'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type WorksheetWhereInput = {
    AND?: WorksheetWhereInput | WorksheetWhereInput[]
    OR?: WorksheetWhereInput[]
    NOT?: WorksheetWhereInput | WorksheetWhereInput[]
    id?: StringFilter<"Worksheet"> | string
    title?: StringFilter<"Worksheet"> | string
    userId?: StringFilter<"Worksheet"> | string
    keywords?: StringFilter<"Worksheet"> | string
    version?: IntFilter<"Worksheet"> | number
    createdAt?: DateTimeFilter<"Worksheet"> | Date | string
    updatedAt?: DateTimeFilter<"Worksheet"> | Date | string
    quizzes?: QuizListRelationFilter
  }

  export type WorksheetOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    userId?: SortOrder
    keywords?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    quizzes?: QuizOrderByRelationAggregateInput
  }

  export type WorksheetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorksheetWhereInput | WorksheetWhereInput[]
    OR?: WorksheetWhereInput[]
    NOT?: WorksheetWhereInput | WorksheetWhereInput[]
    title?: StringFilter<"Worksheet"> | string
    userId?: StringFilter<"Worksheet"> | string
    keywords?: StringFilter<"Worksheet"> | string
    version?: IntFilter<"Worksheet"> | number
    createdAt?: DateTimeFilter<"Worksheet"> | Date | string
    updatedAt?: DateTimeFilter<"Worksheet"> | Date | string
    quizzes?: QuizListRelationFilter
  }, "id">

  export type WorksheetOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    userId?: SortOrder
    keywords?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorksheetCountOrderByAggregateInput
    _avg?: WorksheetAvgOrderByAggregateInput
    _max?: WorksheetMaxOrderByAggregateInput
    _min?: WorksheetMinOrderByAggregateInput
    _sum?: WorksheetSumOrderByAggregateInput
  }

  export type WorksheetScalarWhereWithAggregatesInput = {
    AND?: WorksheetScalarWhereWithAggregatesInput | WorksheetScalarWhereWithAggregatesInput[]
    OR?: WorksheetScalarWhereWithAggregatesInput[]
    NOT?: WorksheetScalarWhereWithAggregatesInput | WorksheetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Worksheet"> | string
    title?: StringWithAggregatesFilter<"Worksheet"> | string
    userId?: StringWithAggregatesFilter<"Worksheet"> | string
    keywords?: StringWithAggregatesFilter<"Worksheet"> | string
    version?: IntWithAggregatesFilter<"Worksheet"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Worksheet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Worksheet"> | Date | string
  }

  export type QuizWhereInput = {
    AND?: QuizWhereInput | QuizWhereInput[]
    OR?: QuizWhereInput[]
    NOT?: QuizWhereInput | QuizWhereInput[]
    id?: StringFilter<"Quiz"> | string
    worksheetId?: StringFilter<"Quiz"> | string
    userId?: StringFilter<"Quiz"> | string
    title?: StringFilter<"Quiz"> | string
    difficulty?: EnumDifficultyFilter<"Quiz"> | $Enums.Difficulty
    questions?: StringFilter<"Quiz"> | string
    status?: EnumQuizStatusFilter<"Quiz"> | $Enums.QuizStatus
    score?: IntNullableFilter<"Quiz"> | number | null
    completedAt?: DateTimeNullableFilter<"Quiz"> | Date | string | null
    createdAt?: DateTimeFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeFilter<"Quiz"> | Date | string
    version?: IntFilter<"Quiz"> | number
    worksheet?: XOR<WorksheetScalarRelationFilter, WorksheetWhereInput>
  }

  export type QuizOrderByWithRelationInput = {
    id?: SortOrder
    worksheetId?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    questions?: SortOrder
    status?: SortOrder
    score?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
    worksheet?: WorksheetOrderByWithRelationInput
  }

  export type QuizWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    worksheetId_difficulty?: QuizWorksheetIdDifficultyCompoundUniqueInput
    AND?: QuizWhereInput | QuizWhereInput[]
    OR?: QuizWhereInput[]
    NOT?: QuizWhereInput | QuizWhereInput[]
    worksheetId?: StringFilter<"Quiz"> | string
    userId?: StringFilter<"Quiz"> | string
    title?: StringFilter<"Quiz"> | string
    difficulty?: EnumDifficultyFilter<"Quiz"> | $Enums.Difficulty
    questions?: StringFilter<"Quiz"> | string
    status?: EnumQuizStatusFilter<"Quiz"> | $Enums.QuizStatus
    score?: IntNullableFilter<"Quiz"> | number | null
    completedAt?: DateTimeNullableFilter<"Quiz"> | Date | string | null
    createdAt?: DateTimeFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeFilter<"Quiz"> | Date | string
    version?: IntFilter<"Quiz"> | number
    worksheet?: XOR<WorksheetScalarRelationFilter, WorksheetWhereInput>
  }, "id" | "worksheetId_difficulty">

  export type QuizOrderByWithAggregationInput = {
    id?: SortOrder
    worksheetId?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    questions?: SortOrder
    status?: SortOrder
    score?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
    _count?: QuizCountOrderByAggregateInput
    _avg?: QuizAvgOrderByAggregateInput
    _max?: QuizMaxOrderByAggregateInput
    _min?: QuizMinOrderByAggregateInput
    _sum?: QuizSumOrderByAggregateInput
  }

  export type QuizScalarWhereWithAggregatesInput = {
    AND?: QuizScalarWhereWithAggregatesInput | QuizScalarWhereWithAggregatesInput[]
    OR?: QuizScalarWhereWithAggregatesInput[]
    NOT?: QuizScalarWhereWithAggregatesInput | QuizScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Quiz"> | string
    worksheetId?: StringWithAggregatesFilter<"Quiz"> | string
    userId?: StringWithAggregatesFilter<"Quiz"> | string
    title?: StringWithAggregatesFilter<"Quiz"> | string
    difficulty?: EnumDifficultyWithAggregatesFilter<"Quiz"> | $Enums.Difficulty
    questions?: StringWithAggregatesFilter<"Quiz"> | string
    status?: EnumQuizStatusWithAggregatesFilter<"Quiz"> | $Enums.QuizStatus
    score?: IntNullableWithAggregatesFilter<"Quiz"> | number | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"Quiz"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Quiz"> | Date | string
    version?: IntWithAggregatesFilter<"Quiz"> | number
  }

  export type WorksheetCreateInput = {
    id: string
    title: string
    userId: string
    keywords: string
    version: number
    createdAt?: Date | string
    updatedAt?: Date | string
    quizzes?: QuizCreateNestedManyWithoutWorksheetInput
  }

  export type WorksheetUncheckedCreateInput = {
    id: string
    title: string
    userId: string
    keywords: string
    version: number
    createdAt?: Date | string
    updatedAt?: Date | string
    quizzes?: QuizUncheckedCreateNestedManyWithoutWorksheetInput
  }

  export type WorksheetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quizzes?: QuizUpdateManyWithoutWorksheetNestedInput
  }

  export type WorksheetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quizzes?: QuizUncheckedUpdateManyWithoutWorksheetNestedInput
  }

  export type WorksheetCreateManyInput = {
    id: string
    title: string
    userId: string
    keywords: string
    version: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorksheetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorksheetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizCreateInput = {
    id?: string
    userId: string
    title: string
    difficulty: $Enums.Difficulty
    questions: string
    status?: $Enums.QuizStatus
    score?: number | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    version: number
    worksheet: WorksheetCreateNestedOneWithoutQuizzesInput
  }

  export type QuizUncheckedCreateInput = {
    id?: string
    worksheetId: string
    userId: string
    title: string
    difficulty: $Enums.Difficulty
    questions: string
    status?: $Enums.QuizStatus
    score?: number | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    version: number
  }

  export type QuizUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    questions?: StringFieldUpdateOperationsInput | string
    status?: EnumQuizStatusFieldUpdateOperationsInput | $Enums.QuizStatus
    score?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    worksheet?: WorksheetUpdateOneRequiredWithoutQuizzesNestedInput
  }

  export type QuizUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    worksheetId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    questions?: StringFieldUpdateOperationsInput | string
    status?: EnumQuizStatusFieldUpdateOperationsInput | $Enums.QuizStatus
    score?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type QuizCreateManyInput = {
    id?: string
    worksheetId: string
    userId: string
    title: string
    difficulty: $Enums.Difficulty
    questions: string
    status?: $Enums.QuizStatus
    score?: number | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    version: number
  }

  export type QuizUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    questions?: StringFieldUpdateOperationsInput | string
    status?: EnumQuizStatusFieldUpdateOperationsInput | $Enums.QuizStatus
    score?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type QuizUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    worksheetId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    questions?: StringFieldUpdateOperationsInput | string
    status?: EnumQuizStatusFieldUpdateOperationsInput | $Enums.QuizStatus
    score?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type QuizListRelationFilter = {
    every?: QuizWhereInput
    some?: QuizWhereInput
    none?: QuizWhereInput
  }

  export type QuizOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorksheetCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    userId?: SortOrder
    keywords?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorksheetAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type WorksheetMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    userId?: SortOrder
    keywords?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorksheetMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    userId?: SortOrder
    keywords?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorksheetSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[]
    notIn?: $Enums.Difficulty[]
    not?: NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
  }

  export type EnumQuizStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.QuizStatus | EnumQuizStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuizStatus[]
    notIn?: $Enums.QuizStatus[]
    not?: NestedEnumQuizStatusFilter<$PrismaModel> | $Enums.QuizStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type WorksheetScalarRelationFilter = {
    is?: WorksheetWhereInput
    isNot?: WorksheetWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type QuizWorksheetIdDifficultyCompoundUniqueInput = {
    worksheetId: string
    difficulty: $Enums.Difficulty
  }

  export type QuizCountOrderByAggregateInput = {
    id?: SortOrder
    worksheetId?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    questions?: SortOrder
    status?: SortOrder
    score?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type QuizAvgOrderByAggregateInput = {
    score?: SortOrder
    version?: SortOrder
  }

  export type QuizMaxOrderByAggregateInput = {
    id?: SortOrder
    worksheetId?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    questions?: SortOrder
    status?: SortOrder
    score?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type QuizMinOrderByAggregateInput = {
    id?: SortOrder
    worksheetId?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    difficulty?: SortOrder
    questions?: SortOrder
    status?: SortOrder
    score?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type QuizSumOrderByAggregateInput = {
    score?: SortOrder
    version?: SortOrder
  }

  export type EnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[]
    notIn?: $Enums.Difficulty[]
    not?: NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyFilter<$PrismaModel>
    _max?: NestedEnumDifficultyFilter<$PrismaModel>
  }

  export type EnumQuizStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuizStatus | EnumQuizStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuizStatus[]
    notIn?: $Enums.QuizStatus[]
    not?: NestedEnumQuizStatusWithAggregatesFilter<$PrismaModel> | $Enums.QuizStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuizStatusFilter<$PrismaModel>
    _max?: NestedEnumQuizStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type QuizCreateNestedManyWithoutWorksheetInput = {
    create?: XOR<QuizCreateWithoutWorksheetInput, QuizUncheckedCreateWithoutWorksheetInput> | QuizCreateWithoutWorksheetInput[] | QuizUncheckedCreateWithoutWorksheetInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutWorksheetInput | QuizCreateOrConnectWithoutWorksheetInput[]
    createMany?: QuizCreateManyWorksheetInputEnvelope
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
  }

  export type QuizUncheckedCreateNestedManyWithoutWorksheetInput = {
    create?: XOR<QuizCreateWithoutWorksheetInput, QuizUncheckedCreateWithoutWorksheetInput> | QuizCreateWithoutWorksheetInput[] | QuizUncheckedCreateWithoutWorksheetInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutWorksheetInput | QuizCreateOrConnectWithoutWorksheetInput[]
    createMany?: QuizCreateManyWorksheetInputEnvelope
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type QuizUpdateManyWithoutWorksheetNestedInput = {
    create?: XOR<QuizCreateWithoutWorksheetInput, QuizUncheckedCreateWithoutWorksheetInput> | QuizCreateWithoutWorksheetInput[] | QuizUncheckedCreateWithoutWorksheetInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutWorksheetInput | QuizCreateOrConnectWithoutWorksheetInput[]
    upsert?: QuizUpsertWithWhereUniqueWithoutWorksheetInput | QuizUpsertWithWhereUniqueWithoutWorksheetInput[]
    createMany?: QuizCreateManyWorksheetInputEnvelope
    set?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    disconnect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    delete?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    update?: QuizUpdateWithWhereUniqueWithoutWorksheetInput | QuizUpdateWithWhereUniqueWithoutWorksheetInput[]
    updateMany?: QuizUpdateManyWithWhereWithoutWorksheetInput | QuizUpdateManyWithWhereWithoutWorksheetInput[]
    deleteMany?: QuizScalarWhereInput | QuizScalarWhereInput[]
  }

  export type QuizUncheckedUpdateManyWithoutWorksheetNestedInput = {
    create?: XOR<QuizCreateWithoutWorksheetInput, QuizUncheckedCreateWithoutWorksheetInput> | QuizCreateWithoutWorksheetInput[] | QuizUncheckedCreateWithoutWorksheetInput[]
    connectOrCreate?: QuizCreateOrConnectWithoutWorksheetInput | QuizCreateOrConnectWithoutWorksheetInput[]
    upsert?: QuizUpsertWithWhereUniqueWithoutWorksheetInput | QuizUpsertWithWhereUniqueWithoutWorksheetInput[]
    createMany?: QuizCreateManyWorksheetInputEnvelope
    set?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    disconnect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    delete?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    connect?: QuizWhereUniqueInput | QuizWhereUniqueInput[]
    update?: QuizUpdateWithWhereUniqueWithoutWorksheetInput | QuizUpdateWithWhereUniqueWithoutWorksheetInput[]
    updateMany?: QuizUpdateManyWithWhereWithoutWorksheetInput | QuizUpdateManyWithWhereWithoutWorksheetInput[]
    deleteMany?: QuizScalarWhereInput | QuizScalarWhereInput[]
  }

  export type WorksheetCreateNestedOneWithoutQuizzesInput = {
    create?: XOR<WorksheetCreateWithoutQuizzesInput, WorksheetUncheckedCreateWithoutQuizzesInput>
    connectOrCreate?: WorksheetCreateOrConnectWithoutQuizzesInput
    connect?: WorksheetWhereUniqueInput
  }

  export type EnumDifficultyFieldUpdateOperationsInput = {
    set?: $Enums.Difficulty
  }

  export type EnumQuizStatusFieldUpdateOperationsInput = {
    set?: $Enums.QuizStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type WorksheetUpdateOneRequiredWithoutQuizzesNestedInput = {
    create?: XOR<WorksheetCreateWithoutQuizzesInput, WorksheetUncheckedCreateWithoutQuizzesInput>
    connectOrCreate?: WorksheetCreateOrConnectWithoutQuizzesInput
    upsert?: WorksheetUpsertWithoutQuizzesInput
    connect?: WorksheetWhereUniqueInput
    update?: XOR<XOR<WorksheetUpdateToOneWithWhereWithoutQuizzesInput, WorksheetUpdateWithoutQuizzesInput>, WorksheetUncheckedUpdateWithoutQuizzesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[]
    notIn?: $Enums.Difficulty[]
    not?: NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
  }

  export type NestedEnumQuizStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.QuizStatus | EnumQuizStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuizStatus[]
    notIn?: $Enums.QuizStatus[]
    not?: NestedEnumQuizStatusFilter<$PrismaModel> | $Enums.QuizStatus
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[]
    notIn?: $Enums.Difficulty[]
    not?: NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyFilter<$PrismaModel>
    _max?: NestedEnumDifficultyFilter<$PrismaModel>
  }

  export type NestedEnumQuizStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuizStatus | EnumQuizStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QuizStatus[]
    notIn?: $Enums.QuizStatus[]
    not?: NestedEnumQuizStatusWithAggregatesFilter<$PrismaModel> | $Enums.QuizStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuizStatusFilter<$PrismaModel>
    _max?: NestedEnumQuizStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type QuizCreateWithoutWorksheetInput = {
    id?: string
    userId: string
    title: string
    difficulty: $Enums.Difficulty
    questions: string
    status?: $Enums.QuizStatus
    score?: number | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    version: number
  }

  export type QuizUncheckedCreateWithoutWorksheetInput = {
    id?: string
    userId: string
    title: string
    difficulty: $Enums.Difficulty
    questions: string
    status?: $Enums.QuizStatus
    score?: number | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    version: number
  }

  export type QuizCreateOrConnectWithoutWorksheetInput = {
    where: QuizWhereUniqueInput
    create: XOR<QuizCreateWithoutWorksheetInput, QuizUncheckedCreateWithoutWorksheetInput>
  }

  export type QuizCreateManyWorksheetInputEnvelope = {
    data: QuizCreateManyWorksheetInput | QuizCreateManyWorksheetInput[]
  }

  export type QuizUpsertWithWhereUniqueWithoutWorksheetInput = {
    where: QuizWhereUniqueInput
    update: XOR<QuizUpdateWithoutWorksheetInput, QuizUncheckedUpdateWithoutWorksheetInput>
    create: XOR<QuizCreateWithoutWorksheetInput, QuizUncheckedCreateWithoutWorksheetInput>
  }

  export type QuizUpdateWithWhereUniqueWithoutWorksheetInput = {
    where: QuizWhereUniqueInput
    data: XOR<QuizUpdateWithoutWorksheetInput, QuizUncheckedUpdateWithoutWorksheetInput>
  }

  export type QuizUpdateManyWithWhereWithoutWorksheetInput = {
    where: QuizScalarWhereInput
    data: XOR<QuizUpdateManyMutationInput, QuizUncheckedUpdateManyWithoutWorksheetInput>
  }

  export type QuizScalarWhereInput = {
    AND?: QuizScalarWhereInput | QuizScalarWhereInput[]
    OR?: QuizScalarWhereInput[]
    NOT?: QuizScalarWhereInput | QuizScalarWhereInput[]
    id?: StringFilter<"Quiz"> | string
    worksheetId?: StringFilter<"Quiz"> | string
    userId?: StringFilter<"Quiz"> | string
    title?: StringFilter<"Quiz"> | string
    difficulty?: EnumDifficultyFilter<"Quiz"> | $Enums.Difficulty
    questions?: StringFilter<"Quiz"> | string
    status?: EnumQuizStatusFilter<"Quiz"> | $Enums.QuizStatus
    score?: IntNullableFilter<"Quiz"> | number | null
    completedAt?: DateTimeNullableFilter<"Quiz"> | Date | string | null
    createdAt?: DateTimeFilter<"Quiz"> | Date | string
    updatedAt?: DateTimeFilter<"Quiz"> | Date | string
    version?: IntFilter<"Quiz"> | number
  }

  export type WorksheetCreateWithoutQuizzesInput = {
    id: string
    title: string
    userId: string
    keywords: string
    version: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorksheetUncheckedCreateWithoutQuizzesInput = {
    id: string
    title: string
    userId: string
    keywords: string
    version: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorksheetCreateOrConnectWithoutQuizzesInput = {
    where: WorksheetWhereUniqueInput
    create: XOR<WorksheetCreateWithoutQuizzesInput, WorksheetUncheckedCreateWithoutQuizzesInput>
  }

  export type WorksheetUpsertWithoutQuizzesInput = {
    update: XOR<WorksheetUpdateWithoutQuizzesInput, WorksheetUncheckedUpdateWithoutQuizzesInput>
    create: XOR<WorksheetCreateWithoutQuizzesInput, WorksheetUncheckedCreateWithoutQuizzesInput>
    where?: WorksheetWhereInput
  }

  export type WorksheetUpdateToOneWithWhereWithoutQuizzesInput = {
    where?: WorksheetWhereInput
    data: XOR<WorksheetUpdateWithoutQuizzesInput, WorksheetUncheckedUpdateWithoutQuizzesInput>
  }

  export type WorksheetUpdateWithoutQuizzesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorksheetUncheckedUpdateWithoutQuizzesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    keywords?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QuizCreateManyWorksheetInput = {
    id?: string
    userId: string
    title: string
    difficulty: $Enums.Difficulty
    questions: string
    status?: $Enums.QuizStatus
    score?: number | null
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    version: number
  }

  export type QuizUpdateWithoutWorksheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    questions?: StringFieldUpdateOperationsInput | string
    status?: EnumQuizStatusFieldUpdateOperationsInput | $Enums.QuizStatus
    score?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type QuizUncheckedUpdateWithoutWorksheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    questions?: StringFieldUpdateOperationsInput | string
    status?: EnumQuizStatusFieldUpdateOperationsInput | $Enums.QuizStatus
    score?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type QuizUncheckedUpdateManyWithoutWorksheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    questions?: StringFieldUpdateOperationsInput | string
    status?: EnumQuizStatusFieldUpdateOperationsInput | $Enums.QuizStatus
    score?: NullableIntFieldUpdateOperationsInput | number | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}