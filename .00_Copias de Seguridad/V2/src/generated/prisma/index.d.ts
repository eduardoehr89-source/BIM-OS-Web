
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Client
 * 
 */
export type Client = $Result.DefaultSelection<Prisma.$ClientPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model ProjectFile
 * 
 */
export type ProjectFile = $Result.DefaultSelection<Prisma.$ProjectFilePayload>
/**
 * Model ProjectTask
 * 
 */
export type ProjectTask = $Result.DefaultSelection<Prisma.$ProjectTaskPayload>
/**
 * Model KnowledgeReference
 * 
 */
export type KnowledgeReference = $Result.DefaultSelection<Prisma.$KnowledgeReferencePayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Invitation
 * 
 */
export type Invitation = $Result.DefaultSelection<Prisma.$InvitationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ProjectStatus: {
  INICIO_PENDIENTE: 'INICIO_PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  PAUSADO: 'PAUSADO',
  TERMINADO: 'TERMINADO',
  CANCELADO: 'CANCELADO'
};

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]


export const TaskDiscipline: {
  ARQUITECTURA: 'ARQUITECTURA',
  ESTRUCTURA: 'ESTRUCTURA',
  MEP: 'MEP',
  MECHANICAL: 'MECHANICAL',
  ELECTRICAL: 'ELECTRICAL',
  PLUMBING: 'PLUMBING',
  HVAC: 'HVAC',
  FIRE_PROTECTION: 'FIRE_PROTECTION',
  LANDSCAPE: 'LANDSCAPE',
  OTROS: 'OTROS'
};

export type TaskDiscipline = (typeof TaskDiscipline)[keyof typeof TaskDiscipline]


export const TaskComplexity: {
  BAJO: 'BAJO',
  MEDIO: 'MEDIO',
  ALTO: 'ALTO'
};

export type TaskComplexity = (typeof TaskComplexity)[keyof typeof TaskComplexity]


export const TaskActivity: {
  MODELADO: 'MODELADO',
  CUANTIFICACION: 'CUANTIFICACION',
  DOCUMENTACION: 'DOCUMENTACION'
};

export type TaskActivity = (typeof TaskActivity)[keyof typeof TaskActivity]


export const TaskEstatus: {
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  PAUSADA: 'PAUSADA',
  COMPLETADA: 'COMPLETADA'
};

export type TaskEstatus = (typeof TaskEstatus)[keyof typeof TaskEstatus]


export const TechnicalDocType: {
  BEP: 'BEP',
  OIR: 'OIR',
  EIR: 'EIR',
  OTRO: 'OTRO'
};

export type TechnicalDocType = (typeof TechnicalDocType)[keyof typeof TechnicalDocType]


export const KnowledgeCategory: {
  NORMAS: 'NORMAS',
  ESTANDARES: 'ESTANDARES',
  CONCEPTOS: 'CONCEPTOS',
  REGLAMENTOS: 'REGLAMENTOS'
};

export type KnowledgeCategory = (typeof KnowledgeCategory)[keyof typeof KnowledgeCategory]


export const ResourceType: {
  PROJECT: 'PROJECT',
  CLIENT: 'CLIENT',
  TASK: 'TASK'
};

export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType]


export const InvitationStatus: {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
};

export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus]


export const UserRole: {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

}

export type ProjectStatus = $Enums.ProjectStatus

export const ProjectStatus: typeof $Enums.ProjectStatus

export type TaskDiscipline = $Enums.TaskDiscipline

export const TaskDiscipline: typeof $Enums.TaskDiscipline

export type TaskComplexity = $Enums.TaskComplexity

export const TaskComplexity: typeof $Enums.TaskComplexity

export type TaskActivity = $Enums.TaskActivity

export const TaskActivity: typeof $Enums.TaskActivity

export type TaskEstatus = $Enums.TaskEstatus

export const TaskEstatus: typeof $Enums.TaskEstatus

export type TechnicalDocType = $Enums.TechnicalDocType

export const TechnicalDocType: typeof $Enums.TechnicalDocType

export type KnowledgeCategory = $Enums.KnowledgeCategory

export const KnowledgeCategory: typeof $Enums.KnowledgeCategory

export type ResourceType = $Enums.ResourceType

export const ResourceType: typeof $Enums.ResourceType

export type InvitationStatus = $Enums.InvitationStatus

