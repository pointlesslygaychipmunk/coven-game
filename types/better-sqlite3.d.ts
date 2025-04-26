declare module "better-sqlite3" {
  interface Statement {
    run(...params: any[]): any;
    get(...params: any[]): any;
    all(...params: any[]): any;
  }

  interface Database {
    prepare(sql: string): Statement;
    close(): void;
  }

  function Database(filename: string, options?: any): Database;
  export = Database;
}