export const InvitationStatus: typeof $Enums.InvitationStatus

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Clients
 * const clients = await prisma.client.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Clients
   * const clients = await prisma.client.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
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
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.client`: Exposes CRUD operations for the **Client** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clients
    * const clients = await prisma.client.findMany()
    * ```
    */
  get client(): Prisma.ClientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectFile`: Exposes CRUD operations for the **ProjectFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectFiles
    * const projectFiles = await prisma.projectFile.findMany()
    * ```
    */
  get projectFile(): Prisma.ProjectFileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectTask`: Exposes CRUD operations for the **ProjectTask** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectTasks
    * const projectTasks = await prisma.projectTask.findMany()
    * ```
    */
  get projectTask(): Prisma.ProjectTaskDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.knowledgeReference`: Exposes CRUD operations for the **KnowledgeReference** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KnowledgeReferences
    * const knowledgeReferences = await prisma.knowledgeReference.findMany()
    * ```
    */
  get knowledgeReference(): Prisma.KnowledgeReferenceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invitation`: Exposes CRUD operations for the **Invitation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invitations
    * const invitations = await prisma.invitation.findMany()
    * ```
    */
  get invitation(): Prisma.InvitationDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
    Client: 'Client',
    Project: 'Project',
    ProjectFile: 'ProjectFile',
    ProjectTask: 'ProjectTask',
    KnowledgeReference: 'KnowledgeReference',
    User: 'User',
    Invitation: 'Invitation'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "client" | "project" | "projectFile" | "projectTask" | "knowledgeReference" | "user" | "invitation"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Client: {
        payload: Prisma.$ClientPayload<ExtArgs>
        fields: Prisma.ClientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findFirst: {
            args: Prisma.ClientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findMany: {
            args: Prisma.ClientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          create: {
            args: Prisma.ClientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          createMany: {
            args: Prisma.ClientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          delete: {
            args: Prisma.ClientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          update: {
            args: Prisma.ClientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          deleteMany: {
            args: Prisma.ClientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          upsert: {
            args: Prisma.ClientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          aggregate: {
            args: Prisma.ClientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClient>
          }
          groupBy: {
            args: Prisma.ClientGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientCountArgs<ExtArgs>
            result: $Utils.Optional<ClientCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      ProjectFile: {
        payload: Prisma.$ProjectFilePayload<ExtArgs>
        fields: Prisma.ProjectFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findFirst: {
            args: Prisma.ProjectFileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findMany: {
            args: Prisma.ProjectFileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          create: {
            args: Prisma.ProjectFileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          createMany: {
            args: Prisma.ProjectFileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectFileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          delete: {
            args: Prisma.ProjectFileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          update: {
            args: Prisma.ProjectFileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          deleteMany: {
            args: Prisma.ProjectFileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectFileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectFileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          upsert: {
            args: Prisma.ProjectFileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          aggregate: {
            args: Prisma.ProjectFileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectFile>
          }
          groupBy: {
            args: Prisma.ProjectFileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectFileCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileCountAggregateOutputType> | number
          }
        }
      }
      ProjectTask: {
        payload: Prisma.$ProjectTaskPayload<ExtArgs>
        fields: Prisma.ProjectTaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectTaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectTaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          findFirst: {
            args: Prisma.ProjectTaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectTaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          findMany: {
            args: Prisma.ProjectTaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>[]
          }
          create: {
            args: Prisma.ProjectTaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          createMany: {
            args: Prisma.ProjectTaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectTaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>[]
          }
          delete: {
            args: Prisma.ProjectTaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          update: {
            args: Prisma.ProjectTaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          deleteMany: {
            args: Prisma.ProjectTaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectTaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectTaskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>[]
          }
          upsert: {
            args: Prisma.ProjectTaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectTaskPayload>
          }
          aggregate: {
            args: Prisma.ProjectTaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectTask>
          }
          groupBy: {
            args: Prisma.ProjectTaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectTaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectTaskCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectTaskCountAggregateOutputType> | number
          }
        }
      }
      KnowledgeReference: {
        payload: Prisma.$KnowledgeReferencePayload<ExtArgs>
        fields: Prisma.KnowledgeReferenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KnowledgeReferenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeReferencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KnowledgeReferenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeReferencePayload>
          }
          findFirst: {
            args: Prisma.KnowledgeReferenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeReferencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KnowledgeReferenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeReferencePayload>
          }
          findMany: {
            args: Prisma.KnowledgeReferenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeReferencePayload>[]
          }
          create: {
            args: Prisma.KnowledgeReferenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeReferencePayload>
          }
          createMany: {
            args: Prisma.KnowledgeReferenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KnowledgeReferenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeReferencePayload>[]
          }
          delete: {
            args: Prisma.KnowledgeReferenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeReferencePayload>
          }
          update: {
            args: Prisma.KnowledgeReferenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeReferencePayload>
          }
          deleteMany: {
            args: Prisma.KnowledgeReferenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KnowledgeReferenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KnowledgeReferenceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeReferencePayload>[]
          }
          upsert: {
            args: Prisma.KnowledgeReferenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KnowledgeReferencePayload>
          }
          aggregate: {
            args: Prisma.KnowledgeReferenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKnowledgeReference>
          }
          groupBy: {
            args: Prisma.KnowledgeReferenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeReferenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.KnowledgeReferenceCountArgs<ExtArgs>
            result: $Utils.Optional<KnowledgeReferenceCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Invitation: {
        payload: Prisma.$InvitationPayload<ExtArgs>
        fields: Prisma.InvitationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvitationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvitationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          findFirst: {
            args: Prisma.InvitationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvitationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          findMany: {
            args: Prisma.InvitationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>[]
          }
          create: {
            args: Prisma.InvitationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          createMany: {
            args: Prisma.InvitationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvitationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>[]
          }
          delete: {
            args: Prisma.InvitationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          update: {
            args: Prisma.InvitationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          deleteMany: {
            args: Prisma.InvitationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvitationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InvitationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>[]
          }
          upsert: {
            args: Prisma.InvitationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          aggregate: {
            args: Prisma.InvitationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvitation>
          }
          groupBy: {
            args: Prisma.InvitationGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvitationGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvitationCountArgs<ExtArgs>
            result: $Utils.Optional<InvitationCountAggregateOutputType> | number
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
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
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
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    client?: ClientOmit
    project?: ProjectOmit
    projectFile?: ProjectFileOmit
    projectTask?: ProjectTaskOmit
    knowledgeReference?: KnowledgeReferenceOmit
    user?: UserOmit
    invitation?: InvitationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
   * Count Type ClientCountOutputType
   */

  export type ClientCountOutputType = {
    projects: number
    sharedWith: number
  }

  export type ClientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | ClientCountOutputTypeCountProjectsArgs
    sharedWith?: boolean | ClientCountOutputTypeCountSharedWithArgs
  }

  // Custom InputTypes
  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientCountOutputType
     */
    select?: ClientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountSharedWithArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    files: number
    tasks: number
    sharedWith: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | ProjectCountOutputTypeCountFilesArgs
    tasks?: boolean | ProjectCountOutputTypeCountTasksArgs
    sharedWith?: boolean | ProjectCountOutputTypeCountSharedWithArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectTaskWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountSharedWithArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type ProjectTaskCountOutputType
   */

  export type ProjectTaskCountOutputType = {
    sharedWith: number
  }

  export type ProjectTaskCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sharedWith?: boolean | ProjectTaskCountOutputTypeCountSharedWithArgs
  }

  // Custom InputTypes
  /**
   * ProjectTaskCountOutputType without action
   */
  export type ProjectTaskCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTaskCountOutputType
     */
    select?: ProjectTaskCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectTaskCountOutputType without action
   */
  export type ProjectTaskCountOutputTypeCountSharedWithArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    ownedClients: number
    sharedClients: number
    ownedProjects: number
    sharedProjects: number
    ownedTasks: number
    sharedTasks: number
    sentInvitations: number
    receivedInvitations: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedClients?: boolean | UserCountOutputTypeCountOwnedClientsArgs
    sharedClients?: boolean | UserCountOutputTypeCountSharedClientsArgs
    ownedProjects?: boolean | UserCountOutputTypeCountOwnedProjectsArgs
    sharedProjects?: boolean | UserCountOutputTypeCountSharedProjectsArgs
    ownedTasks?: boolean | UserCountOutputTypeCountOwnedTasksArgs
    sharedTasks?: boolean | UserCountOutputTypeCountSharedTasksArgs
    sentInvitations?: boolean | UserCountOutputTypeCountSentInvitationsArgs
    receivedInvitations?: boolean | UserCountOutputTypeCountReceivedInvitationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedClientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSharedClientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSharedProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectTaskWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSharedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectTaskWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentInvitationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvitationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReceivedInvitationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvitationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Client
   */

  export type AggregateClient = {
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  export type ClientMinAggregateOutputType = {
    id: string | null
    nombre: string | null
    activo: boolean | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientMaxAggregateOutputType = {
    id: string | null
    nombre: string | null
    activo: boolean | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientCountAggregateOutputType = {
    id: number
    nombre: number
    activo: number
    ownerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClientMinAggregateInputType = {
    id?: true
    nombre?: true
    activo?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientMaxAggregateInputType = {
    id?: true
    nombre?: true
    activo?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientCountAggregateInputType = {
    id?: true
    nombre?: true
    activo?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Client to aggregate.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clients
    **/
    _count?: true | ClientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientMaxAggregateInputType
  }

  export type GetClientAggregateType<T extends ClientAggregateArgs> = {
        [P in keyof T & keyof AggregateClient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClient[P]>
      : GetScalarType<T[P], AggregateClient[P]>
  }




  export type ClientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithAggregationInput | ClientOrderByWithAggregationInput[]
    by: ClientScalarFieldEnum[] | ClientScalarFieldEnum
    having?: ClientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientCountAggregateInputType | true
    _min?: ClientMinAggregateInputType
    _max?: ClientMaxAggregateInputType
  }

  export type ClientGroupByOutputType = {
    id: string
    nombre: string
    activo: boolean
    ownerId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  type GetClientGroupByPayload<T extends ClientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientGroupByOutputType[P]>
            : GetScalarType<T[P], ClientGroupByOutputType[P]>
        }
      >
    >


  export type ClientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    activo?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projects?: boolean | Client$projectsArgs<ExtArgs>
    owner?: boolean | Client$ownerArgs<ExtArgs>
    sharedWith?: boolean | Client$sharedWithArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    activo?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | Client$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    activo?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | Client$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectScalar = {
    id?: boolean
    nombre?: boolean
    activo?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "activo" | "ownerId" | "createdAt" | "updatedAt", ExtArgs["result"]["client"]>
  export type ClientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | Client$projectsArgs<ExtArgs>
    owner?: boolean | Client$ownerArgs<ExtArgs>
    sharedWith?: boolean | Client$sharedWithArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | Client$ownerArgs<ExtArgs>
  }
  export type ClientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | Client$ownerArgs<ExtArgs>
  }

  export type $ClientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Client"
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      owner: Prisma.$UserPayload<ExtArgs> | null
      sharedWith: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nombre: string
      activo: boolean
      ownerId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["client"]>
    composites: {}
  }

  type ClientGetPayload<S extends boolean | null | undefined | ClientDefaultArgs> = $Result.GetResult<Prisma.$ClientPayload, S>

  type ClientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClientCountAggregateInputType | true
    }

  export interface ClientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Client'], meta: { name: 'Client' } }
    /**
     * Find zero or one Client that matches the filter.
     * @param {ClientFindUniqueArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientFindUniqueArgs>(args: SelectSubset<T, ClientFindUniqueArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Client that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClientFindUniqueOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientFindFirstArgs>(args?: SelectSubset<T, ClientFindFirstArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clients
     * const clients = await prisma.client.findMany()
     * 
     * // Get first 10 Clients
     * const clients = await prisma.client.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientWithIdOnly = await prisma.client.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientFindManyArgs>(args?: SelectSubset<T, ClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Client.
     * @param {ClientCreateArgs} args - Arguments to create a Client.
     * @example
     * // Create one Client
     * const Client = await prisma.client.create({
     *   data: {
     *     // ... data to create a Client
     *   }
     * })
     * 
     */
    create<T extends ClientCreateArgs>(args: SelectSubset<T, ClientCreateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clients.
     * @param {ClientCreateManyArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientCreateManyArgs>(args?: SelectSubset<T, ClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clients and returns the data saved in the database.
     * @param {ClientCreateManyAndReturnArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Client.
     * @param {ClientDeleteArgs} args - Arguments to delete one Client.
     * @example
     * // Delete one Client
     * const Client = await prisma.client.delete({
     *   where: {
     *     // ... filter to delete one Client
     *   }
     * })
     * 
     */
    delete<T extends ClientDeleteArgs>(args: SelectSubset<T, ClientDeleteArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Client.
     * @param {ClientUpdateArgs} args - Arguments to update one Client.
     * @example
     * // Update one Client
     * const client = await prisma.client.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientUpdateArgs>(args: SelectSubset<T, ClientUpdateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clients.
     * @param {ClientDeleteManyArgs} args - Arguments to filter Clients to delete.
     * @example
     * // Delete a few Clients
     * const { count } = await prisma.client.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientDeleteManyArgs>(args?: SelectSubset<T, ClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientUpdateManyArgs>(args: SelectSubset<T, ClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients and returns the data updated in the database.
     * @param {ClientUpdateManyAndReturnArgs} args - Arguments to update many Clients.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.updateManyAndReturn({
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
    updateManyAndReturn<T extends ClientUpdateManyAndReturnArgs>(args: SelectSubset<T, ClientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Client.
     * @param {ClientUpsertArgs} args - Arguments to update or create a Client.
     * @example
     * // Update or create a Client
     * const client = await prisma.client.upsert({
     *   create: {
     *     // ... data to create a Client
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Client we want to update
     *   }
     * })
     */
    upsert<T extends ClientUpsertArgs>(args: SelectSubset<T, ClientUpsertArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientCountArgs} args - Arguments to filter Clients to count.
     * @example
     * // Count the number of Clients
     * const count = await prisma.client.count({
     *   where: {
     *     // ... the filter for the Clients we want to count
     *   }
     * })
    **/
    count<T extends ClientCountArgs>(
      args?: Subset<T, ClientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClientAggregateArgs>(args: Subset<T, ClientAggregateArgs>): Prisma.PrismaPromise<GetClientAggregateType<T>>

    /**
     * Group by Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientGroupByArgs} args - Group by arguments.
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
      T extends ClientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientGroupByArgs['orderBy'] }
        : { orderBy?: ClientGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Client model
   */
  readonly fields: ClientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Client.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends Client$projectsArgs<ExtArgs> = {}>(args?: Subset<T, Client$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    owner<T extends Client$ownerArgs<ExtArgs> = {}>(args?: Subset<T, Client$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sharedWith<T extends Client$sharedWithArgs<ExtArgs> = {}>(args?: Subset<T, Client$sharedWithArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Client model
   */
  interface ClientFieldRefs {
    readonly id: FieldRef<"Client", 'String'>
    readonly nombre: FieldRef<"Client", 'String'>
    readonly activo: FieldRef<"Client", 'Boolean'>
    readonly ownerId: FieldRef<"Client", 'String'>
    readonly createdAt: FieldRef<"Client", 'DateTime'>
    readonly updatedAt: FieldRef<"Client", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Client findUnique
   */
  export type ClientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findUniqueOrThrow
   */
  export type ClientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findFirst
   */
  export type ClientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findFirstOrThrow
   */
  export type ClientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findMany
   */
  export type ClientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Clients to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client create
   */
  export type ClientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to create a Client.
     */
    data: XOR<ClientCreateInput, ClientUncheckedCreateInput>
  }

  /**
   * Client createMany
   */
  export type ClientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
  }

  /**
   * Client createManyAndReturn
   */
  export type ClientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Client update
   */
  export type ClientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to update a Client.
     */
    data: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
    /**
     * Choose, which Client to update.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client updateMany
   */
  export type ClientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
  }

  /**
   * Client updateManyAndReturn
   */
  export type ClientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Client upsert
   */
  export type ClientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The filter to search for the Client to update in case it exists.
     */
    where: ClientWhereUniqueInput
    /**
     * In case the Client found by the `where` argument doesn't exist, create a new Client with this data.
     */
    create: XOR<ClientCreateInput, ClientUncheckedCreateInput>
    /**
     * In case the Client was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
  }

  /**
   * Client delete
   */
  export type ClientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter which Client to delete.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client deleteMany
   */
  export type ClientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clients to delete
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to delete.
     */
    limit?: number
  }

  /**
   * Client.projects
   */
  export type Client$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Client.owner
   */
  export type Client$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Client.sharedWith
   */
  export type Client$sharedWithArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Client without action
   */
  export type ClientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectAvgAggregateOutputType = {
    ano: number | null
  }

  export type ProjectSumAggregateOutputType = {
    ano: number | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    nombre: string | null
    ubicacion: string | null
    ano: number | null
    tipologia: string | null
    estatus: $Enums.ProjectStatus | null
    clientId: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    nombre: string | null
    ubicacion: string | null
    ano: number | null
    tipologia: string | null
    estatus: $Enums.ProjectStatus | null
    clientId: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    nombre: number
    ubicacion: number
    ano: number
    tipologia: number
    estatus: number
    clientId: number
    ownerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectAvgAggregateInputType = {
    ano?: true
  }

  export type ProjectSumAggregateInputType = {
    ano?: true
  }

  export type ProjectMinAggregateInputType = {
    id?: true
    nombre?: true
    ubicacion?: true
    ano?: true
    tipologia?: true
    estatus?: true
    clientId?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    nombre?: true
    ubicacion?: true
    ano?: true
    tipologia?: true
    estatus?: true
    clientId?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    nombre?: true
    ubicacion?: true
    ano?: true
    tipologia?: true
    estatus?: true
    clientId?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _avg?: ProjectAvgAggregateInputType
    _sum?: ProjectSumAggregateInputType
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus: $Enums.ProjectStatus
    clientId: string
    ownerId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    ubicacion?: boolean
    ano?: boolean
    tipologia?: boolean
    estatus?: boolean
    clientId?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    tasks?: boolean | Project$tasksArgs<ExtArgs>
    owner?: boolean | Project$ownerArgs<ExtArgs>
    sharedWith?: boolean | Project$sharedWithArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    ubicacion?: boolean
    ano?: boolean
    tipologia?: boolean
    estatus?: boolean
    clientId?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
    owner?: boolean | Project$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    ubicacion?: boolean
    ano?: boolean
    tipologia?: boolean
    estatus?: boolean
    clientId?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
    owner?: boolean | Project$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    nombre?: boolean
    ubicacion?: boolean
    ano?: boolean
    tipologia?: boolean
    estatus?: boolean
    clientId?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "ubicacion" | "ano" | "tipologia" | "estatus" | "clientId" | "ownerId" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    tasks?: boolean | Project$tasksArgs<ExtArgs>
    owner?: boolean | Project$ownerArgs<ExtArgs>
    sharedWith?: boolean | Project$sharedWithArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
    owner?: boolean | Project$ownerArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
    owner?: boolean | Project$ownerArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      client: Prisma.$ClientPayload<ExtArgs>
      files: Prisma.$ProjectFilePayload<ExtArgs>[]
      tasks: Prisma.$ProjectTaskPayload<ExtArgs>[]
      owner: Prisma.$UserPayload<ExtArgs> | null
      sharedWith: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nombre: string
      ubicacion: string
      ano: number
      tipologia: string
      estatus: $Enums.ProjectStatus
      clientId: string
      ownerId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
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
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    files<T extends Project$filesArgs<ExtArgs> = {}>(args?: Subset<T, Project$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tasks<T extends Project$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Project$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    owner<T extends Project$ownerArgs<ExtArgs> = {}>(args?: Subset<T, Project$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sharedWith<T extends Project$sharedWithArgs<ExtArgs> = {}>(args?: Subset<T, Project$sharedWithArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly nombre: FieldRef<"Project", 'String'>
    readonly ubicacion: FieldRef<"Project", 'String'>
    readonly ano: FieldRef<"Project", 'Int'>
    readonly tipologia: FieldRef<"Project", 'String'>
    readonly estatus: FieldRef<"Project", 'ProjectStatus'>
    readonly clientId: FieldRef<"Project", 'String'>
    readonly ownerId: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.files
   */
  export type Project$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    cursor?: ProjectFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * Project.tasks
   */
  export type Project$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    where?: ProjectTaskWhereInput
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    cursor?: ProjectTaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectTaskScalarFieldEnum | ProjectTaskScalarFieldEnum[]
  }

  /**
   * Project.owner
   */
  export type Project$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Project.sharedWith
   */
  export type Project$sharedWithArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model ProjectFile
   */

  export type AggregateProjectFile = {
    _count: ProjectFileCountAggregateOutputType | null
    _avg: ProjectFileAvgAggregateOutputType | null
    _sum: ProjectFileSumAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  export type ProjectFileAvgAggregateOutputType = {
    size: number | null
    version: number | null
  }

  export type ProjectFileSumAggregateOutputType = {
    size: number | null
    version: number | null
  }

  export type ProjectFileMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    originalName: string | null
    storedPath: string | null
    mimeType: string | null
    size: number | null
    technicalDocType: $Enums.TechnicalDocType | null
    uploadedAt: Date | null
    version: number | null
  }

  export type ProjectFileMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    originalName: string | null
    storedPath: string | null
    mimeType: string | null
    size: number | null
    technicalDocType: $Enums.TechnicalDocType | null
    uploadedAt: Date | null
    version: number | null
  }

  export type ProjectFileCountAggregateOutputType = {
    id: number
    projectId: number
    originalName: number
    storedPath: number
    mimeType: number
    size: number
    technicalDocType: number
    uploadedAt: number
    version: number
    _all: number
  }


  export type ProjectFileAvgAggregateInputType = {
    size?: true
    version?: true
  }

  export type ProjectFileSumAggregateInputType = {
    size?: true
    version?: true
  }

  export type ProjectFileMinAggregateInputType = {
    id?: true
    projectId?: true
    originalName?: true
    storedPath?: true
    mimeType?: true
    size?: true
    technicalDocType?: true
    uploadedAt?: true
    version?: true
  }

  export type ProjectFileMaxAggregateInputType = {
    id?: true
    projectId?: true
    originalName?: true
    storedPath?: true
    mimeType?: true
    size?: true
    technicalDocType?: true
    uploadedAt?: true
    version?: true
  }

  export type ProjectFileCountAggregateInputType = {
    id?: true
    projectId?: true
    originalName?: true
    storedPath?: true
    mimeType?: true
    size?: true
    technicalDocType?: true
    uploadedAt?: true
    version?: true
    _all?: true
  }

  export type ProjectFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFile to aggregate.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectFiles
    **/
    _count?: true | ProjectFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectFileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectFileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectFileMaxAggregateInputType
  }

  export type GetProjectFileAggregateType<T extends ProjectFileAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectFile[P]>
      : GetScalarType<T[P], AggregateProjectFile[P]>
  }




  export type ProjectFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithAggregationInput | ProjectFileOrderByWithAggregationInput[]
    by: ProjectFileScalarFieldEnum[] | ProjectFileScalarFieldEnum
    having?: ProjectFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectFileCountAggregateInputType | true
    _avg?: ProjectFileAvgAggregateInputType
    _sum?: ProjectFileSumAggregateInputType
    _min?: ProjectFileMinAggregateInputType
    _max?: ProjectFileMaxAggregateInputType
  }

  export type ProjectFileGroupByOutputType = {
    id: string
    projectId: string
    originalName: string
    storedPath: string
    mimeType: string
    size: number
    technicalDocType: $Enums.TechnicalDocType | null
    uploadedAt: Date
    version: number
    _count: ProjectFileCountAggregateOutputType | null
    _avg: ProjectFileAvgAggregateOutputType | null
    _sum: ProjectFileSumAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  type GetProjectFileGroupByPayload<T extends ProjectFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
        }
      >
    >


  export type ProjectFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    originalName?: boolean
    storedPath?: boolean
    mimeType?: boolean
    size?: boolean
    technicalDocType?: boolean
    uploadedAt?: boolean
    version?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    originalName?: boolean
    storedPath?: boolean
    mimeType?: boolean
    size?: boolean
    technicalDocType?: boolean
    uploadedAt?: boolean
    version?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    originalName?: boolean
    storedPath?: boolean
    mimeType?: boolean
    size?: boolean
    technicalDocType?: boolean
    uploadedAt?: boolean
    version?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectScalar = {
    id?: boolean
    projectId?: boolean
    originalName?: boolean
    storedPath?: boolean
    mimeType?: boolean
    size?: boolean
    technicalDocType?: boolean
    uploadedAt?: boolean
    version?: boolean
  }

  export type ProjectFileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "originalName" | "storedPath" | "mimeType" | "size" | "technicalDocType" | "uploadedAt" | "version", ExtArgs["result"]["projectFile"]>
  export type ProjectFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectFileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectFileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectFile"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      originalName: string
      storedPath: string
      mimeType: string
      size: number
      technicalDocType: $Enums.TechnicalDocType | null
      uploadedAt: Date
      version: number
    }, ExtArgs["result"]["projectFile"]>
    composites: {}
  }

  type ProjectFileGetPayload<S extends boolean | null | undefined | ProjectFileDefaultArgs> = $Result.GetResult<Prisma.$ProjectFilePayload, S>

  type ProjectFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectFileCountAggregateInputType | true
    }

  export interface ProjectFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectFile'], meta: { name: 'ProjectFile' } }
    /**
     * Find zero or one ProjectFile that matches the filter.
     * @param {ProjectFileFindUniqueArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFileFindUniqueArgs>(args: SelectSubset<T, ProjectFileFindUniqueArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectFile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFileFindUniqueOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFileFindFirstArgs>(args?: SelectSubset<T, ProjectFileFindFirstArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany()
     * 
     * // Get first 10 ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFileFindManyArgs>(args?: SelectSubset<T, ProjectFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectFile.
     * @param {ProjectFileCreateArgs} args - Arguments to create a ProjectFile.
     * @example
     * // Create one ProjectFile
     * const ProjectFile = await prisma.projectFile.create({
     *   data: {
     *     // ... data to create a ProjectFile
     *   }
     * })
     * 
     */
    create<T extends ProjectFileCreateArgs>(args: SelectSubset<T, ProjectFileCreateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectFiles.
     * @param {ProjectFileCreateManyArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectFileCreateManyArgs>(args?: SelectSubset<T, ProjectFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectFiles and returns the data saved in the database.
     * @param {ProjectFileCreateManyAndReturnArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectFiles and only return the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectFileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectFile.
     * @param {ProjectFileDeleteArgs} args - Arguments to delete one ProjectFile.
     * @example
     * // Delete one ProjectFile
     * const ProjectFile = await prisma.projectFile.delete({
     *   where: {
     *     // ... filter to delete one ProjectFile
     *   }
     * })
     * 
     */
    delete<T extends ProjectFileDeleteArgs>(args: SelectSubset<T, ProjectFileDeleteArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectFile.
     * @param {ProjectFileUpdateArgs} args - Arguments to update one ProjectFile.
     * @example
     * // Update one ProjectFile
     * const projectFile = await prisma.projectFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectFileUpdateArgs>(args: SelectSubset<T, ProjectFileUpdateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectFiles.
     * @param {ProjectFileDeleteManyArgs} args - Arguments to filter ProjectFiles to delete.
     * @example
     * // Delete a few ProjectFiles
     * const { count } = await prisma.projectFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectFileDeleteManyArgs>(args?: SelectSubset<T, ProjectFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectFiles
     * const projectFile = await prisma.projectFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectFileUpdateManyArgs>(args: SelectSubset<T, ProjectFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFiles and returns the data updated in the database.
     * @param {ProjectFileUpdateManyAndReturnArgs} args - Arguments to update many ProjectFiles.
     * @example
     * // Update many ProjectFiles
     * const projectFile = await prisma.projectFile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectFiles and only return the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProjectFileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectFileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectFile.
     * @param {ProjectFileUpsertArgs} args - Arguments to update or create a ProjectFile.
     * @example
     * // Update or create a ProjectFile
     * const projectFile = await prisma.projectFile.upsert({
     *   create: {
     *     // ... data to create a ProjectFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectFile we want to update
     *   }
     * })
     */
    upsert<T extends ProjectFileUpsertArgs>(args: SelectSubset<T, ProjectFileUpsertArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileCountArgs} args - Arguments to filter ProjectFiles to count.
     * @example
     * // Count the number of ProjectFiles
     * const count = await prisma.projectFile.count({
     *   where: {
     *     // ... the filter for the ProjectFiles we want to count
     *   }
     * })
    **/
    count<T extends ProjectFileCountArgs>(
      args?: Subset<T, ProjectFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProjectFileAggregateArgs>(args: Subset<T, ProjectFileAggregateArgs>): Prisma.PrismaPromise<GetProjectFileAggregateType<T>>

    /**
     * Group by ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileGroupByArgs} args - Group by arguments.
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
      T extends ProjectFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectFileGroupByArgs['orderBy'] }
        : { orderBy?: ProjectFileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProjectFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectFile model
   */
  readonly fields: ProjectFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ProjectFile model
   */
  interface ProjectFileFieldRefs {
    readonly id: FieldRef<"ProjectFile", 'String'>
    readonly projectId: FieldRef<"ProjectFile", 'String'>
    readonly originalName: FieldRef<"ProjectFile", 'String'>
    readonly storedPath: FieldRef<"ProjectFile", 'String'>
    readonly mimeType: FieldRef<"ProjectFile", 'String'>
    readonly size: FieldRef<"ProjectFile", 'Int'>
    readonly technicalDocType: FieldRef<"ProjectFile", 'TechnicalDocType'>
    readonly uploadedAt: FieldRef<"ProjectFile", 'DateTime'>
    readonly version: FieldRef<"ProjectFile", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ProjectFile findUnique
   */
  export type ProjectFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findUniqueOrThrow
   */
  export type ProjectFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findFirst
   */
  export type ProjectFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findFirstOrThrow
   */
  export type ProjectFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findMany
   */
  export type ProjectFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFiles to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile create
   */
  export type ProjectFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectFile.
     */
    data: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
  }

  /**
   * ProjectFile createMany
   */
  export type ProjectFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
  }

  /**
   * ProjectFile createManyAndReturn
   */
  export type ProjectFileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFile update
   */
  export type ProjectFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectFile.
     */
    data: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
    /**
     * Choose, which ProjectFile to update.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile updateMany
   */
  export type ProjectFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectFiles.
     */
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFiles to update
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to update.
     */
    limit?: number
  }

  /**
   * ProjectFile updateManyAndReturn
   */
  export type ProjectFileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * The data used to update ProjectFiles.
     */
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFiles to update
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFile upsert
   */
  export type ProjectFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectFile to update in case it exists.
     */
    where: ProjectFileWhereUniqueInput
    /**
     * In case the ProjectFile found by the `where` argument doesn't exist, create a new ProjectFile with this data.
     */
    create: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
    /**
     * In case the ProjectFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
  }

  /**
   * ProjectFile delete
   */
  export type ProjectFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter which ProjectFile to delete.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile deleteMany
   */
  export type ProjectFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFiles to delete
     */
    where?: ProjectFileWhereInput
    /**
     * Limit how many ProjectFiles to delete.
     */
    limit?: number
  }

  /**
   * ProjectFile without action
   */
  export type ProjectFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectFile
     */
    omit?: ProjectFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
  }


  /**
   * Model ProjectTask
   */

  export type AggregateProjectTask = {
    _count: ProjectTaskCountAggregateOutputType | null
    _min: ProjectTaskMinAggregateOutputType | null
    _max: ProjectTaskMaxAggregateOutputType | null
  }

  export type ProjectTaskMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    nombre: string | null
    disciplina: $Enums.TaskDiscipline | null
    fechaTermino: Date | null
    complejidad: $Enums.TaskComplexity | null
    actividad: $Enums.TaskActivity | null
    taskEstatus: $Enums.TaskEstatus | null
    completado: boolean | null
    comentarios: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectTaskMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    nombre: string | null
    disciplina: $Enums.TaskDiscipline | null
    fechaTermino: Date | null
    complejidad: $Enums.TaskComplexity | null
    actividad: $Enums.TaskActivity | null
    taskEstatus: $Enums.TaskEstatus | null
    completado: boolean | null
    comentarios: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectTaskCountAggregateOutputType = {
    id: number
    projectId: number
    nombre: number
    disciplina: number
    fechaTermino: number
    complejidad: number
    actividad: number
    taskEstatus: number
    completado: number
    comentarios: number
    ownerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectTaskMinAggregateInputType = {
    id?: true
    projectId?: true
    nombre?: true
    disciplina?: true
    fechaTermino?: true
    complejidad?: true
    actividad?: true
    taskEstatus?: true
    completado?: true
    comentarios?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectTaskMaxAggregateInputType = {
    id?: true
    projectId?: true
    nombre?: true
    disciplina?: true
    fechaTermino?: true
    complejidad?: true
    actividad?: true
    taskEstatus?: true
    completado?: true
    comentarios?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectTaskCountAggregateInputType = {
    id?: true
    projectId?: true
    nombre?: true
    disciplina?: true
    fechaTermino?: true
    complejidad?: true
    actividad?: true
    taskEstatus?: true
    completado?: true
    comentarios?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectTaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectTask to aggregate.
     */
    where?: ProjectTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectTasks to fetch.
     */
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectTasks
    **/
    _count?: true | ProjectTaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectTaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectTaskMaxAggregateInputType
  }

  export type GetProjectTaskAggregateType<T extends ProjectTaskAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectTask[P]>
      : GetScalarType<T[P], AggregateProjectTask[P]>
  }




  export type ProjectTaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectTaskWhereInput
    orderBy?: ProjectTaskOrderByWithAggregationInput | ProjectTaskOrderByWithAggregationInput[]
    by: ProjectTaskScalarFieldEnum[] | ProjectTaskScalarFieldEnum
    having?: ProjectTaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectTaskCountAggregateInputType | true
    _min?: ProjectTaskMinAggregateInputType
    _max?: ProjectTaskMaxAggregateInputType
  }

  export type ProjectTaskGroupByOutputType = {
    id: string
    projectId: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date
    complejidad: $Enums.TaskComplexity
    actividad: $Enums.TaskActivity
    taskEstatus: $Enums.TaskEstatus
    completado: boolean
    comentarios: string
    ownerId: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProjectTaskCountAggregateOutputType | null
    _min: ProjectTaskMinAggregateOutputType | null
    _max: ProjectTaskMaxAggregateOutputType | null
  }

  type GetProjectTaskGroupByPayload<T extends ProjectTaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectTaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectTaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectTaskGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectTaskGroupByOutputType[P]>
        }
      >
    >


  export type ProjectTaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    nombre?: boolean
    disciplina?: boolean
    fechaTermino?: boolean
    complejidad?: boolean
    actividad?: boolean
    taskEstatus?: boolean
    completado?: boolean
    comentarios?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    owner?: boolean | ProjectTask$ownerArgs<ExtArgs>
    sharedWith?: boolean | ProjectTask$sharedWithArgs<ExtArgs>
    _count?: boolean | ProjectTaskCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectTask"]>

  export type ProjectTaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    nombre?: boolean
    disciplina?: boolean
    fechaTermino?: boolean
    complejidad?: boolean
    actividad?: boolean
    taskEstatus?: boolean
    completado?: boolean
    comentarios?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    owner?: boolean | ProjectTask$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["projectTask"]>

  export type ProjectTaskSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    nombre?: boolean
    disciplina?: boolean
    fechaTermino?: boolean
    complejidad?: boolean
    actividad?: boolean
    taskEstatus?: boolean
    completado?: boolean
    comentarios?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    owner?: boolean | ProjectTask$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["projectTask"]>

  export type ProjectTaskSelectScalar = {
    id?: boolean
    projectId?: boolean
    nombre?: boolean
    disciplina?: boolean
    fechaTermino?: boolean
    complejidad?: boolean
    actividad?: boolean
    taskEstatus?: boolean
    completado?: boolean
    comentarios?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectTaskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "nombre" | "disciplina" | "fechaTermino" | "complejidad" | "actividad" | "taskEstatus" | "completado" | "comentarios" | "ownerId" | "createdAt" | "updatedAt", ExtArgs["result"]["projectTask"]>
  export type ProjectTaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    owner?: boolean | ProjectTask$ownerArgs<ExtArgs>
    sharedWith?: boolean | ProjectTask$sharedWithArgs<ExtArgs>
    _count?: boolean | ProjectTaskCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectTaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    owner?: boolean | ProjectTask$ownerArgs<ExtArgs>
  }
  export type ProjectTaskIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    owner?: boolean | ProjectTask$ownerArgs<ExtArgs>
  }

  export type $ProjectTaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectTask"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      owner: Prisma.$UserPayload<ExtArgs> | null
      sharedWith: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      nombre: string
      disciplina: $Enums.TaskDiscipline
      fechaTermino: Date
      complejidad: $Enums.TaskComplexity
      actividad: $Enums.TaskActivity
      taskEstatus: $Enums.TaskEstatus
      completado: boolean
      comentarios: string
      ownerId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["projectTask"]>
    composites: {}
  }

  type ProjectTaskGetPayload<S extends boolean | null | undefined | ProjectTaskDefaultArgs> = $Result.GetResult<Prisma.$ProjectTaskPayload, S>

  type ProjectTaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectTaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectTaskCountAggregateInputType | true
    }

  export interface ProjectTaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectTask'], meta: { name: 'ProjectTask' } }
    /**
     * Find zero or one ProjectTask that matches the filter.
     * @param {ProjectTaskFindUniqueArgs} args - Arguments to find a ProjectTask
     * @example
     * // Get one ProjectTask
     * const projectTask = await prisma.projectTask.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectTaskFindUniqueArgs>(args: SelectSubset<T, ProjectTaskFindUniqueArgs<ExtArgs>>): Prisma__ProjectTaskClient<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectTask that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectTaskFindUniqueOrThrowArgs} args - Arguments to find a ProjectTask
     * @example
     * // Get one ProjectTask
     * const projectTask = await prisma.projectTask.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectTaskFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectTaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectTaskClient<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectTask that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskFindFirstArgs} args - Arguments to find a ProjectTask
     * @example
     * // Get one ProjectTask
     * const projectTask = await prisma.projectTask.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectTaskFindFirstArgs>(args?: SelectSubset<T, ProjectTaskFindFirstArgs<ExtArgs>>): Prisma__ProjectTaskClient<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectTask that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskFindFirstOrThrowArgs} args - Arguments to find a ProjectTask
     * @example
     * // Get one ProjectTask
     * const projectTask = await prisma.projectTask.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectTaskFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectTaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectTaskClient<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectTasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectTasks
     * const projectTasks = await prisma.projectTask.findMany()
     * 
     * // Get first 10 ProjectTasks
     * const projectTasks = await prisma.projectTask.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectTaskWithIdOnly = await prisma.projectTask.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectTaskFindManyArgs>(args?: SelectSubset<T, ProjectTaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectTask.
     * @param {ProjectTaskCreateArgs} args - Arguments to create a ProjectTask.
     * @example
     * // Create one ProjectTask
     * const ProjectTask = await prisma.projectTask.create({
     *   data: {
     *     // ... data to create a ProjectTask
     *   }
     * })
     * 
     */
    create<T extends ProjectTaskCreateArgs>(args: SelectSubset<T, ProjectTaskCreateArgs<ExtArgs>>): Prisma__ProjectTaskClient<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectTasks.
     * @param {ProjectTaskCreateManyArgs} args - Arguments to create many ProjectTasks.
     * @example
     * // Create many ProjectTasks
     * const projectTask = await prisma.projectTask.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectTaskCreateManyArgs>(args?: SelectSubset<T, ProjectTaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectTasks and returns the data saved in the database.
     * @param {ProjectTaskCreateManyAndReturnArgs} args - Arguments to create many ProjectTasks.
     * @example
     * // Create many ProjectTasks
     * const projectTask = await prisma.projectTask.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectTasks and only return the `id`
     * const projectTaskWithIdOnly = await prisma.projectTask.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectTaskCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectTaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProjectTask.
     * @param {ProjectTaskDeleteArgs} args - Arguments to delete one ProjectTask.
     * @example
     * // Delete one ProjectTask
     * const ProjectTask = await prisma.projectTask.delete({
     *   where: {
     *     // ... filter to delete one ProjectTask
     *   }
     * })
     * 
     */
    delete<T extends ProjectTaskDeleteArgs>(args: SelectSubset<T, ProjectTaskDeleteArgs<ExtArgs>>): Prisma__ProjectTaskClient<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectTask.
     * @param {ProjectTaskUpdateArgs} args - Arguments to update one ProjectTask.
     * @example
     * // Update one ProjectTask
     * const projectTask = await prisma.projectTask.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectTaskUpdateArgs>(args: SelectSubset<T, ProjectTaskUpdateArgs<ExtArgs>>): Prisma__ProjectTaskClient<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectTasks.
     * @param {ProjectTaskDeleteManyArgs} args - Arguments to filter ProjectTasks to delete.
     * @example
     * // Delete a few ProjectTasks
     * const { count } = await prisma.projectTask.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectTaskDeleteManyArgs>(args?: SelectSubset<T, ProjectTaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectTasks
     * const projectTask = await prisma.projectTask.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectTaskUpdateManyArgs>(args: SelectSubset<T, ProjectTaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectTasks and returns the data updated in the database.
     * @param {ProjectTaskUpdateManyAndReturnArgs} args - Arguments to update many ProjectTasks.
     * @example
     * // Update many ProjectTasks
     * const projectTask = await prisma.projectTask.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProjectTasks and only return the `id`
     * const projectTaskWithIdOnly = await prisma.projectTask.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProjectTaskUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectTaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProjectTask.
     * @param {ProjectTaskUpsertArgs} args - Arguments to update or create a ProjectTask.
     * @example
     * // Update or create a ProjectTask
     * const projectTask = await prisma.projectTask.upsert({
     *   create: {
     *     // ... data to create a ProjectTask
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectTask we want to update
     *   }
     * })
     */
    upsert<T extends ProjectTaskUpsertArgs>(args: SelectSubset<T, ProjectTaskUpsertArgs<ExtArgs>>): Prisma__ProjectTaskClient<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskCountArgs} args - Arguments to filter ProjectTasks to count.
     * @example
     * // Count the number of ProjectTasks
     * const count = await prisma.projectTask.count({
     *   where: {
     *     // ... the filter for the ProjectTasks we want to count
     *   }
     * })
    **/
    count<T extends ProjectTaskCountArgs>(
      args?: Subset<T, ProjectTaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectTaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProjectTaskAggregateArgs>(args: Subset<T, ProjectTaskAggregateArgs>): Prisma.PrismaPromise<GetProjectTaskAggregateType<T>>

    /**
     * Group by ProjectTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectTaskGroupByArgs} args - Group by arguments.
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
      T extends ProjectTaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectTaskGroupByArgs['orderBy'] }
        : { orderBy?: ProjectTaskGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProjectTaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectTask model
   */
  readonly fields: ProjectTaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectTask.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectTaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    owner<T extends ProjectTask$ownerArgs<ExtArgs> = {}>(args?: Subset<T, ProjectTask$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sharedWith<T extends ProjectTask$sharedWithArgs<ExtArgs> = {}>(args?: Subset<T, ProjectTask$sharedWithArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ProjectTask model
   */
  interface ProjectTaskFieldRefs {
    readonly id: FieldRef<"ProjectTask", 'String'>
    readonly projectId: FieldRef<"ProjectTask", 'String'>
    readonly nombre: FieldRef<"ProjectTask", 'String'>
    readonly disciplina: FieldRef<"ProjectTask", 'TaskDiscipline'>
    readonly fechaTermino: FieldRef<"ProjectTask", 'DateTime'>
    readonly complejidad: FieldRef<"ProjectTask", 'TaskComplexity'>
    readonly actividad: FieldRef<"ProjectTask", 'TaskActivity'>
    readonly taskEstatus: FieldRef<"ProjectTask", 'TaskEstatus'>
    readonly completado: FieldRef<"ProjectTask", 'Boolean'>
    readonly comentarios: FieldRef<"ProjectTask", 'String'>
    readonly ownerId: FieldRef<"ProjectTask", 'String'>
    readonly createdAt: FieldRef<"ProjectTask", 'DateTime'>
    readonly updatedAt: FieldRef<"ProjectTask", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectTask findUnique
   */
  export type ProjectTaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectTask to fetch.
     */
    where: ProjectTaskWhereUniqueInput
  }

  /**
   * ProjectTask findUniqueOrThrow
   */
  export type ProjectTaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectTask to fetch.
     */
    where: ProjectTaskWhereUniqueInput
  }

  /**
   * ProjectTask findFirst
   */
  export type ProjectTaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectTask to fetch.
     */
    where?: ProjectTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectTasks to fetch.
     */
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectTasks.
     */
    cursor?: ProjectTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectTasks.
     */
    distinct?: ProjectTaskScalarFieldEnum | ProjectTaskScalarFieldEnum[]
  }

  /**
   * ProjectTask findFirstOrThrow
   */
  export type ProjectTaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectTask to fetch.
     */
    where?: ProjectTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectTasks to fetch.
     */
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectTasks.
     */
    cursor?: ProjectTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectTasks.
     */
    distinct?: ProjectTaskScalarFieldEnum | ProjectTaskScalarFieldEnum[]
  }

  /**
   * ProjectTask findMany
   */
  export type ProjectTaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter, which ProjectTasks to fetch.
     */
    where?: ProjectTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectTasks to fetch.
     */
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectTasks.
     */
    cursor?: ProjectTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectTasks.
     */
    distinct?: ProjectTaskScalarFieldEnum | ProjectTaskScalarFieldEnum[]
  }

  /**
   * ProjectTask create
   */
  export type ProjectTaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectTask.
     */
    data: XOR<ProjectTaskCreateInput, ProjectTaskUncheckedCreateInput>
  }

  /**
   * ProjectTask createMany
   */
  export type ProjectTaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectTasks.
     */
    data: ProjectTaskCreateManyInput | ProjectTaskCreateManyInput[]
  }

  /**
   * ProjectTask createManyAndReturn
   */
  export type ProjectTaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * The data used to create many ProjectTasks.
     */
    data: ProjectTaskCreateManyInput | ProjectTaskCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectTask update
   */
  export type ProjectTaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectTask.
     */
    data: XOR<ProjectTaskUpdateInput, ProjectTaskUncheckedUpdateInput>
    /**
     * Choose, which ProjectTask to update.
     */
    where: ProjectTaskWhereUniqueInput
  }

  /**
   * ProjectTask updateMany
   */
  export type ProjectTaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectTasks.
     */
    data: XOR<ProjectTaskUpdateManyMutationInput, ProjectTaskUncheckedUpdateManyInput>
    /**
     * Filter which ProjectTasks to update
     */
    where?: ProjectTaskWhereInput
    /**
     * Limit how many ProjectTasks to update.
     */
    limit?: number
  }

  /**
   * ProjectTask updateManyAndReturn
   */
  export type ProjectTaskUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * The data used to update ProjectTasks.
     */
    data: XOR<ProjectTaskUpdateManyMutationInput, ProjectTaskUncheckedUpdateManyInput>
    /**
     * Filter which ProjectTasks to update
     */
    where?: ProjectTaskWhereInput
    /**
     * Limit how many ProjectTasks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectTask upsert
   */
  export type ProjectTaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectTask to update in case it exists.
     */
    where: ProjectTaskWhereUniqueInput
    /**
     * In case the ProjectTask found by the `where` argument doesn't exist, create a new ProjectTask with this data.
     */
    create: XOR<ProjectTaskCreateInput, ProjectTaskUncheckedCreateInput>
    /**
     * In case the ProjectTask was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectTaskUpdateInput, ProjectTaskUncheckedUpdateInput>
  }

  /**
   * ProjectTask delete
   */
  export type ProjectTaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    /**
     * Filter which ProjectTask to delete.
     */
    where: ProjectTaskWhereUniqueInput
  }

  /**
   * ProjectTask deleteMany
   */
  export type ProjectTaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectTasks to delete
     */
    where?: ProjectTaskWhereInput
    /**
     * Limit how many ProjectTasks to delete.
     */
    limit?: number
  }

  /**
   * ProjectTask.owner
   */
  export type ProjectTask$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ProjectTask.sharedWith
   */
  export type ProjectTask$sharedWithArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * ProjectTask without action
   */
  export type ProjectTaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
  }


  /**
   * Model KnowledgeReference
   */

  export type AggregateKnowledgeReference = {
    _count: KnowledgeReferenceCountAggregateOutputType | null
    _avg: KnowledgeReferenceAvgAggregateOutputType | null
    _sum: KnowledgeReferenceSumAggregateOutputType | null
    _min: KnowledgeReferenceMinAggregateOutputType | null
    _max: KnowledgeReferenceMaxAggregateOutputType | null
  }

  export type KnowledgeReferenceAvgAggregateOutputType = {
    orden: number | null
  }

  export type KnowledgeReferenceSumAggregateOutputType = {
    orden: number | null
  }

  export type KnowledgeReferenceMinAggregateOutputType = {
    id: string | null
    category: $Enums.KnowledgeCategory | null
    titulo: string | null
    descripcion: string | null
    url: string | null
    fuente: string | null
    orden: number | null
    createdAt: Date | null
  }

  export type KnowledgeReferenceMaxAggregateOutputType = {
    id: string | null
    category: $Enums.KnowledgeCategory | null
    titulo: string | null
    descripcion: string | null
    url: string | null
    fuente: string | null
    orden: number | null
    createdAt: Date | null
  }

  export type KnowledgeReferenceCountAggregateOutputType = {
    id: number
    category: number
    titulo: number
    descripcion: number
    url: number
    fuente: number
    orden: number
    createdAt: number
    _all: number
  }


  export type KnowledgeReferenceAvgAggregateInputType = {
    orden?: true
  }

  export type KnowledgeReferenceSumAggregateInputType = {
    orden?: true
  }

  export type KnowledgeReferenceMinAggregateInputType = {
    id?: true
    category?: true
    titulo?: true
    descripcion?: true
    url?: true
    fuente?: true
    orden?: true
    createdAt?: true
  }

  export type KnowledgeReferenceMaxAggregateInputType = {
    id?: true
    category?: true
    titulo?: true
    descripcion?: true
    url?: true
    fuente?: true
    orden?: true
    createdAt?: true
  }

  export type KnowledgeReferenceCountAggregateInputType = {
    id?: true
    category?: true
    titulo?: true
    descripcion?: true
    url?: true
    fuente?: true
    orden?: true
    createdAt?: true
    _all?: true
  }

  export type KnowledgeReferenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeReference to aggregate.
     */
    where?: KnowledgeReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeReferences to fetch.
     */
    orderBy?: KnowledgeReferenceOrderByWithRelationInput | KnowledgeReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KnowledgeReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeReferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeReferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KnowledgeReferences
    **/
    _count?: true | KnowledgeReferenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KnowledgeReferenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KnowledgeReferenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KnowledgeReferenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KnowledgeReferenceMaxAggregateInputType
  }

  export type GetKnowledgeReferenceAggregateType<T extends KnowledgeReferenceAggregateArgs> = {
        [P in keyof T & keyof AggregateKnowledgeReference]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKnowledgeReference[P]>
      : GetScalarType<T[P], AggregateKnowledgeReference[P]>
  }




  export type KnowledgeReferenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KnowledgeReferenceWhereInput
    orderBy?: KnowledgeReferenceOrderByWithAggregationInput | KnowledgeReferenceOrderByWithAggregationInput[]
    by: KnowledgeReferenceScalarFieldEnum[] | KnowledgeReferenceScalarFieldEnum
    having?: KnowledgeReferenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KnowledgeReferenceCountAggregateInputType | true
    _avg?: KnowledgeReferenceAvgAggregateInputType
    _sum?: KnowledgeReferenceSumAggregateInputType
    _min?: KnowledgeReferenceMinAggregateInputType
    _max?: KnowledgeReferenceMaxAggregateInputType
  }

  export type KnowledgeReferenceGroupByOutputType = {
    id: string
    category: $Enums.KnowledgeCategory
    titulo: string
    descripcion: string | null
    url: string | null
    fuente: string | null
    orden: number
    createdAt: Date
    _count: KnowledgeReferenceCountAggregateOutputType | null
    _avg: KnowledgeReferenceAvgAggregateOutputType | null
    _sum: KnowledgeReferenceSumAggregateOutputType | null
    _min: KnowledgeReferenceMinAggregateOutputType | null
    _max: KnowledgeReferenceMaxAggregateOutputType | null
  }

  type GetKnowledgeReferenceGroupByPayload<T extends KnowledgeReferenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KnowledgeReferenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KnowledgeReferenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KnowledgeReferenceGroupByOutputType[P]>
            : GetScalarType<T[P], KnowledgeReferenceGroupByOutputType[P]>
        }
      >
    >


  export type KnowledgeReferenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    category?: boolean
    titulo?: boolean
    descripcion?: boolean
    url?: boolean
    fuente?: boolean
    orden?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["knowledgeReference"]>

  export type KnowledgeReferenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    category?: boolean
    titulo?: boolean
    descripcion?: boolean
    url?: boolean
    fuente?: boolean
    orden?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["knowledgeReference"]>

  export type KnowledgeReferenceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    category?: boolean
    titulo?: boolean
    descripcion?: boolean
    url?: boolean
    fuente?: boolean
    orden?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["knowledgeReference"]>

  export type KnowledgeReferenceSelectScalar = {
    id?: boolean
    category?: boolean
    titulo?: boolean
    descripcion?: boolean
    url?: boolean
    fuente?: boolean
    orden?: boolean
    createdAt?: boolean
  }

  export type KnowledgeReferenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "category" | "titulo" | "descripcion" | "url" | "fuente" | "orden" | "createdAt", ExtArgs["result"]["knowledgeReference"]>

  export type $KnowledgeReferencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KnowledgeReference"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      category: $Enums.KnowledgeCategory
      titulo: string
      descripcion: string | null
      url: string | null
      fuente: string | null
      orden: number
      createdAt: Date
    }, ExtArgs["result"]["knowledgeReference"]>
    composites: {}
  }

  type KnowledgeReferenceGetPayload<S extends boolean | null | undefined | KnowledgeReferenceDefaultArgs> = $Result.GetResult<Prisma.$KnowledgeReferencePayload, S>

  type KnowledgeReferenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KnowledgeReferenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KnowledgeReferenceCountAggregateInputType | true
    }

  export interface KnowledgeReferenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KnowledgeReference'], meta: { name: 'KnowledgeReference' } }
    /**
     * Find zero or one KnowledgeReference that matches the filter.
     * @param {KnowledgeReferenceFindUniqueArgs} args - Arguments to find a KnowledgeReference
     * @example
     * // Get one KnowledgeReference
     * const knowledgeReference = await prisma.knowledgeReference.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KnowledgeReferenceFindUniqueArgs>(args: SelectSubset<T, KnowledgeReferenceFindUniqueArgs<ExtArgs>>): Prisma__KnowledgeReferenceClient<$Result.GetResult<Prisma.$KnowledgeReferencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KnowledgeReference that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KnowledgeReferenceFindUniqueOrThrowArgs} args - Arguments to find a KnowledgeReference
     * @example
     * // Get one KnowledgeReference
     * const knowledgeReference = await prisma.knowledgeReference.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KnowledgeReferenceFindUniqueOrThrowArgs>(args: SelectSubset<T, KnowledgeReferenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KnowledgeReferenceClient<$Result.GetResult<Prisma.$KnowledgeReferencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeReference that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeReferenceFindFirstArgs} args - Arguments to find a KnowledgeReference
     * @example
     * // Get one KnowledgeReference
     * const knowledgeReference = await prisma.knowledgeReference.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KnowledgeReferenceFindFirstArgs>(args?: SelectSubset<T, KnowledgeReferenceFindFirstArgs<ExtArgs>>): Prisma__KnowledgeReferenceClient<$Result.GetResult<Prisma.$KnowledgeReferencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KnowledgeReference that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeReferenceFindFirstOrThrowArgs} args - Arguments to find a KnowledgeReference
     * @example
     * // Get one KnowledgeReference
     * const knowledgeReference = await prisma.knowledgeReference.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KnowledgeReferenceFindFirstOrThrowArgs>(args?: SelectSubset<T, KnowledgeReferenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__KnowledgeReferenceClient<$Result.GetResult<Prisma.$KnowledgeReferencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KnowledgeReferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeReferenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KnowledgeReferences
     * const knowledgeReferences = await prisma.knowledgeReference.findMany()
     * 
     * // Get first 10 KnowledgeReferences
     * const knowledgeReferences = await prisma.knowledgeReference.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const knowledgeReferenceWithIdOnly = await prisma.knowledgeReference.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KnowledgeReferenceFindManyArgs>(args?: SelectSubset<T, KnowledgeReferenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeReferencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KnowledgeReference.
     * @param {KnowledgeReferenceCreateArgs} args - Arguments to create a KnowledgeReference.
     * @example
     * // Create one KnowledgeReference
     * const KnowledgeReference = await prisma.knowledgeReference.create({
     *   data: {
     *     // ... data to create a KnowledgeReference
     *   }
     * })
     * 
     */
    create<T extends KnowledgeReferenceCreateArgs>(args: SelectSubset<T, KnowledgeReferenceCreateArgs<ExtArgs>>): Prisma__KnowledgeReferenceClient<$Result.GetResult<Prisma.$KnowledgeReferencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KnowledgeReferences.
     * @param {KnowledgeReferenceCreateManyArgs} args - Arguments to create many KnowledgeReferences.
     * @example
     * // Create many KnowledgeReferences
     * const knowledgeReference = await prisma.knowledgeReference.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KnowledgeReferenceCreateManyArgs>(args?: SelectSubset<T, KnowledgeReferenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KnowledgeReferences and returns the data saved in the database.
     * @param {KnowledgeReferenceCreateManyAndReturnArgs} args - Arguments to create many KnowledgeReferences.
     * @example
     * // Create many KnowledgeReferences
     * const knowledgeReference = await prisma.knowledgeReference.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KnowledgeReferences and only return the `id`
     * const knowledgeReferenceWithIdOnly = await prisma.knowledgeReference.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KnowledgeReferenceCreateManyAndReturnArgs>(args?: SelectSubset<T, KnowledgeReferenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeReferencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KnowledgeReference.
     * @param {KnowledgeReferenceDeleteArgs} args - Arguments to delete one KnowledgeReference.
     * @example
     * // Delete one KnowledgeReference
     * const KnowledgeReference = await prisma.knowledgeReference.delete({
     *   where: {
     *     // ... filter to delete one KnowledgeReference
     *   }
     * })
     * 
     */
    delete<T extends KnowledgeReferenceDeleteArgs>(args: SelectSubset<T, KnowledgeReferenceDeleteArgs<ExtArgs>>): Prisma__KnowledgeReferenceClient<$Result.GetResult<Prisma.$KnowledgeReferencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KnowledgeReference.
     * @param {KnowledgeReferenceUpdateArgs} args - Arguments to update one KnowledgeReference.
     * @example
     * // Update one KnowledgeReference
     * const knowledgeReference = await prisma.knowledgeReference.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KnowledgeReferenceUpdateArgs>(args: SelectSubset<T, KnowledgeReferenceUpdateArgs<ExtArgs>>): Prisma__KnowledgeReferenceClient<$Result.GetResult<Prisma.$KnowledgeReferencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KnowledgeReferences.
     * @param {KnowledgeReferenceDeleteManyArgs} args - Arguments to filter KnowledgeReferences to delete.
     * @example
     * // Delete a few KnowledgeReferences
     * const { count } = await prisma.knowledgeReference.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KnowledgeReferenceDeleteManyArgs>(args?: SelectSubset<T, KnowledgeReferenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeReferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeReferenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KnowledgeReferences
     * const knowledgeReference = await prisma.knowledgeReference.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KnowledgeReferenceUpdateManyArgs>(args: SelectSubset<T, KnowledgeReferenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KnowledgeReferences and returns the data updated in the database.
     * @param {KnowledgeReferenceUpdateManyAndReturnArgs} args - Arguments to update many KnowledgeReferences.
     * @example
     * // Update many KnowledgeReferences
     * const knowledgeReference = await prisma.knowledgeReference.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KnowledgeReferences and only return the `id`
     * const knowledgeReferenceWithIdOnly = await prisma.knowledgeReference.updateManyAndReturn({
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
    updateManyAndReturn<T extends KnowledgeReferenceUpdateManyAndReturnArgs>(args: SelectSubset<T, KnowledgeReferenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KnowledgeReferencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KnowledgeReference.
     * @param {KnowledgeReferenceUpsertArgs} args - Arguments to update or create a KnowledgeReference.
     * @example
     * // Update or create a KnowledgeReference
     * const knowledgeReference = await prisma.knowledgeReference.upsert({
     *   create: {
     *     // ... data to create a KnowledgeReference
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KnowledgeReference we want to update
     *   }
     * })
     */
    upsert<T extends KnowledgeReferenceUpsertArgs>(args: SelectSubset<T, KnowledgeReferenceUpsertArgs<ExtArgs>>): Prisma__KnowledgeReferenceClient<$Result.GetResult<Prisma.$KnowledgeReferencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KnowledgeReferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeReferenceCountArgs} args - Arguments to filter KnowledgeReferences to count.
     * @example
     * // Count the number of KnowledgeReferences
     * const count = await prisma.knowledgeReference.count({
     *   where: {
     *     // ... the filter for the KnowledgeReferences we want to count
     *   }
     * })
    **/
    count<T extends KnowledgeReferenceCountArgs>(
      args?: Subset<T, KnowledgeReferenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KnowledgeReferenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KnowledgeReference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeReferenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends KnowledgeReferenceAggregateArgs>(args: Subset<T, KnowledgeReferenceAggregateArgs>): Prisma.PrismaPromise<GetKnowledgeReferenceAggregateType<T>>

    /**
     * Group by KnowledgeReference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KnowledgeReferenceGroupByArgs} args - Group by arguments.
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
      T extends KnowledgeReferenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KnowledgeReferenceGroupByArgs['orderBy'] }
        : { orderBy?: KnowledgeReferenceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, KnowledgeReferenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKnowledgeReferenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KnowledgeReference model
   */
  readonly fields: KnowledgeReferenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KnowledgeReference.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KnowledgeReferenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the KnowledgeReference model
   */
  interface KnowledgeReferenceFieldRefs {
    readonly id: FieldRef<"KnowledgeReference", 'String'>
    readonly category: FieldRef<"KnowledgeReference", 'KnowledgeCategory'>
    readonly titulo: FieldRef<"KnowledgeReference", 'String'>
    readonly descripcion: FieldRef<"KnowledgeReference", 'String'>
    readonly url: FieldRef<"KnowledgeReference", 'String'>
    readonly fuente: FieldRef<"KnowledgeReference", 'String'>
    readonly orden: FieldRef<"KnowledgeReference", 'Int'>
    readonly createdAt: FieldRef<"KnowledgeReference", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KnowledgeReference findUnique
   */
  export type KnowledgeReferenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeReference to fetch.
     */
    where: KnowledgeReferenceWhereUniqueInput
  }

  /**
   * KnowledgeReference findUniqueOrThrow
   */
  export type KnowledgeReferenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeReference to fetch.
     */
    where: KnowledgeReferenceWhereUniqueInput
  }

  /**
   * KnowledgeReference findFirst
   */
  export type KnowledgeReferenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeReference to fetch.
     */
    where?: KnowledgeReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeReferences to fetch.
     */
    orderBy?: KnowledgeReferenceOrderByWithRelationInput | KnowledgeReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeReferences.
     */
    cursor?: KnowledgeReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeReferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeReferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeReferences.
     */
    distinct?: KnowledgeReferenceScalarFieldEnum | KnowledgeReferenceScalarFieldEnum[]
  }

  /**
   * KnowledgeReference findFirstOrThrow
   */
  export type KnowledgeReferenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeReference to fetch.
     */
    where?: KnowledgeReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeReferences to fetch.
     */
    orderBy?: KnowledgeReferenceOrderByWithRelationInput | KnowledgeReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KnowledgeReferences.
     */
    cursor?: KnowledgeReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeReferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeReferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeReferences.
     */
    distinct?: KnowledgeReferenceScalarFieldEnum | KnowledgeReferenceScalarFieldEnum[]
  }

  /**
   * KnowledgeReference findMany
   */
  export type KnowledgeReferenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
    /**
     * Filter, which KnowledgeReferences to fetch.
     */
    where?: KnowledgeReferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KnowledgeReferences to fetch.
     */
    orderBy?: KnowledgeReferenceOrderByWithRelationInput | KnowledgeReferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KnowledgeReferences.
     */
    cursor?: KnowledgeReferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KnowledgeReferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KnowledgeReferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KnowledgeReferences.
     */
    distinct?: KnowledgeReferenceScalarFieldEnum | KnowledgeReferenceScalarFieldEnum[]
  }

  /**
   * KnowledgeReference create
   */
  export type KnowledgeReferenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
    /**
     * The data needed to create a KnowledgeReference.
     */
    data: XOR<KnowledgeReferenceCreateInput, KnowledgeReferenceUncheckedCreateInput>
  }

  /**
   * KnowledgeReference createMany
   */
  export type KnowledgeReferenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KnowledgeReferences.
     */
    data: KnowledgeReferenceCreateManyInput | KnowledgeReferenceCreateManyInput[]
  }

  /**
   * KnowledgeReference createManyAndReturn
   */
  export type KnowledgeReferenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
    /**
     * The data used to create many KnowledgeReferences.
     */
    data: KnowledgeReferenceCreateManyInput | KnowledgeReferenceCreateManyInput[]
  }

  /**
   * KnowledgeReference update
   */
  export type KnowledgeReferenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
    /**
     * The data needed to update a KnowledgeReference.
     */
    data: XOR<KnowledgeReferenceUpdateInput, KnowledgeReferenceUncheckedUpdateInput>
    /**
     * Choose, which KnowledgeReference to update.
     */
    where: KnowledgeReferenceWhereUniqueInput
  }

  /**
   * KnowledgeReference updateMany
   */
  export type KnowledgeReferenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KnowledgeReferences.
     */
    data: XOR<KnowledgeReferenceUpdateManyMutationInput, KnowledgeReferenceUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeReferences to update
     */
    where?: KnowledgeReferenceWhereInput
    /**
     * Limit how many KnowledgeReferences to update.
     */
    limit?: number
  }

  /**
   * KnowledgeReference updateManyAndReturn
   */
  export type KnowledgeReferenceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
    /**
     * The data used to update KnowledgeReferences.
     */
    data: XOR<KnowledgeReferenceUpdateManyMutationInput, KnowledgeReferenceUncheckedUpdateManyInput>
    /**
     * Filter which KnowledgeReferences to update
     */
    where?: KnowledgeReferenceWhereInput
    /**
     * Limit how many KnowledgeReferences to update.
     */
    limit?: number
  }

  /**
   * KnowledgeReference upsert
   */
  export type KnowledgeReferenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
    /**
     * The filter to search for the KnowledgeReference to update in case it exists.
     */
    where: KnowledgeReferenceWhereUniqueInput
    /**
     * In case the KnowledgeReference found by the `where` argument doesn't exist, create a new KnowledgeReference with this data.
     */
    create: XOR<KnowledgeReferenceCreateInput, KnowledgeReferenceUncheckedCreateInput>
    /**
     * In case the KnowledgeReference was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KnowledgeReferenceUpdateInput, KnowledgeReferenceUncheckedUpdateInput>
  }

  /**
   * KnowledgeReference delete
   */
  export type KnowledgeReferenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
    /**
     * Filter which KnowledgeReference to delete.
     */
    where: KnowledgeReferenceWhereUniqueInput
  }

  /**
   * KnowledgeReference deleteMany
   */
  export type KnowledgeReferenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KnowledgeReferences to delete
     */
    where?: KnowledgeReferenceWhereInput
    /**
     * Limit how many KnowledgeReferences to delete.
     */
    limit?: number
  }

  /**
   * KnowledgeReference without action
   */
  export type KnowledgeReferenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KnowledgeReference
     */
    select?: KnowledgeReferenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KnowledgeReference
     */
    omit?: KnowledgeReferenceOmit<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    nombre: string | null
    pin: string | null
    rol: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    nombre: string | null
    pin: string | null
    rol: $Enums.UserRole | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    nombre: number
    pin: number
    rol: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    nombre?: true
    pin?: true
    rol?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    nombre?: true
    pin?: true
    rol?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    nombre?: true
    pin?: true
    rol?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    nombre: string
    pin: string
    rol: $Enums.UserRole
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    pin?: boolean
    rol?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ownedClients?: boolean | User$ownedClientsArgs<ExtArgs>
    sharedClients?: boolean | User$sharedClientsArgs<ExtArgs>
    ownedProjects?: boolean | User$ownedProjectsArgs<ExtArgs>
    sharedProjects?: boolean | User$sharedProjectsArgs<ExtArgs>
    ownedTasks?: boolean | User$ownedTasksArgs<ExtArgs>
    sharedTasks?: boolean | User$sharedTasksArgs<ExtArgs>
    sentInvitations?: boolean | User$sentInvitationsArgs<ExtArgs>
    receivedInvitations?: boolean | User$receivedInvitationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    pin?: boolean
    rol?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nombre?: boolean
    pin?: boolean
    rol?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    nombre?: boolean
    pin?: boolean
    rol?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nombre" | "pin" | "rol" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownedClients?: boolean | User$ownedClientsArgs<ExtArgs>
    sharedClients?: boolean | User$sharedClientsArgs<ExtArgs>
    ownedProjects?: boolean | User$ownedProjectsArgs<ExtArgs>
    sharedProjects?: boolean | User$sharedProjectsArgs<ExtArgs>
    ownedTasks?: boolean | User$ownedTasksArgs<ExtArgs>
    sharedTasks?: boolean | User$sharedTasksArgs<ExtArgs>
    sentInvitations?: boolean | User$sentInvitationsArgs<ExtArgs>
    receivedInvitations?: boolean | User$receivedInvitationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      ownedClients: Prisma.$ClientPayload<ExtArgs>[]
      sharedClients: Prisma.$ClientPayload<ExtArgs>[]
      ownedProjects: Prisma.$ProjectPayload<ExtArgs>[]
      sharedProjects: Prisma.$ProjectPayload<ExtArgs>[]
      ownedTasks: Prisma.$ProjectTaskPayload<ExtArgs>[]
      sharedTasks: Prisma.$ProjectTaskPayload<ExtArgs>[]
      sentInvitations: Prisma.$InvitationPayload<ExtArgs>[]
      receivedInvitations: Prisma.$InvitationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nombre: string
      pin: string
      rol: $Enums.UserRole
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ownedClients<T extends User$ownedClientsArgs<ExtArgs> = {}>(args?: Subset<T, User$ownedClientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sharedClients<T extends User$sharedClientsArgs<ExtArgs> = {}>(args?: Subset<T, User$sharedClientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ownedProjects<T extends User$ownedProjectsArgs<ExtArgs> = {}>(args?: Subset<T, User$ownedProjectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sharedProjects<T extends User$sharedProjectsArgs<ExtArgs> = {}>(args?: Subset<T, User$sharedProjectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ownedTasks<T extends User$ownedTasksArgs<ExtArgs> = {}>(args?: Subset<T, User$ownedTasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sharedTasks<T extends User$sharedTasksArgs<ExtArgs> = {}>(args?: Subset<T, User$sharedTasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectTaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sentInvitations<T extends User$sentInvitationsArgs<ExtArgs> = {}>(args?: Subset<T, User$sentInvitationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    receivedInvitations<T extends User$receivedInvitationsArgs<ExtArgs> = {}>(args?: Subset<T, User$receivedInvitationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly nombre: FieldRef<"User", 'String'>
    readonly pin: FieldRef<"User", 'String'>
    readonly rol: FieldRef<"User", 'UserRole'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.ownedClients
   */
  export type User$ownedClientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    cursor?: ClientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * User.sharedClients
   */
  export type User$sharedClientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    cursor?: ClientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * User.ownedProjects
   */
  export type User$ownedProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.sharedProjects
   */
  export type User$sharedProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.ownedTasks
   */
  export type User$ownedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    where?: ProjectTaskWhereInput
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    cursor?: ProjectTaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectTaskScalarFieldEnum | ProjectTaskScalarFieldEnum[]
  }

  /**
   * User.sharedTasks
   */
  export type User$sharedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectTask
     */
    select?: ProjectTaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectTask
     */
    omit?: ProjectTaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectTaskInclude<ExtArgs> | null
    where?: ProjectTaskWhereInput
    orderBy?: ProjectTaskOrderByWithRelationInput | ProjectTaskOrderByWithRelationInput[]
    cursor?: ProjectTaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectTaskScalarFieldEnum | ProjectTaskScalarFieldEnum[]
  }

  /**
   * User.sentInvitations
   */
  export type User$sentInvitationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
    where?: InvitationWhereInput
    orderBy?: InvitationOrderByWithRelationInput | InvitationOrderByWithRelationInput[]
    cursor?: InvitationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[]
  }

  /**
   * User.receivedInvitations
   */
  export type User$receivedInvitationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
    where?: InvitationWhereInput
    orderBy?: InvitationOrderByWithRelationInput | InvitationOrderByWithRelationInput[]
    cursor?: InvitationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Invitation
   */

  export type AggregateInvitation = {
    _count: InvitationCountAggregateOutputType | null
    _min: InvitationMinAggregateOutputType | null
    _max: InvitationMaxAggregateOutputType | null
  }

  export type InvitationMinAggregateOutputType = {
    id: string | null
    senderId: string | null
    receiverId: string | null
    resourceType: $Enums.ResourceType | null
    resourceId: string | null
    status: $Enums.InvitationStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvitationMaxAggregateOutputType = {
    id: string | null
    senderId: string | null
    receiverId: string | null
    resourceType: $Enums.ResourceType | null
    resourceId: string | null
    status: $Enums.InvitationStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvitationCountAggregateOutputType = {
    id: number
    senderId: number
    receiverId: number
    resourceType: number
    resourceId: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InvitationMinAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    resourceType?: true
    resourceId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvitationMaxAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    resourceType?: true
    resourceId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvitationCountAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    resourceType?: true
    resourceId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InvitationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invitation to aggregate.
     */
    where?: InvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invitations to fetch.
     */
    orderBy?: InvitationOrderByWithRelationInput | InvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invitations
    **/
    _count?: true | InvitationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvitationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvitationMaxAggregateInputType
  }

  export type GetInvitationAggregateType<T extends InvitationAggregateArgs> = {
        [P in keyof T & keyof AggregateInvitation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvitation[P]>
      : GetScalarType<T[P], AggregateInvitation[P]>
  }




  export type InvitationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvitationWhereInput
    orderBy?: InvitationOrderByWithAggregationInput | InvitationOrderByWithAggregationInput[]
    by: InvitationScalarFieldEnum[] | InvitationScalarFieldEnum
    having?: InvitationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvitationCountAggregateInputType | true
    _min?: InvitationMinAggregateInputType
    _max?: InvitationMaxAggregateInputType
  }

  export type InvitationGroupByOutputType = {
    id: string
    senderId: string
    receiverId: string
    resourceType: $Enums.ResourceType
    resourceId: string
    status: $Enums.InvitationStatus
    createdAt: Date
    updatedAt: Date
    _count: InvitationCountAggregateOutputType | null
    _min: InvitationMinAggregateOutputType | null
    _max: InvitationMaxAggregateOutputType | null
  }

  type GetInvitationGroupByPayload<T extends InvitationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvitationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvitationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvitationGroupByOutputType[P]>
            : GetScalarType<T[P], InvitationGroupByOutputType[P]>
        }
      >
    >


  export type InvitationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    resourceType?: boolean
    resourceId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invitation"]>

  export type InvitationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    resourceType?: boolean
    resourceId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invitation"]>

  export type InvitationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    resourceType?: boolean
    resourceId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invitation"]>

  export type InvitationSelectScalar = {
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    resourceType?: boolean
    resourceId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InvitationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "senderId" | "receiverId" | "resourceType" | "resourceId" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["invitation"]>
  export type InvitationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type InvitationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type InvitationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $InvitationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invitation"
    objects: {
      sender: Prisma.$UserPayload<ExtArgs>
      receiver: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      senderId: string
      receiverId: string
      resourceType: $Enums.ResourceType
      resourceId: string
      status: $Enums.InvitationStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["invitation"]>
    composites: {}
  }

  type InvitationGetPayload<S extends boolean | null | undefined | InvitationDefaultArgs> = $Result.GetResult<Prisma.$InvitationPayload, S>

  type InvitationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvitationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvitationCountAggregateInputType | true
    }

  export interface InvitationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invitation'], meta: { name: 'Invitation' } }
    /**
     * Find zero or one Invitation that matches the filter.
     * @param {InvitationFindUniqueArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvitationFindUniqueArgs>(args: SelectSubset<T, InvitationFindUniqueArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Invitation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvitationFindUniqueOrThrowArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvitationFindUniqueOrThrowArgs>(args: SelectSubset<T, InvitationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invitation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationFindFirstArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvitationFindFirstArgs>(args?: SelectSubset<T, InvitationFindFirstArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invitation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationFindFirstOrThrowArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvitationFindFirstOrThrowArgs>(args?: SelectSubset<T, InvitationFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Invitations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invitations
     * const invitations = await prisma.invitation.findMany()
     * 
     * // Get first 10 Invitations
     * const invitations = await prisma.invitation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invitationWithIdOnly = await prisma.invitation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvitationFindManyArgs>(args?: SelectSubset<T, InvitationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Invitation.
     * @param {InvitationCreateArgs} args - Arguments to create a Invitation.
     * @example
     * // Create one Invitation
     * const Invitation = await prisma.invitation.create({
     *   data: {
     *     // ... data to create a Invitation
     *   }
     * })
     * 
     */
    create<T extends InvitationCreateArgs>(args: SelectSubset<T, InvitationCreateArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Invitations.
     * @param {InvitationCreateManyArgs} args - Arguments to create many Invitations.
     * @example
     * // Create many Invitations
     * const invitation = await prisma.invitation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvitationCreateManyArgs>(args?: SelectSubset<T, InvitationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invitations and returns the data saved in the database.
     * @param {InvitationCreateManyAndReturnArgs} args - Arguments to create many Invitations.
     * @example
     * // Create many Invitations
     * const invitation = await prisma.invitation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invitations and only return the `id`
     * const invitationWithIdOnly = await prisma.invitation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvitationCreateManyAndReturnArgs>(args?: SelectSubset<T, InvitationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Invitation.
     * @param {InvitationDeleteArgs} args - Arguments to delete one Invitation.
     * @example
     * // Delete one Invitation
     * const Invitation = await prisma.invitation.delete({
     *   where: {
     *     // ... filter to delete one Invitation
     *   }
     * })
     * 
     */
    delete<T extends InvitationDeleteArgs>(args: SelectSubset<T, InvitationDeleteArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Invitation.
     * @param {InvitationUpdateArgs} args - Arguments to update one Invitation.
     * @example
     * // Update one Invitation
     * const invitation = await prisma.invitation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvitationUpdateArgs>(args: SelectSubset<T, InvitationUpdateArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Invitations.
     * @param {InvitationDeleteManyArgs} args - Arguments to filter Invitations to delete.
     * @example
     * // Delete a few Invitations
     * const { count } = await prisma.invitation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvitationDeleteManyArgs>(args?: SelectSubset<T, InvitationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invitations
     * const invitation = await prisma.invitation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvitationUpdateManyArgs>(args: SelectSubset<T, InvitationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invitations and returns the data updated in the database.
     * @param {InvitationUpdateManyAndReturnArgs} args - Arguments to update many Invitations.
     * @example
     * // Update many Invitations
     * const invitation = await prisma.invitation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Invitations and only return the `id`
     * const invitationWithIdOnly = await prisma.invitation.updateManyAndReturn({
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
    updateManyAndReturn<T extends InvitationUpdateManyAndReturnArgs>(args: SelectSubset<T, InvitationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Invitation.
     * @param {InvitationUpsertArgs} args - Arguments to update or create a Invitation.
     * @example
     * // Update or create a Invitation
     * const invitation = await prisma.invitation.upsert({
     *   create: {
     *     // ... data to create a Invitation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invitation we want to update
     *   }
     * })
     */
    upsert<T extends InvitationUpsertArgs>(args: SelectSubset<T, InvitationUpsertArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Invitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationCountArgs} args - Arguments to filter Invitations to count.
     * @example
     * // Count the number of Invitations
     * const count = await prisma.invitation.count({
     *   where: {
     *     // ... the filter for the Invitations we want to count
     *   }
     * })
    **/
    count<T extends InvitationCountArgs>(
      args?: Subset<T, InvitationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvitationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InvitationAggregateArgs>(args: Subset<T, InvitationAggregateArgs>): Prisma.PrismaPromise<GetInvitationAggregateType<T>>

    /**
     * Group by Invitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationGroupByArgs} args - Group by arguments.
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
      T extends InvitationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvitationGroupByArgs['orderBy'] }
        : { orderBy?: InvitationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InvitationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvitationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invitation model
   */
  readonly fields: InvitationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invitation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvitationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    receiver<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Invitation model
   */
  interface InvitationFieldRefs {
    readonly id: FieldRef<"Invitation", 'String'>
    readonly senderId: FieldRef<"Invitation", 'String'>
    readonly receiverId: FieldRef<"Invitation", 'String'>
    readonly resourceType: FieldRef<"Invitation", 'ResourceType'>
    readonly resourceId: FieldRef<"Invitation", 'String'>
    readonly status: FieldRef<"Invitation", 'InvitationStatus'>
    readonly createdAt: FieldRef<"Invitation", 'DateTime'>
    readonly updatedAt: FieldRef<"Invitation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invitation findUnique
   */
  export type InvitationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
    /**
     * Filter, which Invitation to fetch.
     */
    where: InvitationWhereUniqueInput
  }

  /**
   * Invitation findUniqueOrThrow
   */
  export type InvitationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
    /**
     * Filter, which Invitation to fetch.
     */
    where: InvitationWhereUniqueInput
  }

  /**
   * Invitation findFirst
   */
  export type InvitationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
    /**
     * Filter, which Invitation to fetch.
     */
    where?: InvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invitations to fetch.
     */
    orderBy?: InvitationOrderByWithRelationInput | InvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invitations.
     */
    cursor?: InvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invitations.
     */
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[]
  }

  /**
   * Invitation findFirstOrThrow
   */
  export type InvitationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
    /**
     * Filter, which Invitation to fetch.
     */
    where?: InvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invitations to fetch.
     */
    orderBy?: InvitationOrderByWithRelationInput | InvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invitations.
     */
    cursor?: InvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invitations.
     */
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[]
  }

  /**
   * Invitation findMany
   */
  export type InvitationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
    /**
     * Filter, which Invitations to fetch.
     */
    where?: InvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invitations to fetch.
     */
    orderBy?: InvitationOrderByWithRelationInput | InvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invitations.
     */
    cursor?: InvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invitations.
     */
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[]
  }

  /**
   * Invitation create
   */
  export type InvitationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
    /**
     * The data needed to create a Invitation.
     */
    data: XOR<InvitationCreateInput, InvitationUncheckedCreateInput>
  }

  /**
   * Invitation createMany
   */
  export type InvitationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invitations.
     */
    data: InvitationCreateManyInput | InvitationCreateManyInput[]
  }

  /**
   * Invitation createManyAndReturn
   */
  export type InvitationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * The data used to create many Invitations.
     */
    data: InvitationCreateManyInput | InvitationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invitation update
   */
  export type InvitationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
    /**
     * The data needed to update a Invitation.
     */
    data: XOR<InvitationUpdateInput, InvitationUncheckedUpdateInput>
    /**
     * Choose, which Invitation to update.
     */
    where: InvitationWhereUniqueInput
  }

  /**
   * Invitation updateMany
   */
  export type InvitationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invitations.
     */
    data: XOR<InvitationUpdateManyMutationInput, InvitationUncheckedUpdateManyInput>
    /**
     * Filter which Invitations to update
     */
    where?: InvitationWhereInput
    /**
     * Limit how many Invitations to update.
     */
    limit?: number
  }

  /**
   * Invitation updateManyAndReturn
   */
  export type InvitationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * The data used to update Invitations.
     */
    data: XOR<InvitationUpdateManyMutationInput, InvitationUncheckedUpdateManyInput>
    /**
     * Filter which Invitations to update
     */
    where?: InvitationWhereInput
    /**
     * Limit how many Invitations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Invitation upsert
   */
  export type InvitationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
    /**
     * The filter to search for the Invitation to update in case it exists.
     */
    where: InvitationWhereUniqueInput
    /**
     * In case the Invitation found by the `where` argument doesn't exist, create a new Invitation with this data.
     */
    create: XOR<InvitationCreateInput, InvitationUncheckedCreateInput>
    /**
     * In case the Invitation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvitationUpdateInput, InvitationUncheckedUpdateInput>
  }

  /**
   * Invitation delete
   */
  export type InvitationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
    /**
     * Filter which Invitation to delete.
     */
    where: InvitationWhereUniqueInput
  }

  /**
   * Invitation deleteMany
   */
  export type InvitationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invitations to delete
     */
    where?: InvitationWhereInput
    /**
     * Limit how many Invitations to delete.
     */
    limit?: number
  }

  /**
   * Invitation without action
   */
  export type InvitationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvitationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ClientScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    activo: 'activo',
    ownerId: 'ownerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClientScalarFieldEnum = (typeof ClientScalarFieldEnum)[keyof typeof ClientScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    ubicacion: 'ubicacion',
    ano: 'ano',
    tipologia: 'tipologia',
    estatus: 'estatus',
    clientId: 'clientId',
    ownerId: 'ownerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const ProjectFileScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    originalName: 'originalName',
    storedPath: 'storedPath',
    mimeType: 'mimeType',
    size: 'size',
    technicalDocType: 'technicalDocType',
    uploadedAt: 'uploadedAt',
    version: 'version'
  };

  export type ProjectFileScalarFieldEnum = (typeof ProjectFileScalarFieldEnum)[keyof typeof ProjectFileScalarFieldEnum]


  export const ProjectTaskScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    nombre: 'nombre',
    disciplina: 'disciplina',
    fechaTermino: 'fechaTermino',
    complejidad: 'complejidad',
    actividad: 'actividad',
    taskEstatus: 'taskEstatus',
    completado: 'completado',
    comentarios: 'comentarios',
    ownerId: 'ownerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectTaskScalarFieldEnum = (typeof ProjectTaskScalarFieldEnum)[keyof typeof ProjectTaskScalarFieldEnum]


  export const KnowledgeReferenceScalarFieldEnum: {
    id: 'id',
    category: 'category',
    titulo: 'titulo',
    descripcion: 'descripcion',
    url: 'url',
    fuente: 'fuente',
    orden: 'orden',
    createdAt: 'createdAt'
  };

  export type KnowledgeReferenceScalarFieldEnum = (typeof KnowledgeReferenceScalarFieldEnum)[keyof typeof KnowledgeReferenceScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    pin: 'pin',
    rol: 'rol',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const InvitationScalarFieldEnum: {
    id: 'id',
    senderId: 'senderId',
    receiverId: 'receiverId',
    resourceType: 'resourceType',
    resourceId: 'resourceId',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InvitationScalarFieldEnum = (typeof InvitationScalarFieldEnum)[keyof typeof InvitationScalarFieldEnum]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'ProjectStatus'
   */
  export type EnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus'>
    


  /**
   * Reference to a field of type 'TechnicalDocType'
   */
  export type EnumTechnicalDocTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TechnicalDocType'>
    


  /**
   * Reference to a field of type 'TaskDiscipline'
   */
  export type EnumTaskDisciplineFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskDiscipline'>
    


  /**
   * Reference to a field of type 'TaskComplexity'
   */
  export type EnumTaskComplexityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskComplexity'>
    


  /**
   * Reference to a field of type 'TaskActivity'
   */
  export type EnumTaskActivityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskActivity'>
    


  /**
   * Reference to a field of type 'TaskEstatus'
   */
  export type EnumTaskEstatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskEstatus'>
    


  /**
   * Reference to a field of type 'KnowledgeCategory'
   */
  export type EnumKnowledgeCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KnowledgeCategory'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'ResourceType'
   */
  export type EnumResourceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ResourceType'>
    


  /**
   * Reference to a field of type 'InvitationStatus'
   */
  export type EnumInvitationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvitationStatus'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type ClientWhereInput = {
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    id?: StringFilter<"Client"> | string
    nombre?: StringFilter<"Client"> | string
    activo?: BoolFilter<"Client"> | boolean
    ownerId?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    projects?: ProjectListRelationFilter
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    sharedWith?: UserListRelationFilter
  }

  export type ClientOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    activo?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projects?: ProjectOrderByRelationAggregateInput
    owner?: UserOrderByWithRelationInput
    sharedWith?: UserOrderByRelationAggregateInput
  }

  export type ClientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    nombre?: StringFilter<"Client"> | string
    activo?: BoolFilter<"Client"> | boolean
    ownerId?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    projects?: ProjectListRelationFilter
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    sharedWith?: UserListRelationFilter
  }, "id">

  export type ClientOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    activo?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClientCountOrderByAggregateInput
    _max?: ClientMaxOrderByAggregateInput
    _min?: ClientMinOrderByAggregateInput
  }

  export type ClientScalarWhereWithAggregatesInput = {
    AND?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    OR?: ClientScalarWhereWithAggregatesInput[]
    NOT?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Client"> | string
    nombre?: StringWithAggregatesFilter<"Client"> | string
    activo?: BoolWithAggregatesFilter<"Client"> | boolean
    ownerId?: StringNullableWithAggregatesFilter<"Client"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    nombre?: StringFilter<"Project"> | string
    ubicacion?: StringFilter<"Project"> | string
    ano?: IntFilter<"Project"> | number
    tipologia?: StringFilter<"Project"> | string
    estatus?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    clientId?: StringFilter<"Project"> | string
    ownerId?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
    files?: ProjectFileListRelationFilter
    tasks?: ProjectTaskListRelationFilter
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    sharedWith?: UserListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    ano?: SortOrder
    tipologia?: SortOrder
    estatus?: SortOrder
    clientId?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    client?: ClientOrderByWithRelationInput
    files?: ProjectFileOrderByRelationAggregateInput
    tasks?: ProjectTaskOrderByRelationAggregateInput
    owner?: UserOrderByWithRelationInput
    sharedWith?: UserOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    nombre?: StringFilter<"Project"> | string
    ubicacion?: StringFilter<"Project"> | string
    ano?: IntFilter<"Project"> | number
    tipologia?: StringFilter<"Project"> | string
    estatus?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    clientId?: StringFilter<"Project"> | string
    ownerId?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
    files?: ProjectFileListRelationFilter
    tasks?: ProjectTaskListRelationFilter
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    sharedWith?: UserListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    ano?: SortOrder
    tipologia?: SortOrder
    estatus?: SortOrder
    clientId?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _avg?: ProjectAvgOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
    _sum?: ProjectSumOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    nombre?: StringWithAggregatesFilter<"Project"> | string
    ubicacion?: StringWithAggregatesFilter<"Project"> | string
    ano?: IntWithAggregatesFilter<"Project"> | number
    tipologia?: StringWithAggregatesFilter<"Project"> | string
    estatus?: EnumProjectStatusWithAggregatesFilter<"Project"> | $Enums.ProjectStatus
    clientId?: StringWithAggregatesFilter<"Project"> | string
    ownerId?: StringNullableWithAggregatesFilter<"Project"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type ProjectFileWhereInput = {
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    projectId?: StringFilter<"ProjectFile"> | string
    originalName?: StringFilter<"ProjectFile"> | string
    storedPath?: StringFilter<"ProjectFile"> | string
    mimeType?: StringFilter<"ProjectFile"> | string
    size?: IntFilter<"ProjectFile"> | number
    technicalDocType?: EnumTechnicalDocTypeNullableFilter<"ProjectFile"> | $Enums.TechnicalDocType | null
    uploadedAt?: DateTimeFilter<"ProjectFile"> | Date | string
    version?: IntFilter<"ProjectFile"> | number
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type ProjectFileOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    originalName?: SortOrder
    storedPath?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    technicalDocType?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    version?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ProjectFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    storedPath?: string
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    projectId?: StringFilter<"ProjectFile"> | string
    originalName?: StringFilter<"ProjectFile"> | string
    mimeType?: StringFilter<"ProjectFile"> | string
    size?: IntFilter<"ProjectFile"> | number
    technicalDocType?: EnumTechnicalDocTypeNullableFilter<"ProjectFile"> | $Enums.TechnicalDocType | null
    uploadedAt?: DateTimeFilter<"ProjectFile"> | Date | string
    version?: IntFilter<"ProjectFile"> | number
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id" | "storedPath">

  export type ProjectFileOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    originalName?: SortOrder
    storedPath?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    technicalDocType?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    version?: SortOrder
    _count?: ProjectFileCountOrderByAggregateInput
    _avg?: ProjectFileAvgOrderByAggregateInput
    _max?: ProjectFileMaxOrderByAggregateInput
    _min?: ProjectFileMinOrderByAggregateInput
    _sum?: ProjectFileSumOrderByAggregateInput
  }

  export type ProjectFileScalarWhereWithAggregatesInput = {
    AND?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    OR?: ProjectFileScalarWhereWithAggregatesInput[]
    NOT?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectFile"> | string
    projectId?: StringWithAggregatesFilter<"ProjectFile"> | string
    originalName?: StringWithAggregatesFilter<"ProjectFile"> | string
    storedPath?: StringWithAggregatesFilter<"ProjectFile"> | string
    mimeType?: StringWithAggregatesFilter<"ProjectFile"> | string
    size?: IntWithAggregatesFilter<"ProjectFile"> | number
    technicalDocType?: EnumTechnicalDocTypeNullableWithAggregatesFilter<"ProjectFile"> | $Enums.TechnicalDocType | null
    uploadedAt?: DateTimeWithAggregatesFilter<"ProjectFile"> | Date | string
    version?: IntWithAggregatesFilter<"ProjectFile"> | number
  }

  export type ProjectTaskWhereInput = {
    AND?: ProjectTaskWhereInput | ProjectTaskWhereInput[]
    OR?: ProjectTaskWhereInput[]
    NOT?: ProjectTaskWhereInput | ProjectTaskWhereInput[]
    id?: StringFilter<"ProjectTask"> | string
    projectId?: StringFilter<"ProjectTask"> | string
    nombre?: StringFilter<"ProjectTask"> | string
    disciplina?: EnumTaskDisciplineFilter<"ProjectTask"> | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFilter<"ProjectTask"> | Date | string
    complejidad?: EnumTaskComplexityFilter<"ProjectTask"> | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFilter<"ProjectTask"> | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFilter<"ProjectTask"> | $Enums.TaskEstatus
    completado?: BoolFilter<"ProjectTask"> | boolean
    comentarios?: StringFilter<"ProjectTask"> | string
    ownerId?: StringNullableFilter<"ProjectTask"> | string | null
    createdAt?: DateTimeFilter<"ProjectTask"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectTask"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    sharedWith?: UserListRelationFilter
  }

  export type ProjectTaskOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    nombre?: SortOrder
    disciplina?: SortOrder
    fechaTermino?: SortOrder
    complejidad?: SortOrder
    actividad?: SortOrder
    taskEstatus?: SortOrder
    completado?: SortOrder
    comentarios?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
    owner?: UserOrderByWithRelationInput
    sharedWith?: UserOrderByRelationAggregateInput
  }

  export type ProjectTaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectTaskWhereInput | ProjectTaskWhereInput[]
    OR?: ProjectTaskWhereInput[]
    NOT?: ProjectTaskWhereInput | ProjectTaskWhereInput[]
    projectId?: StringFilter<"ProjectTask"> | string
    nombre?: StringFilter<"ProjectTask"> | string
    disciplina?: EnumTaskDisciplineFilter<"ProjectTask"> | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFilter<"ProjectTask"> | Date | string
    complejidad?: EnumTaskComplexityFilter<"ProjectTask"> | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFilter<"ProjectTask"> | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFilter<"ProjectTask"> | $Enums.TaskEstatus
    completado?: BoolFilter<"ProjectTask"> | boolean
    comentarios?: StringFilter<"ProjectTask"> | string
    ownerId?: StringNullableFilter<"ProjectTask"> | string | null
    createdAt?: DateTimeFilter<"ProjectTask"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectTask"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    sharedWith?: UserListRelationFilter
  }, "id">

  export type ProjectTaskOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    nombre?: SortOrder
    disciplina?: SortOrder
    fechaTermino?: SortOrder
    complejidad?: SortOrder
    actividad?: SortOrder
    taskEstatus?: SortOrder
    completado?: SortOrder
    comentarios?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectTaskCountOrderByAggregateInput
    _max?: ProjectTaskMaxOrderByAggregateInput
    _min?: ProjectTaskMinOrderByAggregateInput
  }

  export type ProjectTaskScalarWhereWithAggregatesInput = {
    AND?: ProjectTaskScalarWhereWithAggregatesInput | ProjectTaskScalarWhereWithAggregatesInput[]
    OR?: ProjectTaskScalarWhereWithAggregatesInput[]
    NOT?: ProjectTaskScalarWhereWithAggregatesInput | ProjectTaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectTask"> | string
    projectId?: StringWithAggregatesFilter<"ProjectTask"> | string
    nombre?: StringWithAggregatesFilter<"ProjectTask"> | string
    disciplina?: EnumTaskDisciplineWithAggregatesFilter<"ProjectTask"> | $Enums.TaskDiscipline
    fechaTermino?: DateTimeWithAggregatesFilter<"ProjectTask"> | Date | string
    complejidad?: EnumTaskComplexityWithAggregatesFilter<"ProjectTask"> | $Enums.TaskComplexity
    actividad?: EnumTaskActivityWithAggregatesFilter<"ProjectTask"> | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusWithAggregatesFilter<"ProjectTask"> | $Enums.TaskEstatus
    completado?: BoolWithAggregatesFilter<"ProjectTask"> | boolean
    comentarios?: StringWithAggregatesFilter<"ProjectTask"> | string
    ownerId?: StringNullableWithAggregatesFilter<"ProjectTask"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProjectTask"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProjectTask"> | Date | string
  }

  export type KnowledgeReferenceWhereInput = {
    AND?: KnowledgeReferenceWhereInput | KnowledgeReferenceWhereInput[]
    OR?: KnowledgeReferenceWhereInput[]
    NOT?: KnowledgeReferenceWhereInput | KnowledgeReferenceWhereInput[]
    id?: StringFilter<"KnowledgeReference"> | string
    category?: EnumKnowledgeCategoryFilter<"KnowledgeReference"> | $Enums.KnowledgeCategory
    titulo?: StringFilter<"KnowledgeReference"> | string
    descripcion?: StringNullableFilter<"KnowledgeReference"> | string | null
    url?: StringNullableFilter<"KnowledgeReference"> | string | null
    fuente?: StringNullableFilter<"KnowledgeReference"> | string | null
    orden?: IntFilter<"KnowledgeReference"> | number
    createdAt?: DateTimeFilter<"KnowledgeReference"> | Date | string
  }

  export type KnowledgeReferenceOrderByWithRelationInput = {
    id?: SortOrder
    category?: SortOrder
    titulo?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    fuente?: SortOrderInput | SortOrder
    orden?: SortOrder
    createdAt?: SortOrder
  }

  export type KnowledgeReferenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: KnowledgeReferenceWhereInput | KnowledgeReferenceWhereInput[]
    OR?: KnowledgeReferenceWhereInput[]
    NOT?: KnowledgeReferenceWhereInput | KnowledgeReferenceWhereInput[]
    category?: EnumKnowledgeCategoryFilter<"KnowledgeReference"> | $Enums.KnowledgeCategory
    titulo?: StringFilter<"KnowledgeReference"> | string
    descripcion?: StringNullableFilter<"KnowledgeReference"> | string | null
    url?: StringNullableFilter<"KnowledgeReference"> | string | null
    fuente?: StringNullableFilter<"KnowledgeReference"> | string | null
    orden?: IntFilter<"KnowledgeReference"> | number
    createdAt?: DateTimeFilter<"KnowledgeReference"> | Date | string
  }, "id">

  export type KnowledgeReferenceOrderByWithAggregationInput = {
    id?: SortOrder
    category?: SortOrder
    titulo?: SortOrder
    descripcion?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    fuente?: SortOrderInput | SortOrder
    orden?: SortOrder
    createdAt?: SortOrder
    _count?: KnowledgeReferenceCountOrderByAggregateInput
    _avg?: KnowledgeReferenceAvgOrderByAggregateInput
    _max?: KnowledgeReferenceMaxOrderByAggregateInput
    _min?: KnowledgeReferenceMinOrderByAggregateInput
    _sum?: KnowledgeReferenceSumOrderByAggregateInput
  }

  export type KnowledgeReferenceScalarWhereWithAggregatesInput = {
    AND?: KnowledgeReferenceScalarWhereWithAggregatesInput | KnowledgeReferenceScalarWhereWithAggregatesInput[]
    OR?: KnowledgeReferenceScalarWhereWithAggregatesInput[]
    NOT?: KnowledgeReferenceScalarWhereWithAggregatesInput | KnowledgeReferenceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KnowledgeReference"> | string
    category?: EnumKnowledgeCategoryWithAggregatesFilter<"KnowledgeReference"> | $Enums.KnowledgeCategory
    titulo?: StringWithAggregatesFilter<"KnowledgeReference"> | string
    descripcion?: StringNullableWithAggregatesFilter<"KnowledgeReference"> | string | null
    url?: StringNullableWithAggregatesFilter<"KnowledgeReference"> | string | null
    fuente?: StringNullableWithAggregatesFilter<"KnowledgeReference"> | string | null
    orden?: IntWithAggregatesFilter<"KnowledgeReference"> | number
    createdAt?: DateTimeWithAggregatesFilter<"KnowledgeReference"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    nombre?: StringFilter<"User"> | string
    pin?: StringFilter<"User"> | string
    rol?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    ownedClients?: ClientListRelationFilter
    sharedClients?: ClientListRelationFilter
    ownedProjects?: ProjectListRelationFilter
    sharedProjects?: ProjectListRelationFilter
    ownedTasks?: ProjectTaskListRelationFilter
    sharedTasks?: ProjectTaskListRelationFilter
    sentInvitations?: InvitationListRelationFilter
    receivedInvitations?: InvitationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    pin?: SortOrder
    rol?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ownedClients?: ClientOrderByRelationAggregateInput
    sharedClients?: ClientOrderByRelationAggregateInput
    ownedProjects?: ProjectOrderByRelationAggregateInput
    sharedProjects?: ProjectOrderByRelationAggregateInput
    ownedTasks?: ProjectTaskOrderByRelationAggregateInput
    sharedTasks?: ProjectTaskOrderByRelationAggregateInput
    sentInvitations?: InvitationOrderByRelationAggregateInput
    receivedInvitations?: InvitationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    nombre?: StringFilter<"User"> | string
    pin?: StringFilter<"User"> | string
    rol?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    ownedClients?: ClientListRelationFilter
    sharedClients?: ClientListRelationFilter
    ownedProjects?: ProjectListRelationFilter
    sharedProjects?: ProjectListRelationFilter
    ownedTasks?: ProjectTaskListRelationFilter
    sharedTasks?: ProjectTaskListRelationFilter
    sentInvitations?: InvitationListRelationFilter
    receivedInvitations?: InvitationListRelationFilter
  }, "id">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    pin?: SortOrder
    rol?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    nombre?: StringWithAggregatesFilter<"User"> | string
    pin?: StringWithAggregatesFilter<"User"> | string
    rol?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type InvitationWhereInput = {
    AND?: InvitationWhereInput | InvitationWhereInput[]
    OR?: InvitationWhereInput[]
    NOT?: InvitationWhereInput | InvitationWhereInput[]
    id?: StringFilter<"Invitation"> | string
    senderId?: StringFilter<"Invitation"> | string
    receiverId?: StringFilter<"Invitation"> | string
    resourceType?: EnumResourceTypeFilter<"Invitation"> | $Enums.ResourceType
    resourceId?: StringFilter<"Invitation"> | string
    status?: EnumInvitationStatusFilter<"Invitation"> | $Enums.InvitationStatus
    createdAt?: DateTimeFilter<"Invitation"> | Date | string
    updatedAt?: DateTimeFilter<"Invitation"> | Date | string
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type InvitationOrderByWithRelationInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sender?: UserOrderByWithRelationInput
    receiver?: UserOrderByWithRelationInput
  }

  export type InvitationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InvitationWhereInput | InvitationWhereInput[]
    OR?: InvitationWhereInput[]
    NOT?: InvitationWhereInput | InvitationWhereInput[]
    senderId?: StringFilter<"Invitation"> | string
    receiverId?: StringFilter<"Invitation"> | string
    resourceType?: EnumResourceTypeFilter<"Invitation"> | $Enums.ResourceType
    resourceId?: StringFilter<"Invitation"> | string
    status?: EnumInvitationStatusFilter<"Invitation"> | $Enums.InvitationStatus
    createdAt?: DateTimeFilter<"Invitation"> | Date | string
    updatedAt?: DateTimeFilter<"Invitation"> | Date | string
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type InvitationOrderByWithAggregationInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InvitationCountOrderByAggregateInput
    _max?: InvitationMaxOrderByAggregateInput
    _min?: InvitationMinOrderByAggregateInput
  }

  export type InvitationScalarWhereWithAggregatesInput = {
    AND?: InvitationScalarWhereWithAggregatesInput | InvitationScalarWhereWithAggregatesInput[]
    OR?: InvitationScalarWhereWithAggregatesInput[]
    NOT?: InvitationScalarWhereWithAggregatesInput | InvitationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invitation"> | string
    senderId?: StringWithAggregatesFilter<"Invitation"> | string
    receiverId?: StringWithAggregatesFilter<"Invitation"> | string
    resourceType?: EnumResourceTypeWithAggregatesFilter<"Invitation"> | $Enums.ResourceType
    resourceId?: StringWithAggregatesFilter<"Invitation"> | string
    status?: EnumInvitationStatusWithAggregatesFilter<"Invitation"> | $Enums.InvitationStatus
    createdAt?: DateTimeWithAggregatesFilter<"Invitation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Invitation"> | Date | string
  }

  export type ClientCreateInput = {
    id?: string
    nombre: string
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutClientInput
    owner?: UserCreateNestedOneWithoutOwnedClientsInput
    sharedWith?: UserCreateNestedManyWithoutSharedClientsInput
  }

  export type ClientUncheckedCreateInput = {
    id?: string
    nombre: string
    activo?: boolean
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutClientInput
    sharedWith?: UserUncheckedCreateNestedManyWithoutSharedClientsInput
  }

  export type ClientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutClientNestedInput
    owner?: UserUpdateOneWithoutOwnedClientsNestedInput
    sharedWith?: UserUpdateManyWithoutSharedClientsNestedInput
  }

  export type ClientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutClientNestedInput
    sharedWith?: UserUncheckedUpdateManyWithoutSharedClientsNestedInput
  }

  export type ClientCreateManyInput = {
    id?: string
    nombre: string
    activo?: boolean
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    tasks?: ProjectTaskCreateNestedManyWithoutProjectInput
    owner?: UserCreateNestedOneWithoutOwnedProjectsInput
    sharedWith?: UserCreateNestedManyWithoutSharedProjectsInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    clientId: string
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    tasks?: ProjectTaskUncheckedCreateNestedManyWithoutProjectInput
    sharedWith?: UserUncheckedCreateNestedManyWithoutSharedProjectsInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    tasks?: ProjectTaskUpdateManyWithoutProjectNestedInput
    owner?: UserUpdateOneWithoutOwnedProjectsNestedInput
    sharedWith?: UserUpdateManyWithoutSharedProjectsNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    clientId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    tasks?: ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput
    sharedWith?: UserUncheckedUpdateManyWithoutSharedProjectsNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    clientId: string
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    clientId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileCreateInput = {
    id?: string
    originalName: string
    storedPath: string
    mimeType: string
    size: number
    technicalDocType?: $Enums.TechnicalDocType | null
    uploadedAt?: Date | string
    version?: number
    project: ProjectCreateNestedOneWithoutFilesInput
  }

  export type ProjectFileUncheckedCreateInput = {
    id?: string
    projectId: string
    originalName: string
    storedPath: string
    mimeType: string
    size: number
    technicalDocType?: $Enums.TechnicalDocType | null
    uploadedAt?: Date | string
    version?: number
  }

  export type ProjectFileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    storedPath?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    technicalDocType?: NullableEnumTechnicalDocTypeFieldUpdateOperationsInput | $Enums.TechnicalDocType | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    project?: ProjectUpdateOneRequiredWithoutFilesNestedInput
  }

  export type ProjectFileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    storedPath?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    technicalDocType?: NullableEnumTechnicalDocTypeFieldUpdateOperationsInput | $Enums.TechnicalDocType | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ProjectFileCreateManyInput = {
    id?: string
    projectId: string
    originalName: string
    storedPath: string
    mimeType: string
    size: number
    technicalDocType?: $Enums.TechnicalDocType | null
    uploadedAt?: Date | string
    version?: number
  }

  export type ProjectFileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    storedPath?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    technicalDocType?: NullableEnumTechnicalDocTypeFieldUpdateOperationsInput | $Enums.TechnicalDocType | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ProjectFileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    storedPath?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    technicalDocType?: NullableEnumTechnicalDocTypeFieldUpdateOperationsInput | $Enums.TechnicalDocType | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ProjectTaskCreateInput = {
    id?: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date | string
    complejidad: $Enums.TaskComplexity
    actividad?: $Enums.TaskActivity
    taskEstatus?: $Enums.TaskEstatus
    completado?: boolean
    comentarios?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutTasksInput
    owner?: UserCreateNestedOneWithoutOwnedTasksInput
    sharedWith?: UserCreateNestedManyWithoutSharedTasksInput
  }

  export type ProjectTaskUncheckedCreateInput = {
    id?: string
    projectId: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date | string
    complejidad: $Enums.TaskComplexity
    actividad?: $Enums.TaskActivity
    taskEstatus?: $Enums.TaskEstatus
    completado?: boolean
    comentarios?: string
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sharedWith?: UserUncheckedCreateNestedManyWithoutSharedTasksInput
  }

  export type ProjectTaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutTasksNestedInput
    owner?: UserUpdateOneWithoutOwnedTasksNestedInput
    sharedWith?: UserUpdateManyWithoutSharedTasksNestedInput
  }

  export type ProjectTaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sharedWith?: UserUncheckedUpdateManyWithoutSharedTasksNestedInput
  }

  export type ProjectTaskCreateManyInput = {
    id?: string
    projectId: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date | string
    complejidad: $Enums.TaskComplexity
    actividad?: $Enums.TaskActivity
    taskEstatus?: $Enums.TaskEstatus
    completado?: boolean
    comentarios?: string
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectTaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectTaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeReferenceCreateInput = {
    id?: string
    category: $Enums.KnowledgeCategory
    titulo: string
    descripcion?: string | null
    url?: string | null
    fuente?: string | null
    orden?: number
    createdAt?: Date | string
  }

  export type KnowledgeReferenceUncheckedCreateInput = {
    id?: string
    category: $Enums.KnowledgeCategory
    titulo: string
    descripcion?: string | null
    url?: string | null
    fuente?: string | null
    orden?: number
    createdAt?: Date | string
  }

  export type KnowledgeReferenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: EnumKnowledgeCategoryFieldUpdateOperationsInput | $Enums.KnowledgeCategory
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fuente?: NullableStringFieldUpdateOperationsInput | string | null
    orden?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeReferenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: EnumKnowledgeCategoryFieldUpdateOperationsInput | $Enums.KnowledgeCategory
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fuente?: NullableStringFieldUpdateOperationsInput | string | null
    orden?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeReferenceCreateManyInput = {
    id?: string
    category: $Enums.KnowledgeCategory
    titulo: string
    descripcion?: string | null
    url?: string | null
    fuente?: string | null
    orden?: number
    createdAt?: Date | string
  }

  export type KnowledgeReferenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: EnumKnowledgeCategoryFieldUpdateOperationsInput | $Enums.KnowledgeCategory
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fuente?: NullableStringFieldUpdateOperationsInput | string | null
    orden?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KnowledgeReferenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: EnumKnowledgeCategoryFieldUpdateOperationsInput | $Enums.KnowledgeCategory
    titulo?: StringFieldUpdateOperationsInput | string
    descripcion?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    fuente?: NullableStringFieldUpdateOperationsInput | string | null
    orden?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientUncheckedCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientUncheckedCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectUncheckedCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationUncheckedCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUncheckedUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUncheckedUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUncheckedUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUncheckedUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvitationCreateInput = {
    id?: string
    resourceType: $Enums.ResourceType
    resourceId: string
    status?: $Enums.InvitationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentInvitationsInput
    receiver: UserCreateNestedOneWithoutReceivedInvitationsInput
  }

  export type InvitationUncheckedCreateInput = {
    id?: string
    senderId: string
    receiverId: string
    resourceType: $Enums.ResourceType
    resourceId: string
    status?: $Enums.InvitationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvitationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    resourceType?: EnumResourceTypeFieldUpdateOperationsInput | $Enums.ResourceType
    resourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentInvitationsNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedInvitationsNestedInput
  }

  export type InvitationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    resourceType?: EnumResourceTypeFieldUpdateOperationsInput | $Enums.ResourceType
    resourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvitationCreateManyInput = {
    id?: string
    senderId: string
    receiverId: string
    resourceType: $Enums.ResourceType
    resourceId: string
    status?: $Enums.InvitationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvitationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    resourceType?: EnumResourceTypeFieldUpdateOperationsInput | $Enums.ResourceType
    resourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvitationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    resourceType?: EnumResourceTypeFieldUpdateOperationsInput | $Enums.ResourceType
    resourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
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

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClientCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    activo?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    activo?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    activo?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
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

  export type EnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[]
    notIn?: $Enums.ProjectStatus[]
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type ClientScalarRelationFilter = {
    is?: ClientWhereInput
    isNot?: ClientWhereInput
  }

  export type ProjectFileListRelationFilter = {
    every?: ProjectFileWhereInput
    some?: ProjectFileWhereInput
    none?: ProjectFileWhereInput
  }

  export type ProjectTaskListRelationFilter = {
    every?: ProjectTaskWhereInput
    some?: ProjectTaskWhereInput
    none?: ProjectTaskWhereInput
  }

  export type ProjectFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectTaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    ano?: SortOrder
    tipologia?: SortOrder
    estatus?: SortOrder
    clientId?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectAvgOrderByAggregateInput = {
    ano?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    ano?: SortOrder
    tipologia?: SortOrder
    estatus?: SortOrder
    clientId?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    ubicacion?: SortOrder
    ano?: SortOrder
    tipologia?: SortOrder
    estatus?: SortOrder
    clientId?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectSumOrderByAggregateInput = {
    ano?: SortOrder
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

  export type EnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[]
    notIn?: $Enums.ProjectStatus[]
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type EnumTechnicalDocTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TechnicalDocType | EnumTechnicalDocTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TechnicalDocType[] | null
    notIn?: $Enums.TechnicalDocType[] | null
    not?: NestedEnumTechnicalDocTypeNullableFilter<$PrismaModel> | $Enums.TechnicalDocType | null
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type ProjectFileCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    originalName?: SortOrder
    storedPath?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    technicalDocType?: SortOrder
    uploadedAt?: SortOrder
    version?: SortOrder
  }

  export type ProjectFileAvgOrderByAggregateInput = {
    size?: SortOrder
    version?: SortOrder
  }

  export type ProjectFileMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    originalName?: SortOrder
    storedPath?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    technicalDocType?: SortOrder
    uploadedAt?: SortOrder
    version?: SortOrder
  }

  export type ProjectFileMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    originalName?: SortOrder
    storedPath?: SortOrder
    mimeType?: SortOrder
    size?: SortOrder
    technicalDocType?: SortOrder
    uploadedAt?: SortOrder
    version?: SortOrder
  }

  export type ProjectFileSumOrderByAggregateInput = {
    size?: SortOrder
    version?: SortOrder
  }

  export type EnumTechnicalDocTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TechnicalDocType | EnumTechnicalDocTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TechnicalDocType[] | null
    notIn?: $Enums.TechnicalDocType[] | null
    not?: NestedEnumTechnicalDocTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.TechnicalDocType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTechnicalDocTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumTechnicalDocTypeNullableFilter<$PrismaModel>
  }

  export type EnumTaskDisciplineFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskDiscipline | EnumTaskDisciplineFieldRefInput<$PrismaModel>
    in?: $Enums.TaskDiscipline[]
    notIn?: $Enums.TaskDiscipline[]
    not?: NestedEnumTaskDisciplineFilter<$PrismaModel> | $Enums.TaskDiscipline
  }

  export type EnumTaskComplexityFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskComplexity | EnumTaskComplexityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskComplexity[]
    notIn?: $Enums.TaskComplexity[]
    not?: NestedEnumTaskComplexityFilter<$PrismaModel> | $Enums.TaskComplexity
  }

  export type EnumTaskActivityFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskActivity | EnumTaskActivityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskActivity[]
    notIn?: $Enums.TaskActivity[]
    not?: NestedEnumTaskActivityFilter<$PrismaModel> | $Enums.TaskActivity
  }

  export type EnumTaskEstatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskEstatus | EnumTaskEstatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskEstatus[]
    notIn?: $Enums.TaskEstatus[]
    not?: NestedEnumTaskEstatusFilter<$PrismaModel> | $Enums.TaskEstatus
  }

  export type ProjectTaskCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    nombre?: SortOrder
    disciplina?: SortOrder
    fechaTermino?: SortOrder
    complejidad?: SortOrder
    actividad?: SortOrder
    taskEstatus?: SortOrder
    completado?: SortOrder
    comentarios?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectTaskMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    nombre?: SortOrder
    disciplina?: SortOrder
    fechaTermino?: SortOrder
    complejidad?: SortOrder
    actividad?: SortOrder
    taskEstatus?: SortOrder
    completado?: SortOrder
    comentarios?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectTaskMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    nombre?: SortOrder
    disciplina?: SortOrder
    fechaTermino?: SortOrder
    complejidad?: SortOrder
    actividad?: SortOrder
    taskEstatus?: SortOrder
    completado?: SortOrder
    comentarios?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTaskDisciplineWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskDiscipline | EnumTaskDisciplineFieldRefInput<$PrismaModel>
    in?: $Enums.TaskDiscipline[]
    notIn?: $Enums.TaskDiscipline[]
    not?: NestedEnumTaskDisciplineWithAggregatesFilter<$PrismaModel> | $Enums.TaskDiscipline
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskDisciplineFilter<$PrismaModel>
    _max?: NestedEnumTaskDisciplineFilter<$PrismaModel>
  }

  export type EnumTaskComplexityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskComplexity | EnumTaskComplexityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskComplexity[]
    notIn?: $Enums.TaskComplexity[]
    not?: NestedEnumTaskComplexityWithAggregatesFilter<$PrismaModel> | $Enums.TaskComplexity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskComplexityFilter<$PrismaModel>
    _max?: NestedEnumTaskComplexityFilter<$PrismaModel>
  }

  export type EnumTaskActivityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskActivity | EnumTaskActivityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskActivity[]
    notIn?: $Enums.TaskActivity[]
    not?: NestedEnumTaskActivityWithAggregatesFilter<$PrismaModel> | $Enums.TaskActivity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskActivityFilter<$PrismaModel>
    _max?: NestedEnumTaskActivityFilter<$PrismaModel>
  }

  export type EnumTaskEstatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskEstatus | EnumTaskEstatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskEstatus[]
    notIn?: $Enums.TaskEstatus[]
    not?: NestedEnumTaskEstatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskEstatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskEstatusFilter<$PrismaModel>
    _max?: NestedEnumTaskEstatusFilter<$PrismaModel>
  }

  export type EnumKnowledgeCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.KnowledgeCategory | EnumKnowledgeCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.KnowledgeCategory[]
    notIn?: $Enums.KnowledgeCategory[]
    not?: NestedEnumKnowledgeCategoryFilter<$PrismaModel> | $Enums.KnowledgeCategory
  }

  export type KnowledgeReferenceCountOrderByAggregateInput = {
    id?: SortOrder
    category?: SortOrder
    titulo?: SortOrder
    descripcion?: SortOrder
    url?: SortOrder
    fuente?: SortOrder
    orden?: SortOrder
    createdAt?: SortOrder
  }

  export type KnowledgeReferenceAvgOrderByAggregateInput = {
    orden?: SortOrder
  }

  export type KnowledgeReferenceMaxOrderByAggregateInput = {
    id?: SortOrder
    category?: SortOrder
    titulo?: SortOrder
    descripcion?: SortOrder
    url?: SortOrder
    fuente?: SortOrder
    orden?: SortOrder
    createdAt?: SortOrder
  }

  export type KnowledgeReferenceMinOrderByAggregateInput = {
    id?: SortOrder
    category?: SortOrder
    titulo?: SortOrder
    descripcion?: SortOrder
    url?: SortOrder
    fuente?: SortOrder
    orden?: SortOrder
    createdAt?: SortOrder
  }

  export type KnowledgeReferenceSumOrderByAggregateInput = {
    orden?: SortOrder
  }

  export type EnumKnowledgeCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KnowledgeCategory | EnumKnowledgeCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.KnowledgeCategory[]
    notIn?: $Enums.KnowledgeCategory[]
    not?: NestedEnumKnowledgeCategoryWithAggregatesFilter<$PrismaModel> | $Enums.KnowledgeCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKnowledgeCategoryFilter<$PrismaModel>
    _max?: NestedEnumKnowledgeCategoryFilter<$PrismaModel>
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type ClientListRelationFilter = {
    every?: ClientWhereInput
    some?: ClientWhereInput
    none?: ClientWhereInput
  }

  export type InvitationListRelationFilter = {
    every?: InvitationWhereInput
    some?: InvitationWhereInput
    none?: InvitationWhereInput
  }

  export type ClientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvitationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    pin?: SortOrder
    rol?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    pin?: SortOrder
    rol?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    pin?: SortOrder
    rol?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type EnumResourceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ResourceType | EnumResourceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ResourceType[]
    notIn?: $Enums.ResourceType[]
    not?: NestedEnumResourceTypeFilter<$PrismaModel> | $Enums.ResourceType
  }

  export type EnumInvitationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvitationStatus | EnumInvitationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvitationStatus[]
    notIn?: $Enums.InvitationStatus[]
    not?: NestedEnumInvitationStatusFilter<$PrismaModel> | $Enums.InvitationStatus
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type InvitationCountOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvitationMaxOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvitationMinOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    resourceType?: SortOrder
    resourceId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumResourceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ResourceType | EnumResourceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ResourceType[]
    notIn?: $Enums.ResourceType[]
    not?: NestedEnumResourceTypeWithAggregatesFilter<$PrismaModel> | $Enums.ResourceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumResourceTypeFilter<$PrismaModel>
    _max?: NestedEnumResourceTypeFilter<$PrismaModel>
  }

  export type EnumInvitationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvitationStatus | EnumInvitationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvitationStatus[]
    notIn?: $Enums.InvitationStatus[]
    not?: NestedEnumInvitationStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvitationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvitationStatusFilter<$PrismaModel>
    _max?: NestedEnumInvitationStatusFilter<$PrismaModel>
  }

  export type ProjectCreateNestedManyWithoutClientInput = {
    create?: XOR<ProjectCreateWithoutClientInput, ProjectUncheckedCreateWithoutClientInput> | ProjectCreateWithoutClientInput[] | ProjectUncheckedCreateWithoutClientInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutClientInput | ProjectCreateOrConnectWithoutClientInput[]
    createMany?: ProjectCreateManyClientInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutOwnedClientsInput = {
    create?: XOR<UserCreateWithoutOwnedClientsInput, UserUncheckedCreateWithoutOwnedClientsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedClientsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutSharedClientsInput = {
    create?: XOR<UserCreateWithoutSharedClientsInput, UserUncheckedCreateWithoutSharedClientsInput> | UserCreateWithoutSharedClientsInput[] | UserUncheckedCreateWithoutSharedClientsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedClientsInput | UserCreateOrConnectWithoutSharedClientsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<ProjectCreateWithoutClientInput, ProjectUncheckedCreateWithoutClientInput> | ProjectCreateWithoutClientInput[] | ProjectUncheckedCreateWithoutClientInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutClientInput | ProjectCreateOrConnectWithoutClientInput[]
    createMany?: ProjectCreateManyClientInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutSharedClientsInput = {
    create?: XOR<UserCreateWithoutSharedClientsInput, UserUncheckedCreateWithoutSharedClientsInput> | UserCreateWithoutSharedClientsInput[] | UserUncheckedCreateWithoutSharedClientsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedClientsInput | UserCreateOrConnectWithoutSharedClientsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProjectUpdateManyWithoutClientNestedInput = {
    create?: XOR<ProjectCreateWithoutClientInput, ProjectUncheckedCreateWithoutClientInput> | ProjectCreateWithoutClientInput[] | ProjectUncheckedCreateWithoutClientInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutClientInput | ProjectCreateOrConnectWithoutClientInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutClientInput | ProjectUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: ProjectCreateManyClientInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutClientInput | ProjectUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutClientInput | ProjectUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type UserUpdateOneWithoutOwnedClientsNestedInput = {
    create?: XOR<UserCreateWithoutOwnedClientsInput, UserUncheckedCreateWithoutOwnedClientsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedClientsInput
    upsert?: UserUpsertWithoutOwnedClientsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOwnedClientsInput, UserUpdateWithoutOwnedClientsInput>, UserUncheckedUpdateWithoutOwnedClientsInput>
  }

  export type UserUpdateManyWithoutSharedClientsNestedInput = {
    create?: XOR<UserCreateWithoutSharedClientsInput, UserUncheckedCreateWithoutSharedClientsInput> | UserCreateWithoutSharedClientsInput[] | UserUncheckedCreateWithoutSharedClientsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedClientsInput | UserCreateOrConnectWithoutSharedClientsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutSharedClientsInput | UserUpsertWithWhereUniqueWithoutSharedClientsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutSharedClientsInput | UserUpdateWithWhereUniqueWithoutSharedClientsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutSharedClientsInput | UserUpdateManyWithWhereWithoutSharedClientsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ProjectUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<ProjectCreateWithoutClientInput, ProjectUncheckedCreateWithoutClientInput> | ProjectCreateWithoutClientInput[] | ProjectUncheckedCreateWithoutClientInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutClientInput | ProjectCreateOrConnectWithoutClientInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutClientInput | ProjectUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: ProjectCreateManyClientInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutClientInput | ProjectUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutClientInput | ProjectUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutSharedClientsNestedInput = {
    create?: XOR<UserCreateWithoutSharedClientsInput, UserUncheckedCreateWithoutSharedClientsInput> | UserCreateWithoutSharedClientsInput[] | UserUncheckedCreateWithoutSharedClientsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedClientsInput | UserCreateOrConnectWithoutSharedClientsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutSharedClientsInput | UserUpsertWithWhereUniqueWithoutSharedClientsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutSharedClientsInput | UserUpdateWithWhereUniqueWithoutSharedClientsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutSharedClientsInput | UserUpdateManyWithWhereWithoutSharedClientsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ClientCreateNestedOneWithoutProjectsInput = {
    create?: XOR<ClientCreateWithoutProjectsInput, ClientUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutProjectsInput
    connect?: ClientWhereUniqueInput
  }

  export type ProjectFileCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type ProjectTaskCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput> | ProjectTaskCreateWithoutProjectInput[] | ProjectTaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutProjectInput | ProjectTaskCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectTaskCreateManyProjectInputEnvelope
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutOwnedProjectsInput = {
    create?: XOR<UserCreateWithoutOwnedProjectsInput, UserUncheckedCreateWithoutOwnedProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedProjectsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutSharedProjectsInput = {
    create?: XOR<UserCreateWithoutSharedProjectsInput, UserUncheckedCreateWithoutSharedProjectsInput> | UserCreateWithoutSharedProjectsInput[] | UserUncheckedCreateWithoutSharedProjectsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedProjectsInput | UserCreateOrConnectWithoutSharedProjectsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ProjectFileUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type ProjectTaskUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput> | ProjectTaskCreateWithoutProjectInput[] | ProjectTaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutProjectInput | ProjectTaskCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectTaskCreateManyProjectInputEnvelope
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutSharedProjectsInput = {
    create?: XOR<UserCreateWithoutSharedProjectsInput, UserUncheckedCreateWithoutSharedProjectsInput> | UserCreateWithoutSharedProjectsInput[] | UserUncheckedCreateWithoutSharedProjectsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedProjectsInput | UserCreateOrConnectWithoutSharedProjectsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumProjectStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProjectStatus
  }

  export type ClientUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<ClientCreateWithoutProjectsInput, ClientUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutProjectsInput
    upsert?: ClientUpsertWithoutProjectsInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutProjectsInput, ClientUpdateWithoutProjectsInput>, ClientUncheckedUpdateWithoutProjectsInput>
  }

  export type ProjectFileUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutProjectInput | ProjectFileUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutProjectInput | ProjectFileUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutProjectInput | ProjectFileUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type ProjectTaskUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput> | ProjectTaskCreateWithoutProjectInput[] | ProjectTaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutProjectInput | ProjectTaskCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectTaskUpsertWithWhereUniqueWithoutProjectInput | ProjectTaskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectTaskCreateManyProjectInputEnvelope
    set?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    disconnect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    delete?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    update?: ProjectTaskUpdateWithWhereUniqueWithoutProjectInput | ProjectTaskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectTaskUpdateManyWithWhereWithoutProjectInput | ProjectTaskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
  }

  export type UserUpdateOneWithoutOwnedProjectsNestedInput = {
    create?: XOR<UserCreateWithoutOwnedProjectsInput, UserUncheckedCreateWithoutOwnedProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedProjectsInput
    upsert?: UserUpsertWithoutOwnedProjectsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOwnedProjectsInput, UserUpdateWithoutOwnedProjectsInput>, UserUncheckedUpdateWithoutOwnedProjectsInput>
  }

  export type UserUpdateManyWithoutSharedProjectsNestedInput = {
    create?: XOR<UserCreateWithoutSharedProjectsInput, UserUncheckedCreateWithoutSharedProjectsInput> | UserCreateWithoutSharedProjectsInput[] | UserUncheckedCreateWithoutSharedProjectsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedProjectsInput | UserCreateOrConnectWithoutSharedProjectsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutSharedProjectsInput | UserUpsertWithWhereUniqueWithoutSharedProjectsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutSharedProjectsInput | UserUpdateWithWhereUniqueWithoutSharedProjectsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutSharedProjectsInput | UserUpdateManyWithWhereWithoutSharedProjectsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ProjectFileUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutProjectInput | ProjectFileUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutProjectInput | ProjectFileUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutProjectInput | ProjectFileUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput> | ProjectTaskCreateWithoutProjectInput[] | ProjectTaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutProjectInput | ProjectTaskCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectTaskUpsertWithWhereUniqueWithoutProjectInput | ProjectTaskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectTaskCreateManyProjectInputEnvelope
    set?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    disconnect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    delete?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    update?: ProjectTaskUpdateWithWhereUniqueWithoutProjectInput | ProjectTaskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectTaskUpdateManyWithWhereWithoutProjectInput | ProjectTaskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutSharedProjectsNestedInput = {
    create?: XOR<UserCreateWithoutSharedProjectsInput, UserUncheckedCreateWithoutSharedProjectsInput> | UserCreateWithoutSharedProjectsInput[] | UserUncheckedCreateWithoutSharedProjectsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedProjectsInput | UserCreateOrConnectWithoutSharedProjectsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutSharedProjectsInput | UserUpsertWithWhereUniqueWithoutSharedProjectsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutSharedProjectsInput | UserUpdateWithWhereUniqueWithoutSharedProjectsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutSharedProjectsInput | UserUpdateManyWithWhereWithoutSharedProjectsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutFilesInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    connect?: ProjectWhereUniqueInput
  }

  export type NullableEnumTechnicalDocTypeFieldUpdateOperationsInput = {
    set?: $Enums.TechnicalDocType | null
  }

  export type ProjectUpdateOneRequiredWithoutFilesNestedInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    upsert?: ProjectUpsertWithoutFilesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutFilesInput, ProjectUpdateWithoutFilesInput>, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type ProjectCreateNestedOneWithoutTasksInput = {
    create?: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTasksInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutOwnedTasksInput = {
    create?: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedTasksInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutSharedTasksInput = {
    create?: XOR<UserCreateWithoutSharedTasksInput, UserUncheckedCreateWithoutSharedTasksInput> | UserCreateWithoutSharedTasksInput[] | UserUncheckedCreateWithoutSharedTasksInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedTasksInput | UserCreateOrConnectWithoutSharedTasksInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutSharedTasksInput = {
    create?: XOR<UserCreateWithoutSharedTasksInput, UserUncheckedCreateWithoutSharedTasksInput> | UserCreateWithoutSharedTasksInput[] | UserUncheckedCreateWithoutSharedTasksInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedTasksInput | UserCreateOrConnectWithoutSharedTasksInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type EnumTaskDisciplineFieldUpdateOperationsInput = {
    set?: $Enums.TaskDiscipline
  }

  export type EnumTaskComplexityFieldUpdateOperationsInput = {
    set?: $Enums.TaskComplexity
  }

  export type EnumTaskActivityFieldUpdateOperationsInput = {
    set?: $Enums.TaskActivity
  }

  export type EnumTaskEstatusFieldUpdateOperationsInput = {
    set?: $Enums.TaskEstatus
  }

  export type ProjectUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTasksInput
    upsert?: ProjectUpsertWithoutTasksInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutTasksInput, ProjectUpdateWithoutTasksInput>, ProjectUncheckedUpdateWithoutTasksInput>
  }

  export type UserUpdateOneWithoutOwnedTasksNestedInput = {
    create?: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedTasksInput
    upsert?: UserUpsertWithoutOwnedTasksInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOwnedTasksInput, UserUpdateWithoutOwnedTasksInput>, UserUncheckedUpdateWithoutOwnedTasksInput>
  }

  export type UserUpdateManyWithoutSharedTasksNestedInput = {
    create?: XOR<UserCreateWithoutSharedTasksInput, UserUncheckedCreateWithoutSharedTasksInput> | UserCreateWithoutSharedTasksInput[] | UserUncheckedCreateWithoutSharedTasksInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedTasksInput | UserCreateOrConnectWithoutSharedTasksInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutSharedTasksInput | UserUpsertWithWhereUniqueWithoutSharedTasksInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutSharedTasksInput | UserUpdateWithWhereUniqueWithoutSharedTasksInput[]
    updateMany?: UserUpdateManyWithWhereWithoutSharedTasksInput | UserUpdateManyWithWhereWithoutSharedTasksInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutSharedTasksNestedInput = {
    create?: XOR<UserCreateWithoutSharedTasksInput, UserUncheckedCreateWithoutSharedTasksInput> | UserCreateWithoutSharedTasksInput[] | UserUncheckedCreateWithoutSharedTasksInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSharedTasksInput | UserCreateOrConnectWithoutSharedTasksInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutSharedTasksInput | UserUpsertWithWhereUniqueWithoutSharedTasksInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutSharedTasksInput | UserUpdateWithWhereUniqueWithoutSharedTasksInput[]
    updateMany?: UserUpdateManyWithWhereWithoutSharedTasksInput | UserUpdateManyWithWhereWithoutSharedTasksInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type EnumKnowledgeCategoryFieldUpdateOperationsInput = {
    set?: $Enums.KnowledgeCategory
  }

  export type ClientCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ClientCreateWithoutOwnerInput, ClientUncheckedCreateWithoutOwnerInput> | ClientCreateWithoutOwnerInput[] | ClientUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutOwnerInput | ClientCreateOrConnectWithoutOwnerInput[]
    createMany?: ClientCreateManyOwnerInputEnvelope
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type ClientCreateNestedManyWithoutSharedWithInput = {
    create?: XOR<ClientCreateWithoutSharedWithInput, ClientUncheckedCreateWithoutSharedWithInput> | ClientCreateWithoutSharedWithInput[] | ClientUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutSharedWithInput | ClientCreateOrConnectWithoutSharedWithInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type ProjectCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectCreateNestedManyWithoutSharedWithInput = {
    create?: XOR<ProjectCreateWithoutSharedWithInput, ProjectUncheckedCreateWithoutSharedWithInput> | ProjectCreateWithoutSharedWithInput[] | ProjectUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutSharedWithInput | ProjectCreateOrConnectWithoutSharedWithInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectTaskCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ProjectTaskCreateWithoutOwnerInput, ProjectTaskUncheckedCreateWithoutOwnerInput> | ProjectTaskCreateWithoutOwnerInput[] | ProjectTaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutOwnerInput | ProjectTaskCreateOrConnectWithoutOwnerInput[]
    createMany?: ProjectTaskCreateManyOwnerInputEnvelope
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
  }

  export type ProjectTaskCreateNestedManyWithoutSharedWithInput = {
    create?: XOR<ProjectTaskCreateWithoutSharedWithInput, ProjectTaskUncheckedCreateWithoutSharedWithInput> | ProjectTaskCreateWithoutSharedWithInput[] | ProjectTaskUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutSharedWithInput | ProjectTaskCreateOrConnectWithoutSharedWithInput[]
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
  }

  export type InvitationCreateNestedManyWithoutSenderInput = {
    create?: XOR<InvitationCreateWithoutSenderInput, InvitationUncheckedCreateWithoutSenderInput> | InvitationCreateWithoutSenderInput[] | InvitationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: InvitationCreateOrConnectWithoutSenderInput | InvitationCreateOrConnectWithoutSenderInput[]
    createMany?: InvitationCreateManySenderInputEnvelope
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
  }

  export type InvitationCreateNestedManyWithoutReceiverInput = {
    create?: XOR<InvitationCreateWithoutReceiverInput, InvitationUncheckedCreateWithoutReceiverInput> | InvitationCreateWithoutReceiverInput[] | InvitationUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: InvitationCreateOrConnectWithoutReceiverInput | InvitationCreateOrConnectWithoutReceiverInput[]
    createMany?: InvitationCreateManyReceiverInputEnvelope
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
  }

  export type ClientUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ClientCreateWithoutOwnerInput, ClientUncheckedCreateWithoutOwnerInput> | ClientCreateWithoutOwnerInput[] | ClientUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutOwnerInput | ClientCreateOrConnectWithoutOwnerInput[]
    createMany?: ClientCreateManyOwnerInputEnvelope
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type ClientUncheckedCreateNestedManyWithoutSharedWithInput = {
    create?: XOR<ClientCreateWithoutSharedWithInput, ClientUncheckedCreateWithoutSharedWithInput> | ClientCreateWithoutSharedWithInput[] | ClientUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutSharedWithInput | ClientCreateOrConnectWithoutSharedWithInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutSharedWithInput = {
    create?: XOR<ProjectCreateWithoutSharedWithInput, ProjectUncheckedCreateWithoutSharedWithInput> | ProjectCreateWithoutSharedWithInput[] | ProjectUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutSharedWithInput | ProjectCreateOrConnectWithoutSharedWithInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectTaskUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ProjectTaskCreateWithoutOwnerInput, ProjectTaskUncheckedCreateWithoutOwnerInput> | ProjectTaskCreateWithoutOwnerInput[] | ProjectTaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutOwnerInput | ProjectTaskCreateOrConnectWithoutOwnerInput[]
    createMany?: ProjectTaskCreateManyOwnerInputEnvelope
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
  }

  export type ProjectTaskUncheckedCreateNestedManyWithoutSharedWithInput = {
    create?: XOR<ProjectTaskCreateWithoutSharedWithInput, ProjectTaskUncheckedCreateWithoutSharedWithInput> | ProjectTaskCreateWithoutSharedWithInput[] | ProjectTaskUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutSharedWithInput | ProjectTaskCreateOrConnectWithoutSharedWithInput[]
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
  }

  export type InvitationUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<InvitationCreateWithoutSenderInput, InvitationUncheckedCreateWithoutSenderInput> | InvitationCreateWithoutSenderInput[] | InvitationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: InvitationCreateOrConnectWithoutSenderInput | InvitationCreateOrConnectWithoutSenderInput[]
    createMany?: InvitationCreateManySenderInputEnvelope
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
  }

  export type InvitationUncheckedCreateNestedManyWithoutReceiverInput = {
    create?: XOR<InvitationCreateWithoutReceiverInput, InvitationUncheckedCreateWithoutReceiverInput> | InvitationCreateWithoutReceiverInput[] | InvitationUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: InvitationCreateOrConnectWithoutReceiverInput | InvitationCreateOrConnectWithoutReceiverInput[]
    createMany?: InvitationCreateManyReceiverInputEnvelope
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type ClientUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ClientCreateWithoutOwnerInput, ClientUncheckedCreateWithoutOwnerInput> | ClientCreateWithoutOwnerInput[] | ClientUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutOwnerInput | ClientCreateOrConnectWithoutOwnerInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutOwnerInput | ClientUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ClientCreateManyOwnerInputEnvelope
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutOwnerInput | ClientUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutOwnerInput | ClientUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type ClientUpdateManyWithoutSharedWithNestedInput = {
    create?: XOR<ClientCreateWithoutSharedWithInput, ClientUncheckedCreateWithoutSharedWithInput> | ClientCreateWithoutSharedWithInput[] | ClientUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutSharedWithInput | ClientCreateOrConnectWithoutSharedWithInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutSharedWithInput | ClientUpsertWithWhereUniqueWithoutSharedWithInput[]
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutSharedWithInput | ClientUpdateWithWhereUniqueWithoutSharedWithInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutSharedWithInput | ClientUpdateManyWithWhereWithoutSharedWithInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type ProjectUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutOwnerInput | ProjectUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutOwnerInput | ProjectUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutOwnerInput | ProjectUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUpdateManyWithoutSharedWithNestedInput = {
    create?: XOR<ProjectCreateWithoutSharedWithInput, ProjectUncheckedCreateWithoutSharedWithInput> | ProjectCreateWithoutSharedWithInput[] | ProjectUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutSharedWithInput | ProjectCreateOrConnectWithoutSharedWithInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutSharedWithInput | ProjectUpsertWithWhereUniqueWithoutSharedWithInput[]
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutSharedWithInput | ProjectUpdateWithWhereUniqueWithoutSharedWithInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutSharedWithInput | ProjectUpdateManyWithWhereWithoutSharedWithInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectTaskUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ProjectTaskCreateWithoutOwnerInput, ProjectTaskUncheckedCreateWithoutOwnerInput> | ProjectTaskCreateWithoutOwnerInput[] | ProjectTaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutOwnerInput | ProjectTaskCreateOrConnectWithoutOwnerInput[]
    upsert?: ProjectTaskUpsertWithWhereUniqueWithoutOwnerInput | ProjectTaskUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ProjectTaskCreateManyOwnerInputEnvelope
    set?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    disconnect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    delete?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    update?: ProjectTaskUpdateWithWhereUniqueWithoutOwnerInput | ProjectTaskUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ProjectTaskUpdateManyWithWhereWithoutOwnerInput | ProjectTaskUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
  }

  export type ProjectTaskUpdateManyWithoutSharedWithNestedInput = {
    create?: XOR<ProjectTaskCreateWithoutSharedWithInput, ProjectTaskUncheckedCreateWithoutSharedWithInput> | ProjectTaskCreateWithoutSharedWithInput[] | ProjectTaskUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutSharedWithInput | ProjectTaskCreateOrConnectWithoutSharedWithInput[]
    upsert?: ProjectTaskUpsertWithWhereUniqueWithoutSharedWithInput | ProjectTaskUpsertWithWhereUniqueWithoutSharedWithInput[]
    set?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    disconnect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    delete?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    update?: ProjectTaskUpdateWithWhereUniqueWithoutSharedWithInput | ProjectTaskUpdateWithWhereUniqueWithoutSharedWithInput[]
    updateMany?: ProjectTaskUpdateManyWithWhereWithoutSharedWithInput | ProjectTaskUpdateManyWithWhereWithoutSharedWithInput[]
    deleteMany?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
  }

  export type InvitationUpdateManyWithoutSenderNestedInput = {
    create?: XOR<InvitationCreateWithoutSenderInput, InvitationUncheckedCreateWithoutSenderInput> | InvitationCreateWithoutSenderInput[] | InvitationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: InvitationCreateOrConnectWithoutSenderInput | InvitationCreateOrConnectWithoutSenderInput[]
    upsert?: InvitationUpsertWithWhereUniqueWithoutSenderInput | InvitationUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: InvitationCreateManySenderInputEnvelope
    set?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    disconnect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    delete?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    update?: InvitationUpdateWithWhereUniqueWithoutSenderInput | InvitationUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: InvitationUpdateManyWithWhereWithoutSenderInput | InvitationUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: InvitationScalarWhereInput | InvitationScalarWhereInput[]
  }

  export type InvitationUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<InvitationCreateWithoutReceiverInput, InvitationUncheckedCreateWithoutReceiverInput> | InvitationCreateWithoutReceiverInput[] | InvitationUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: InvitationCreateOrConnectWithoutReceiverInput | InvitationCreateOrConnectWithoutReceiverInput[]
    upsert?: InvitationUpsertWithWhereUniqueWithoutReceiverInput | InvitationUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: InvitationCreateManyReceiverInputEnvelope
    set?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    disconnect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    delete?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    update?: InvitationUpdateWithWhereUniqueWithoutReceiverInput | InvitationUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: InvitationUpdateManyWithWhereWithoutReceiverInput | InvitationUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: InvitationScalarWhereInput | InvitationScalarWhereInput[]
  }

  export type ClientUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ClientCreateWithoutOwnerInput, ClientUncheckedCreateWithoutOwnerInput> | ClientCreateWithoutOwnerInput[] | ClientUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutOwnerInput | ClientCreateOrConnectWithoutOwnerInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutOwnerInput | ClientUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ClientCreateManyOwnerInputEnvelope
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutOwnerInput | ClientUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutOwnerInput | ClientUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type ClientUncheckedUpdateManyWithoutSharedWithNestedInput = {
    create?: XOR<ClientCreateWithoutSharedWithInput, ClientUncheckedCreateWithoutSharedWithInput> | ClientCreateWithoutSharedWithInput[] | ClientUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutSharedWithInput | ClientCreateOrConnectWithoutSharedWithInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutSharedWithInput | ClientUpsertWithWhereUniqueWithoutSharedWithInput[]
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutSharedWithInput | ClientUpdateWithWhereUniqueWithoutSharedWithInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutSharedWithInput | ClientUpdateManyWithWhereWithoutSharedWithInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput> | ProjectCreateWithoutOwnerInput[] | ProjectUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutOwnerInput | ProjectCreateOrConnectWithoutOwnerInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutOwnerInput | ProjectUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ProjectCreateManyOwnerInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutOwnerInput | ProjectUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutOwnerInput | ProjectUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutSharedWithNestedInput = {
    create?: XOR<ProjectCreateWithoutSharedWithInput, ProjectUncheckedCreateWithoutSharedWithInput> | ProjectCreateWithoutSharedWithInput[] | ProjectUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutSharedWithInput | ProjectCreateOrConnectWithoutSharedWithInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutSharedWithInput | ProjectUpsertWithWhereUniqueWithoutSharedWithInput[]
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutSharedWithInput | ProjectUpdateWithWhereUniqueWithoutSharedWithInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutSharedWithInput | ProjectUpdateManyWithWhereWithoutSharedWithInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type ProjectTaskUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ProjectTaskCreateWithoutOwnerInput, ProjectTaskUncheckedCreateWithoutOwnerInput> | ProjectTaskCreateWithoutOwnerInput[] | ProjectTaskUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutOwnerInput | ProjectTaskCreateOrConnectWithoutOwnerInput[]
    upsert?: ProjectTaskUpsertWithWhereUniqueWithoutOwnerInput | ProjectTaskUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ProjectTaskCreateManyOwnerInputEnvelope
    set?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    disconnect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    delete?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    update?: ProjectTaskUpdateWithWhereUniqueWithoutOwnerInput | ProjectTaskUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ProjectTaskUpdateManyWithWhereWithoutOwnerInput | ProjectTaskUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
  }

  export type ProjectTaskUncheckedUpdateManyWithoutSharedWithNestedInput = {
    create?: XOR<ProjectTaskCreateWithoutSharedWithInput, ProjectTaskUncheckedCreateWithoutSharedWithInput> | ProjectTaskCreateWithoutSharedWithInput[] | ProjectTaskUncheckedCreateWithoutSharedWithInput[]
    connectOrCreate?: ProjectTaskCreateOrConnectWithoutSharedWithInput | ProjectTaskCreateOrConnectWithoutSharedWithInput[]
    upsert?: ProjectTaskUpsertWithWhereUniqueWithoutSharedWithInput | ProjectTaskUpsertWithWhereUniqueWithoutSharedWithInput[]
    set?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    disconnect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    delete?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    connect?: ProjectTaskWhereUniqueInput | ProjectTaskWhereUniqueInput[]
    update?: ProjectTaskUpdateWithWhereUniqueWithoutSharedWithInput | ProjectTaskUpdateWithWhereUniqueWithoutSharedWithInput[]
    updateMany?: ProjectTaskUpdateManyWithWhereWithoutSharedWithInput | ProjectTaskUpdateManyWithWhereWithoutSharedWithInput[]
    deleteMany?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
  }

  export type InvitationUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<InvitationCreateWithoutSenderInput, InvitationUncheckedCreateWithoutSenderInput> | InvitationCreateWithoutSenderInput[] | InvitationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: InvitationCreateOrConnectWithoutSenderInput | InvitationCreateOrConnectWithoutSenderInput[]
    upsert?: InvitationUpsertWithWhereUniqueWithoutSenderInput | InvitationUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: InvitationCreateManySenderInputEnvelope
    set?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    disconnect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    delete?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    update?: InvitationUpdateWithWhereUniqueWithoutSenderInput | InvitationUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: InvitationUpdateManyWithWhereWithoutSenderInput | InvitationUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: InvitationScalarWhereInput | InvitationScalarWhereInput[]
  }

  export type InvitationUncheckedUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<InvitationCreateWithoutReceiverInput, InvitationUncheckedCreateWithoutReceiverInput> | InvitationCreateWithoutReceiverInput[] | InvitationUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: InvitationCreateOrConnectWithoutReceiverInput | InvitationCreateOrConnectWithoutReceiverInput[]
    upsert?: InvitationUpsertWithWhereUniqueWithoutReceiverInput | InvitationUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: InvitationCreateManyReceiverInputEnvelope
    set?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    disconnect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    delete?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    connect?: InvitationWhereUniqueInput | InvitationWhereUniqueInput[]
    update?: InvitationUpdateWithWhereUniqueWithoutReceiverInput | InvitationUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: InvitationUpdateManyWithWhereWithoutReceiverInput | InvitationUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: InvitationScalarWhereInput | InvitationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSentInvitationsInput = {
    create?: XOR<UserCreateWithoutSentInvitationsInput, UserUncheckedCreateWithoutSentInvitationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentInvitationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReceivedInvitationsInput = {
    create?: XOR<UserCreateWithoutReceivedInvitationsInput, UserUncheckedCreateWithoutReceivedInvitationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedInvitationsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumResourceTypeFieldUpdateOperationsInput = {
    set?: $Enums.ResourceType
  }

  export type EnumInvitationStatusFieldUpdateOperationsInput = {
    set?: $Enums.InvitationStatus
  }

  export type UserUpdateOneRequiredWithoutSentInvitationsNestedInput = {
    create?: XOR<UserCreateWithoutSentInvitationsInput, UserUncheckedCreateWithoutSentInvitationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentInvitationsInput
    upsert?: UserUpsertWithoutSentInvitationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSentInvitationsInput, UserUpdateWithoutSentInvitationsInput>, UserUncheckedUpdateWithoutSentInvitationsInput>
  }

  export type UserUpdateOneRequiredWithoutReceivedInvitationsNestedInput = {
    create?: XOR<UserCreateWithoutReceivedInvitationsInput, UserUncheckedCreateWithoutReceivedInvitationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedInvitationsInput
    upsert?: UserUpsertWithoutReceivedInvitationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReceivedInvitationsInput, UserUpdateWithoutReceivedInvitationsInput>, UserUncheckedUpdateWithoutReceivedInvitationsInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
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

  export type NestedEnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[]
    notIn?: $Enums.ProjectStatus[]
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
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

  export type NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[]
    notIn?: $Enums.ProjectStatus[]
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type NestedEnumTechnicalDocTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TechnicalDocType | EnumTechnicalDocTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TechnicalDocType[] | null
    notIn?: $Enums.TechnicalDocType[] | null
    not?: NestedEnumTechnicalDocTypeNullableFilter<$PrismaModel> | $Enums.TechnicalDocType | null
  }

  export type NestedEnumTechnicalDocTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TechnicalDocType | EnumTechnicalDocTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TechnicalDocType[] | null
    notIn?: $Enums.TechnicalDocType[] | null
    not?: NestedEnumTechnicalDocTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.TechnicalDocType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTechnicalDocTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumTechnicalDocTypeNullableFilter<$PrismaModel>
  }

  export type NestedEnumTaskDisciplineFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskDiscipline | EnumTaskDisciplineFieldRefInput<$PrismaModel>
    in?: $Enums.TaskDiscipline[]
    notIn?: $Enums.TaskDiscipline[]
    not?: NestedEnumTaskDisciplineFilter<$PrismaModel> | $Enums.TaskDiscipline
  }

  export type NestedEnumTaskComplexityFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskComplexity | EnumTaskComplexityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskComplexity[]
    notIn?: $Enums.TaskComplexity[]
    not?: NestedEnumTaskComplexityFilter<$PrismaModel> | $Enums.TaskComplexity
  }

  export type NestedEnumTaskActivityFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskActivity | EnumTaskActivityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskActivity[]
    notIn?: $Enums.TaskActivity[]
    not?: NestedEnumTaskActivityFilter<$PrismaModel> | $Enums.TaskActivity
  }

  export type NestedEnumTaskEstatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskEstatus | EnumTaskEstatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskEstatus[]
    notIn?: $Enums.TaskEstatus[]
    not?: NestedEnumTaskEstatusFilter<$PrismaModel> | $Enums.TaskEstatus
  }

  export type NestedEnumTaskDisciplineWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskDiscipline | EnumTaskDisciplineFieldRefInput<$PrismaModel>
    in?: $Enums.TaskDiscipline[]
    notIn?: $Enums.TaskDiscipline[]
    not?: NestedEnumTaskDisciplineWithAggregatesFilter<$PrismaModel> | $Enums.TaskDiscipline
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskDisciplineFilter<$PrismaModel>
    _max?: NestedEnumTaskDisciplineFilter<$PrismaModel>
  }

  export type NestedEnumTaskComplexityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskComplexity | EnumTaskComplexityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskComplexity[]
    notIn?: $Enums.TaskComplexity[]
    not?: NestedEnumTaskComplexityWithAggregatesFilter<$PrismaModel> | $Enums.TaskComplexity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskComplexityFilter<$PrismaModel>
    _max?: NestedEnumTaskComplexityFilter<$PrismaModel>
  }

  export type NestedEnumTaskActivityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskActivity | EnumTaskActivityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskActivity[]
    notIn?: $Enums.TaskActivity[]
    not?: NestedEnumTaskActivityWithAggregatesFilter<$PrismaModel> | $Enums.TaskActivity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskActivityFilter<$PrismaModel>
    _max?: NestedEnumTaskActivityFilter<$PrismaModel>
  }

  export type NestedEnumTaskEstatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskEstatus | EnumTaskEstatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskEstatus[]
    notIn?: $Enums.TaskEstatus[]
    not?: NestedEnumTaskEstatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskEstatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskEstatusFilter<$PrismaModel>
    _max?: NestedEnumTaskEstatusFilter<$PrismaModel>
  }

  export type NestedEnumKnowledgeCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.KnowledgeCategory | EnumKnowledgeCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.KnowledgeCategory[]
    notIn?: $Enums.KnowledgeCategory[]
    not?: NestedEnumKnowledgeCategoryFilter<$PrismaModel> | $Enums.KnowledgeCategory
  }

  export type NestedEnumKnowledgeCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KnowledgeCategory | EnumKnowledgeCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.KnowledgeCategory[]
    notIn?: $Enums.KnowledgeCategory[]
    not?: NestedEnumKnowledgeCategoryWithAggregatesFilter<$PrismaModel> | $Enums.KnowledgeCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumKnowledgeCategoryFilter<$PrismaModel>
    _max?: NestedEnumKnowledgeCategoryFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[]
    notIn?: $Enums.UserRole[]
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedEnumResourceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ResourceType | EnumResourceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ResourceType[]
    notIn?: $Enums.ResourceType[]
    not?: NestedEnumResourceTypeFilter<$PrismaModel> | $Enums.ResourceType
  }

  export type NestedEnumInvitationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvitationStatus | EnumInvitationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvitationStatus[]
    notIn?: $Enums.InvitationStatus[]
    not?: NestedEnumInvitationStatusFilter<$PrismaModel> | $Enums.InvitationStatus
  }

  export type NestedEnumResourceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ResourceType | EnumResourceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ResourceType[]
    notIn?: $Enums.ResourceType[]
    not?: NestedEnumResourceTypeWithAggregatesFilter<$PrismaModel> | $Enums.ResourceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumResourceTypeFilter<$PrismaModel>
    _max?: NestedEnumResourceTypeFilter<$PrismaModel>
  }

  export type NestedEnumInvitationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvitationStatus | EnumInvitationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvitationStatus[]
    notIn?: $Enums.InvitationStatus[]
    not?: NestedEnumInvitationStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvitationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvitationStatusFilter<$PrismaModel>
    _max?: NestedEnumInvitationStatusFilter<$PrismaModel>
  }

  export type ProjectCreateWithoutClientInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    tasks?: ProjectTaskCreateNestedManyWithoutProjectInput
    owner?: UserCreateNestedOneWithoutOwnedProjectsInput
    sharedWith?: UserCreateNestedManyWithoutSharedProjectsInput
  }

  export type ProjectUncheckedCreateWithoutClientInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    tasks?: ProjectTaskUncheckedCreateNestedManyWithoutProjectInput
    sharedWith?: UserUncheckedCreateNestedManyWithoutSharedProjectsInput
  }

  export type ProjectCreateOrConnectWithoutClientInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutClientInput, ProjectUncheckedCreateWithoutClientInput>
  }

  export type ProjectCreateManyClientInputEnvelope = {
    data: ProjectCreateManyClientInput | ProjectCreateManyClientInput[]
  }

  export type UserCreateWithoutOwnedClientsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    sharedClients?: ClientCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutOwnedClientsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    sharedClients?: ClientUncheckedCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectUncheckedCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationUncheckedCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutOwnedClientsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnedClientsInput, UserUncheckedCreateWithoutOwnedClientsInput>
  }

  export type UserCreateWithoutSharedClientsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientCreateNestedManyWithoutOwnerInput
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutSharedClientsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientUncheckedCreateNestedManyWithoutOwnerInput
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectUncheckedCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationUncheckedCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutSharedClientsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSharedClientsInput, UserUncheckedCreateWithoutSharedClientsInput>
  }

  export type ProjectUpsertWithWhereUniqueWithoutClientInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutClientInput, ProjectUncheckedUpdateWithoutClientInput>
    create: XOR<ProjectCreateWithoutClientInput, ProjectUncheckedCreateWithoutClientInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutClientInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutClientInput, ProjectUncheckedUpdateWithoutClientInput>
  }

  export type ProjectUpdateManyWithWhereWithoutClientInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutClientInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    nombre?: StringFilter<"Project"> | string
    ubicacion?: StringFilter<"Project"> | string
    ano?: IntFilter<"Project"> | number
    tipologia?: StringFilter<"Project"> | string
    estatus?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    clientId?: StringFilter<"Project"> | string
    ownerId?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type UserUpsertWithoutOwnedClientsInput = {
    update: XOR<UserUpdateWithoutOwnedClientsInput, UserUncheckedUpdateWithoutOwnedClientsInput>
    create: XOR<UserCreateWithoutOwnedClientsInput, UserUncheckedCreateWithoutOwnedClientsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOwnedClientsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOwnedClientsInput, UserUncheckedUpdateWithoutOwnedClientsInput>
  }

  export type UserUpdateWithoutOwnedClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sharedClients?: ClientUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnedClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sharedClients?: ClientUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUncheckedUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUncheckedUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUncheckedUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutSharedClientsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutSharedClientsInput, UserUncheckedUpdateWithoutSharedClientsInput>
    create: XOR<UserCreateWithoutSharedClientsInput, UserUncheckedCreateWithoutSharedClientsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutSharedClientsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutSharedClientsInput, UserUncheckedUpdateWithoutSharedClientsInput>
  }

  export type UserUpdateManyWithWhereWithoutSharedClientsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutSharedClientsInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    nombre?: StringFilter<"User"> | string
    pin?: StringFilter<"User"> | string
    rol?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type ClientCreateWithoutProjectsInput = {
    id?: string
    nombre: string
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedClientsInput
    sharedWith?: UserCreateNestedManyWithoutSharedClientsInput
  }

  export type ClientUncheckedCreateWithoutProjectsInput = {
    id?: string
    nombre: string
    activo?: boolean
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sharedWith?: UserUncheckedCreateNestedManyWithoutSharedClientsInput
  }

  export type ClientCreateOrConnectWithoutProjectsInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutProjectsInput, ClientUncheckedCreateWithoutProjectsInput>
  }

  export type ProjectFileCreateWithoutProjectInput = {
    id?: string
    originalName: string
    storedPath: string
    mimeType: string
    size: number
    technicalDocType?: $Enums.TechnicalDocType | null
    uploadedAt?: Date | string
    version?: number
  }

  export type ProjectFileUncheckedCreateWithoutProjectInput = {
    id?: string
    originalName: string
    storedPath: string
    mimeType: string
    size: number
    technicalDocType?: $Enums.TechnicalDocType | null
    uploadedAt?: Date | string
    version?: number
  }

  export type ProjectFileCreateOrConnectWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    create: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFileCreateManyProjectInputEnvelope = {
    data: ProjectFileCreateManyProjectInput | ProjectFileCreateManyProjectInput[]
  }

  export type ProjectTaskCreateWithoutProjectInput = {
    id?: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date | string
    complejidad: $Enums.TaskComplexity
    actividad?: $Enums.TaskActivity
    taskEstatus?: $Enums.TaskEstatus
    completado?: boolean
    comentarios?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedTasksInput
    sharedWith?: UserCreateNestedManyWithoutSharedTasksInput
  }

  export type ProjectTaskUncheckedCreateWithoutProjectInput = {
    id?: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date | string
    complejidad: $Enums.TaskComplexity
    actividad?: $Enums.TaskActivity
    taskEstatus?: $Enums.TaskEstatus
    completado?: boolean
    comentarios?: string
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sharedWith?: UserUncheckedCreateNestedManyWithoutSharedTasksInput
  }

  export type ProjectTaskCreateOrConnectWithoutProjectInput = {
    where: ProjectTaskWhereUniqueInput
    create: XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput>
  }

  export type ProjectTaskCreateManyProjectInputEnvelope = {
    data: ProjectTaskCreateManyProjectInput | ProjectTaskCreateManyProjectInput[]
  }

  export type UserCreateWithoutOwnedProjectsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientCreateNestedManyWithoutSharedWithInput
    sharedProjects?: ProjectCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutOwnedProjectsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientUncheckedCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientUncheckedCreateNestedManyWithoutSharedWithInput
    sharedProjects?: ProjectUncheckedCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationUncheckedCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutOwnedProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnedProjectsInput, UserUncheckedCreateWithoutOwnedProjectsInput>
  }

  export type UserCreateWithoutSharedProjectsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    ownedTasks?: ProjectTaskCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutSharedProjectsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientUncheckedCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientUncheckedCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    ownedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationUncheckedCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutSharedProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSharedProjectsInput, UserUncheckedCreateWithoutSharedProjectsInput>
  }

  export type ClientUpsertWithoutProjectsInput = {
    update: XOR<ClientUpdateWithoutProjectsInput, ClientUncheckedUpdateWithoutProjectsInput>
    create: XOR<ClientCreateWithoutProjectsInput, ClientUncheckedCreateWithoutProjectsInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutProjectsInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutProjectsInput, ClientUncheckedUpdateWithoutProjectsInput>
  }

  export type ClientUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedClientsNestedInput
    sharedWith?: UserUpdateManyWithoutSharedClientsNestedInput
  }

  export type ClientUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sharedWith?: UserUncheckedUpdateManyWithoutSharedClientsNestedInput
  }

  export type ProjectFileUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    update: XOR<ProjectFileUpdateWithoutProjectInput, ProjectFileUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFileUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    data: XOR<ProjectFileUpdateWithoutProjectInput, ProjectFileUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectFileUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectFileScalarWhereInput
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectFileScalarWhereInput = {
    AND?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    OR?: ProjectFileScalarWhereInput[]
    NOT?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    projectId?: StringFilter<"ProjectFile"> | string
    originalName?: StringFilter<"ProjectFile"> | string
    storedPath?: StringFilter<"ProjectFile"> | string
    mimeType?: StringFilter<"ProjectFile"> | string
    size?: IntFilter<"ProjectFile"> | number
    technicalDocType?: EnumTechnicalDocTypeNullableFilter<"ProjectFile"> | $Enums.TechnicalDocType | null
    uploadedAt?: DateTimeFilter<"ProjectFile"> | Date | string
    version?: IntFilter<"ProjectFile"> | number
  }

  export type ProjectTaskUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectTaskWhereUniqueInput
    update: XOR<ProjectTaskUpdateWithoutProjectInput, ProjectTaskUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectTaskCreateWithoutProjectInput, ProjectTaskUncheckedCreateWithoutProjectInput>
  }

  export type ProjectTaskUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectTaskWhereUniqueInput
    data: XOR<ProjectTaskUpdateWithoutProjectInput, ProjectTaskUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectTaskUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectTaskScalarWhereInput
    data: XOR<ProjectTaskUpdateManyMutationInput, ProjectTaskUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectTaskScalarWhereInput = {
    AND?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
    OR?: ProjectTaskScalarWhereInput[]
    NOT?: ProjectTaskScalarWhereInput | ProjectTaskScalarWhereInput[]
    id?: StringFilter<"ProjectTask"> | string
    projectId?: StringFilter<"ProjectTask"> | string
    nombre?: StringFilter<"ProjectTask"> | string
    disciplina?: EnumTaskDisciplineFilter<"ProjectTask"> | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFilter<"ProjectTask"> | Date | string
    complejidad?: EnumTaskComplexityFilter<"ProjectTask"> | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFilter<"ProjectTask"> | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFilter<"ProjectTask"> | $Enums.TaskEstatus
    completado?: BoolFilter<"ProjectTask"> | boolean
    comentarios?: StringFilter<"ProjectTask"> | string
    ownerId?: StringNullableFilter<"ProjectTask"> | string | null
    createdAt?: DateTimeFilter<"ProjectTask"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectTask"> | Date | string
  }

  export type UserUpsertWithoutOwnedProjectsInput = {
    update: XOR<UserUpdateWithoutOwnedProjectsInput, UserUncheckedUpdateWithoutOwnedProjectsInput>
    create: XOR<UserCreateWithoutOwnedProjectsInput, UserUncheckedCreateWithoutOwnedProjectsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOwnedProjectsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOwnedProjectsInput, UserUncheckedUpdateWithoutOwnedProjectsInput>
  }

  export type UserUpdateWithoutOwnedProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUpdateManyWithoutSharedWithNestedInput
    sharedProjects?: ProjectUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnedProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUncheckedUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUncheckedUpdateManyWithoutSharedWithNestedInput
    sharedProjects?: ProjectUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUncheckedUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUncheckedUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUncheckedUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutSharedProjectsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutSharedProjectsInput, UserUncheckedUpdateWithoutSharedProjectsInput>
    create: XOR<UserCreateWithoutSharedProjectsInput, UserUncheckedCreateWithoutSharedProjectsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutSharedProjectsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutSharedProjectsInput, UserUncheckedUpdateWithoutSharedProjectsInput>
  }

  export type UserUpdateManyWithWhereWithoutSharedProjectsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutSharedProjectsInput>
  }

  export type ProjectCreateWithoutFilesInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutProjectsInput
    tasks?: ProjectTaskCreateNestedManyWithoutProjectInput
    owner?: UserCreateNestedOneWithoutOwnedProjectsInput
    sharedWith?: UserCreateNestedManyWithoutSharedProjectsInput
  }

  export type ProjectUncheckedCreateWithoutFilesInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    clientId: string
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: ProjectTaskUncheckedCreateNestedManyWithoutProjectInput
    sharedWith?: UserUncheckedCreateNestedManyWithoutSharedProjectsInput
  }

  export type ProjectCreateOrConnectWithoutFilesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
  }

  export type ProjectUpsertWithoutFilesInput = {
    update: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutFilesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type ProjectUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutProjectsNestedInput
    tasks?: ProjectTaskUpdateManyWithoutProjectNestedInput
    owner?: UserUpdateOneWithoutOwnedProjectsNestedInput
    sharedWith?: UserUpdateManyWithoutSharedProjectsNestedInput
  }

  export type ProjectUncheckedUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    clientId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput
    sharedWith?: UserUncheckedUpdateManyWithoutSharedProjectsNestedInput
  }

  export type ProjectCreateWithoutTasksInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    owner?: UserCreateNestedOneWithoutOwnedProjectsInput
    sharedWith?: UserCreateNestedManyWithoutSharedProjectsInput
  }

  export type ProjectUncheckedCreateWithoutTasksInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    clientId: string
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    sharedWith?: UserUncheckedCreateNestedManyWithoutSharedProjectsInput
  }

  export type ProjectCreateOrConnectWithoutTasksInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
  }

  export type UserCreateWithoutOwnedTasksInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectCreateNestedManyWithoutSharedWithInput
    sharedTasks?: ProjectTaskCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutOwnedTasksInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientUncheckedCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientUncheckedCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectUncheckedCreateNestedManyWithoutSharedWithInput
    sharedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationUncheckedCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutOwnedTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
  }

  export type UserCreateWithoutSharedTasksInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskCreateNestedManyWithoutOwnerInput
    sentInvitations?: InvitationCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutSharedTasksInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientUncheckedCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientUncheckedCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectUncheckedCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutOwnerInput
    sentInvitations?: InvitationUncheckedCreateNestedManyWithoutSenderInput
    receivedInvitations?: InvitationUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutSharedTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSharedTasksInput, UserUncheckedCreateWithoutSharedTasksInput>
  }

  export type ProjectUpsertWithoutTasksInput = {
    update: XOR<ProjectUpdateWithoutTasksInput, ProjectUncheckedUpdateWithoutTasksInput>
    create: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutTasksInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutTasksInput, ProjectUncheckedUpdateWithoutTasksInput>
  }

  export type ProjectUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    owner?: UserUpdateOneWithoutOwnedProjectsNestedInput
    sharedWith?: UserUpdateManyWithoutSharedProjectsNestedInput
  }

  export type ProjectUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    clientId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    sharedWith?: UserUncheckedUpdateManyWithoutSharedProjectsNestedInput
  }

  export type UserUpsertWithoutOwnedTasksInput = {
    update: XOR<UserUpdateWithoutOwnedTasksInput, UserUncheckedUpdateWithoutOwnedTasksInput>
    create: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOwnedTasksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOwnedTasksInput, UserUncheckedUpdateWithoutOwnedTasksInput>
  }

  export type UserUpdateWithoutOwnedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUpdateManyWithoutSharedWithNestedInput
    sharedTasks?: ProjectTaskUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUncheckedUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUncheckedUpdateManyWithoutSharedWithNestedInput
    sharedTasks?: ProjectTaskUncheckedUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUncheckedUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutSharedTasksInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutSharedTasksInput, UserUncheckedUpdateWithoutSharedTasksInput>
    create: XOR<UserCreateWithoutSharedTasksInput, UserUncheckedCreateWithoutSharedTasksInput>
  }

  export type UserUpdateWithWhereUniqueWithoutSharedTasksInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutSharedTasksInput, UserUncheckedUpdateWithoutSharedTasksInput>
  }

  export type UserUpdateManyWithWhereWithoutSharedTasksInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutSharedTasksInput>
  }

  export type ClientCreateWithoutOwnerInput = {
    id?: string
    nombre: string
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutClientInput
    sharedWith?: UserCreateNestedManyWithoutSharedClientsInput
  }

  export type ClientUncheckedCreateWithoutOwnerInput = {
    id?: string
    nombre: string
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutClientInput
    sharedWith?: UserUncheckedCreateNestedManyWithoutSharedClientsInput
  }

  export type ClientCreateOrConnectWithoutOwnerInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutOwnerInput, ClientUncheckedCreateWithoutOwnerInput>
  }

  export type ClientCreateManyOwnerInputEnvelope = {
    data: ClientCreateManyOwnerInput | ClientCreateManyOwnerInput[]
  }

  export type ClientCreateWithoutSharedWithInput = {
    id?: string
    nombre: string
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutClientInput
    owner?: UserCreateNestedOneWithoutOwnedClientsInput
  }

  export type ClientUncheckedCreateWithoutSharedWithInput = {
    id?: string
    nombre: string
    activo?: boolean
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutSharedWithInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutSharedWithInput, ClientUncheckedCreateWithoutSharedWithInput>
  }

  export type ProjectCreateWithoutOwnerInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    tasks?: ProjectTaskCreateNestedManyWithoutProjectInput
    sharedWith?: UserCreateNestedManyWithoutSharedProjectsInput
  }

  export type ProjectUncheckedCreateWithoutOwnerInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    clientId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    tasks?: ProjectTaskUncheckedCreateNestedManyWithoutProjectInput
    sharedWith?: UserUncheckedCreateNestedManyWithoutSharedProjectsInput
  }

  export type ProjectCreateOrConnectWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput>
  }

  export type ProjectCreateManyOwnerInputEnvelope = {
    data: ProjectCreateManyOwnerInput | ProjectCreateManyOwnerInput[]
  }

  export type ProjectCreateWithoutSharedWithInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutProjectsInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
    tasks?: ProjectTaskCreateNestedManyWithoutProjectInput
    owner?: UserCreateNestedOneWithoutOwnedProjectsInput
  }

  export type ProjectUncheckedCreateWithoutSharedWithInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    clientId: string
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
    tasks?: ProjectTaskUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutSharedWithInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutSharedWithInput, ProjectUncheckedCreateWithoutSharedWithInput>
  }

  export type ProjectTaskCreateWithoutOwnerInput = {
    id?: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date | string
    complejidad: $Enums.TaskComplexity
    actividad?: $Enums.TaskActivity
    taskEstatus?: $Enums.TaskEstatus
    completado?: boolean
    comentarios?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutTasksInput
    sharedWith?: UserCreateNestedManyWithoutSharedTasksInput
  }

  export type ProjectTaskUncheckedCreateWithoutOwnerInput = {
    id?: string
    projectId: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date | string
    complejidad: $Enums.TaskComplexity
    actividad?: $Enums.TaskActivity
    taskEstatus?: $Enums.TaskEstatus
    completado?: boolean
    comentarios?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sharedWith?: UserUncheckedCreateNestedManyWithoutSharedTasksInput
  }

  export type ProjectTaskCreateOrConnectWithoutOwnerInput = {
    where: ProjectTaskWhereUniqueInput
    create: XOR<ProjectTaskCreateWithoutOwnerInput, ProjectTaskUncheckedCreateWithoutOwnerInput>
  }

  export type ProjectTaskCreateManyOwnerInputEnvelope = {
    data: ProjectTaskCreateManyOwnerInput | ProjectTaskCreateManyOwnerInput[]
  }

  export type ProjectTaskCreateWithoutSharedWithInput = {
    id?: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date | string
    complejidad: $Enums.TaskComplexity
    actividad?: $Enums.TaskActivity
    taskEstatus?: $Enums.TaskEstatus
    completado?: boolean
    comentarios?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutTasksInput
    owner?: UserCreateNestedOneWithoutOwnedTasksInput
  }

  export type ProjectTaskUncheckedCreateWithoutSharedWithInput = {
    id?: string
    projectId: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date | string
    complejidad: $Enums.TaskComplexity
    actividad?: $Enums.TaskActivity
    taskEstatus?: $Enums.TaskEstatus
    completado?: boolean
    comentarios?: string
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectTaskCreateOrConnectWithoutSharedWithInput = {
    where: ProjectTaskWhereUniqueInput
    create: XOR<ProjectTaskCreateWithoutSharedWithInput, ProjectTaskUncheckedCreateWithoutSharedWithInput>
  }

  export type InvitationCreateWithoutSenderInput = {
    id?: string
    resourceType: $Enums.ResourceType
    resourceId: string
    status?: $Enums.InvitationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    receiver: UserCreateNestedOneWithoutReceivedInvitationsInput
  }

  export type InvitationUncheckedCreateWithoutSenderInput = {
    id?: string
    receiverId: string
    resourceType: $Enums.ResourceType
    resourceId: string
    status?: $Enums.InvitationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvitationCreateOrConnectWithoutSenderInput = {
    where: InvitationWhereUniqueInput
    create: XOR<InvitationCreateWithoutSenderInput, InvitationUncheckedCreateWithoutSenderInput>
  }

  export type InvitationCreateManySenderInputEnvelope = {
    data: InvitationCreateManySenderInput | InvitationCreateManySenderInput[]
  }

  export type InvitationCreateWithoutReceiverInput = {
    id?: string
    resourceType: $Enums.ResourceType
    resourceId: string
    status?: $Enums.InvitationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentInvitationsInput
  }

  export type InvitationUncheckedCreateWithoutReceiverInput = {
    id?: string
    senderId: string
    resourceType: $Enums.ResourceType
    resourceId: string
    status?: $Enums.InvitationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvitationCreateOrConnectWithoutReceiverInput = {
    where: InvitationWhereUniqueInput
    create: XOR<InvitationCreateWithoutReceiverInput, InvitationUncheckedCreateWithoutReceiverInput>
  }

  export type InvitationCreateManyReceiverInputEnvelope = {
    data: InvitationCreateManyReceiverInput | InvitationCreateManyReceiverInput[]
  }

  export type ClientUpsertWithWhereUniqueWithoutOwnerInput = {
    where: ClientWhereUniqueInput
    update: XOR<ClientUpdateWithoutOwnerInput, ClientUncheckedUpdateWithoutOwnerInput>
    create: XOR<ClientCreateWithoutOwnerInput, ClientUncheckedCreateWithoutOwnerInput>
  }

  export type ClientUpdateWithWhereUniqueWithoutOwnerInput = {
    where: ClientWhereUniqueInput
    data: XOR<ClientUpdateWithoutOwnerInput, ClientUncheckedUpdateWithoutOwnerInput>
  }

  export type ClientUpdateManyWithWhereWithoutOwnerInput = {
    where: ClientScalarWhereInput
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyWithoutOwnerInput>
  }

  export type ClientScalarWhereInput = {
    AND?: ClientScalarWhereInput | ClientScalarWhereInput[]
    OR?: ClientScalarWhereInput[]
    NOT?: ClientScalarWhereInput | ClientScalarWhereInput[]
    id?: StringFilter<"Client"> | string
    nombre?: StringFilter<"Client"> | string
    activo?: BoolFilter<"Client"> | boolean
    ownerId?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
  }

  export type ClientUpsertWithWhereUniqueWithoutSharedWithInput = {
    where: ClientWhereUniqueInput
    update: XOR<ClientUpdateWithoutSharedWithInput, ClientUncheckedUpdateWithoutSharedWithInput>
    create: XOR<ClientCreateWithoutSharedWithInput, ClientUncheckedCreateWithoutSharedWithInput>
  }

  export type ClientUpdateWithWhereUniqueWithoutSharedWithInput = {
    where: ClientWhereUniqueInput
    data: XOR<ClientUpdateWithoutSharedWithInput, ClientUncheckedUpdateWithoutSharedWithInput>
  }

  export type ClientUpdateManyWithWhereWithoutSharedWithInput = {
    where: ClientScalarWhereInput
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyWithoutSharedWithInput>
  }

  export type ProjectUpsertWithWhereUniqueWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutOwnerInput, ProjectUncheckedUpdateWithoutOwnerInput>
    create: XOR<ProjectCreateWithoutOwnerInput, ProjectUncheckedCreateWithoutOwnerInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutOwnerInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutOwnerInput, ProjectUncheckedUpdateWithoutOwnerInput>
  }

  export type ProjectUpdateManyWithWhereWithoutOwnerInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutOwnerInput>
  }

  export type ProjectUpsertWithWhereUniqueWithoutSharedWithInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutSharedWithInput, ProjectUncheckedUpdateWithoutSharedWithInput>
    create: XOR<ProjectCreateWithoutSharedWithInput, ProjectUncheckedCreateWithoutSharedWithInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutSharedWithInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutSharedWithInput, ProjectUncheckedUpdateWithoutSharedWithInput>
  }

  export type ProjectUpdateManyWithWhereWithoutSharedWithInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutSharedWithInput>
  }

  export type ProjectTaskUpsertWithWhereUniqueWithoutOwnerInput = {
    where: ProjectTaskWhereUniqueInput
    update: XOR<ProjectTaskUpdateWithoutOwnerInput, ProjectTaskUncheckedUpdateWithoutOwnerInput>
    create: XOR<ProjectTaskCreateWithoutOwnerInput, ProjectTaskUncheckedCreateWithoutOwnerInput>
  }

  export type ProjectTaskUpdateWithWhereUniqueWithoutOwnerInput = {
    where: ProjectTaskWhereUniqueInput
    data: XOR<ProjectTaskUpdateWithoutOwnerInput, ProjectTaskUncheckedUpdateWithoutOwnerInput>
  }

  export type ProjectTaskUpdateManyWithWhereWithoutOwnerInput = {
    where: ProjectTaskScalarWhereInput
    data: XOR<ProjectTaskUpdateManyMutationInput, ProjectTaskUncheckedUpdateManyWithoutOwnerInput>
  }

  export type ProjectTaskUpsertWithWhereUniqueWithoutSharedWithInput = {
    where: ProjectTaskWhereUniqueInput
    update: XOR<ProjectTaskUpdateWithoutSharedWithInput, ProjectTaskUncheckedUpdateWithoutSharedWithInput>
    create: XOR<ProjectTaskCreateWithoutSharedWithInput, ProjectTaskUncheckedCreateWithoutSharedWithInput>
  }

  export type ProjectTaskUpdateWithWhereUniqueWithoutSharedWithInput = {
    where: ProjectTaskWhereUniqueInput
    data: XOR<ProjectTaskUpdateWithoutSharedWithInput, ProjectTaskUncheckedUpdateWithoutSharedWithInput>
  }

  export type ProjectTaskUpdateManyWithWhereWithoutSharedWithInput = {
    where: ProjectTaskScalarWhereInput
    data: XOR<ProjectTaskUpdateManyMutationInput, ProjectTaskUncheckedUpdateManyWithoutSharedWithInput>
  }

  export type InvitationUpsertWithWhereUniqueWithoutSenderInput = {
    where: InvitationWhereUniqueInput
    update: XOR<InvitationUpdateWithoutSenderInput, InvitationUncheckedUpdateWithoutSenderInput>
    create: XOR<InvitationCreateWithoutSenderInput, InvitationUncheckedCreateWithoutSenderInput>
  }

  export type InvitationUpdateWithWhereUniqueWithoutSenderInput = {
    where: InvitationWhereUniqueInput
    data: XOR<InvitationUpdateWithoutSenderInput, InvitationUncheckedUpdateWithoutSenderInput>
  }

  export type InvitationUpdateManyWithWhereWithoutSenderInput = {
    where: InvitationScalarWhereInput
    data: XOR<InvitationUpdateManyMutationInput, InvitationUncheckedUpdateManyWithoutSenderInput>
  }

  export type InvitationScalarWhereInput = {
    AND?: InvitationScalarWhereInput | InvitationScalarWhereInput[]
    OR?: InvitationScalarWhereInput[]
    NOT?: InvitationScalarWhereInput | InvitationScalarWhereInput[]
    id?: StringFilter<"Invitation"> | string
    senderId?: StringFilter<"Invitation"> | string
    receiverId?: StringFilter<"Invitation"> | string
    resourceType?: EnumResourceTypeFilter<"Invitation"> | $Enums.ResourceType
    resourceId?: StringFilter<"Invitation"> | string
    status?: EnumInvitationStatusFilter<"Invitation"> | $Enums.InvitationStatus
    createdAt?: DateTimeFilter<"Invitation"> | Date | string
    updatedAt?: DateTimeFilter<"Invitation"> | Date | string
  }

  export type InvitationUpsertWithWhereUniqueWithoutReceiverInput = {
    where: InvitationWhereUniqueInput
    update: XOR<InvitationUpdateWithoutReceiverInput, InvitationUncheckedUpdateWithoutReceiverInput>
    create: XOR<InvitationCreateWithoutReceiverInput, InvitationUncheckedCreateWithoutReceiverInput>
  }

  export type InvitationUpdateWithWhereUniqueWithoutReceiverInput = {
    where: InvitationWhereUniqueInput
    data: XOR<InvitationUpdateWithoutReceiverInput, InvitationUncheckedUpdateWithoutReceiverInput>
  }

  export type InvitationUpdateManyWithWhereWithoutReceiverInput = {
    where: InvitationScalarWhereInput
    data: XOR<InvitationUpdateManyMutationInput, InvitationUncheckedUpdateManyWithoutReceiverInput>
  }

  export type UserCreateWithoutSentInvitationsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskCreateNestedManyWithoutSharedWithInput
    receivedInvitations?: InvitationCreateNestedManyWithoutReceiverInput
  }

  export type UserUncheckedCreateWithoutSentInvitationsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientUncheckedCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientUncheckedCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectUncheckedCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutSharedWithInput
    receivedInvitations?: InvitationUncheckedCreateNestedManyWithoutReceiverInput
  }

  export type UserCreateOrConnectWithoutSentInvitationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSentInvitationsInput, UserUncheckedCreateWithoutSentInvitationsInput>
  }

  export type UserCreateWithoutReceivedInvitationsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationCreateNestedManyWithoutSenderInput
  }

  export type UserUncheckedCreateWithoutReceivedInvitationsInput = {
    id?: string
    nombre: string
    pin: string
    rol?: $Enums.UserRole
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedClients?: ClientUncheckedCreateNestedManyWithoutOwnerInput
    sharedClients?: ClientUncheckedCreateNestedManyWithoutSharedWithInput
    ownedProjects?: ProjectUncheckedCreateNestedManyWithoutOwnerInput
    sharedProjects?: ProjectUncheckedCreateNestedManyWithoutSharedWithInput
    ownedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutOwnerInput
    sharedTasks?: ProjectTaskUncheckedCreateNestedManyWithoutSharedWithInput
    sentInvitations?: InvitationUncheckedCreateNestedManyWithoutSenderInput
  }

  export type UserCreateOrConnectWithoutReceivedInvitationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReceivedInvitationsInput, UserUncheckedCreateWithoutReceivedInvitationsInput>
  }

  export type UserUpsertWithoutSentInvitationsInput = {
    update: XOR<UserUpdateWithoutSentInvitationsInput, UserUncheckedUpdateWithoutSentInvitationsInput>
    create: XOR<UserCreateWithoutSentInvitationsInput, UserUncheckedCreateWithoutSentInvitationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSentInvitationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSentInvitationsInput, UserUncheckedUpdateWithoutSentInvitationsInput>
  }

  export type UserUpdateWithoutSentInvitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUpdateManyWithoutSharedWithNestedInput
    receivedInvitations?: InvitationUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutSentInvitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUncheckedUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUncheckedUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUncheckedUpdateManyWithoutSharedWithNestedInput
    receivedInvitations?: InvitationUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUpsertWithoutReceivedInvitationsInput = {
    update: XOR<UserUpdateWithoutReceivedInvitationsInput, UserUncheckedUpdateWithoutReceivedInvitationsInput>
    create: XOR<UserCreateWithoutReceivedInvitationsInput, UserUncheckedCreateWithoutReceivedInvitationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReceivedInvitationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReceivedInvitationsInput, UserUncheckedUpdateWithoutReceivedInvitationsInput>
  }

  export type UserUpdateWithoutReceivedInvitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUpdateManyWithoutSenderNestedInput
  }

  export type UserUncheckedUpdateWithoutReceivedInvitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUncheckedUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUncheckedUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUncheckedUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUncheckedUpdateManyWithoutSenderNestedInput
  }

  export type ProjectCreateManyClientInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    tasks?: ProjectTaskUpdateManyWithoutProjectNestedInput
    owner?: UserUpdateOneWithoutOwnedProjectsNestedInput
    sharedWith?: UserUpdateManyWithoutSharedProjectsNestedInput
  }

  export type ProjectUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    tasks?: ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput
    sharedWith?: UserUncheckedUpdateManyWithoutSharedProjectsNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpdateWithoutSharedClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUpdateManyWithoutOwnerNestedInput
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutSharedClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUncheckedUpdateManyWithoutOwnerNestedInput
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUncheckedUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUncheckedUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUncheckedUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateManyWithoutSharedClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileCreateManyProjectInput = {
    id?: string
    originalName: string
    storedPath: string
    mimeType: string
    size: number
    technicalDocType?: $Enums.TechnicalDocType | null
    uploadedAt?: Date | string
    version?: number
  }

  export type ProjectTaskCreateManyProjectInput = {
    id?: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date | string
    complejidad: $Enums.TaskComplexity
    actividad?: $Enums.TaskActivity
    taskEstatus?: $Enums.TaskEstatus
    completado?: boolean
    comentarios?: string
    ownerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectFileUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    storedPath?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    technicalDocType?: NullableEnumTechnicalDocTypeFieldUpdateOperationsInput | $Enums.TechnicalDocType | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ProjectFileUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    storedPath?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    technicalDocType?: NullableEnumTechnicalDocTypeFieldUpdateOperationsInput | $Enums.TechnicalDocType | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ProjectFileUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalName?: StringFieldUpdateOperationsInput | string
    storedPath?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    technicalDocType?: NullableEnumTechnicalDocTypeFieldUpdateOperationsInput | $Enums.TechnicalDocType | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ProjectTaskUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedTasksNestedInput
    sharedWith?: UserUpdateManyWithoutSharedTasksNestedInput
  }

  export type ProjectTaskUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sharedWith?: UserUncheckedUpdateManyWithoutSharedTasksNestedInput
  }

  export type ProjectTaskUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpdateWithoutSharedProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    ownedTasks?: ProjectTaskUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutSharedProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUncheckedUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    ownedTasks?: ProjectTaskUncheckedUpdateManyWithoutOwnerNestedInput
    sharedTasks?: ProjectTaskUncheckedUpdateManyWithoutSharedWithNestedInput
    sentInvitations?: InvitationUncheckedUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateManyWithoutSharedProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpdateWithoutSharedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUpdateManyWithoutOwnerNestedInput
    sentInvitations?: InvitationUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateWithoutSharedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedClients?: ClientUncheckedUpdateManyWithoutOwnerNestedInput
    sharedClients?: ClientUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedProjects?: ProjectUncheckedUpdateManyWithoutOwnerNestedInput
    sharedProjects?: ProjectUncheckedUpdateManyWithoutSharedWithNestedInput
    ownedTasks?: ProjectTaskUncheckedUpdateManyWithoutOwnerNestedInput
    sentInvitations?: InvitationUncheckedUpdateManyWithoutSenderNestedInput
    receivedInvitations?: InvitationUncheckedUpdateManyWithoutReceiverNestedInput
  }

  export type UserUncheckedUpdateManyWithoutSharedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    pin?: StringFieldUpdateOperationsInput | string
    rol?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientCreateManyOwnerInput = {
    id?: string
    nombre: string
    activo?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectCreateManyOwnerInput = {
    id?: string
    nombre: string
    ubicacion: string
    ano: number
    tipologia: string
    estatus?: $Enums.ProjectStatus
    clientId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectTaskCreateManyOwnerInput = {
    id?: string
    projectId: string
    nombre: string
    disciplina: $Enums.TaskDiscipline
    fechaTermino: Date | string
    complejidad: $Enums.TaskComplexity
    actividad?: $Enums.TaskActivity
    taskEstatus?: $Enums.TaskEstatus
    completado?: boolean
    comentarios?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvitationCreateManySenderInput = {
    id?: string
    receiverId: string
    resourceType: $Enums.ResourceType
    resourceId: string
    status?: $Enums.InvitationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvitationCreateManyReceiverInput = {
    id?: string
    senderId: string
    resourceType: $Enums.ResourceType
    resourceId: string
    status?: $Enums.InvitationStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutClientNestedInput
    sharedWith?: UserUpdateManyWithoutSharedClientsNestedInput
  }

  export type ClientUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutClientNestedInput
    sharedWith?: UserUncheckedUpdateManyWithoutSharedClientsNestedInput
  }

  export type ClientUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutClientNestedInput
    owner?: UserUpdateOneWithoutOwnedClientsNestedInput
  }

  export type ClientUncheckedUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateManyWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    activo?: BoolFieldUpdateOperationsInput | boolean
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    tasks?: ProjectTaskUpdateManyWithoutProjectNestedInput
    sharedWith?: UserUpdateManyWithoutSharedProjectsNestedInput
  }

  export type ProjectUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    clientId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    tasks?: ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput
    sharedWith?: UserUncheckedUpdateManyWithoutSharedProjectsNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    clientId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutProjectsNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
    tasks?: ProjectTaskUpdateManyWithoutProjectNestedInput
    owner?: UserUpdateOneWithoutOwnedProjectsNestedInput
  }

  export type ProjectUncheckedUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    clientId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
    tasks?: ProjectTaskUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    ubicacion?: StringFieldUpdateOperationsInput | string
    ano?: IntFieldUpdateOperationsInput | number
    tipologia?: StringFieldUpdateOperationsInput | string
    estatus?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    clientId?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectTaskUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutTasksNestedInput
    sharedWith?: UserUpdateManyWithoutSharedTasksNestedInput
  }

  export type ProjectTaskUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sharedWith?: UserUncheckedUpdateManyWithoutSharedTasksNestedInput
  }

  export type ProjectTaskUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectTaskUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutTasksNestedInput
    owner?: UserUpdateOneWithoutOwnedTasksNestedInput
  }

  export type ProjectTaskUncheckedUpdateWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectTaskUncheckedUpdateManyWithoutSharedWithInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    nombre?: StringFieldUpdateOperationsInput | string
    disciplina?: EnumTaskDisciplineFieldUpdateOperationsInput | $Enums.TaskDiscipline
    fechaTermino?: DateTimeFieldUpdateOperationsInput | Date | string
    complejidad?: EnumTaskComplexityFieldUpdateOperationsInput | $Enums.TaskComplexity
    actividad?: EnumTaskActivityFieldUpdateOperationsInput | $Enums.TaskActivity
    taskEstatus?: EnumTaskEstatusFieldUpdateOperationsInput | $Enums.TaskEstatus
    completado?: BoolFieldUpdateOperationsInput | boolean
    comentarios?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvitationUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    resourceType?: EnumResourceTypeFieldUpdateOperationsInput | $Enums.ResourceType
    resourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receiver?: UserUpdateOneRequiredWithoutReceivedInvitationsNestedInput
  }

  export type InvitationUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    resourceType?: EnumResourceTypeFieldUpdateOperationsInput | $Enums.ResourceType
    resourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvitationUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    resourceType?: EnumResourceTypeFieldUpdateOperationsInput | $Enums.ResourceType
    resourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvitationUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    resourceType?: EnumResourceTypeFieldUpdateOperationsInput | $Enums.ResourceType
    resourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentInvitationsNestedInput
  }

  export type InvitationUncheckedUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    resourceType?: EnumResourceTypeFieldUpdateOperationsInput | $Enums.ResourceType
    resourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvitationUncheckedUpdateManyWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    resourceType?: EnumResourceTypeFieldUpdateOperationsInput | $Enums.ResourceType
    resourceId?: StringFieldUpdateOperationsInput | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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