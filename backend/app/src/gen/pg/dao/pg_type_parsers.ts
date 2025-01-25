
import {types as pgTypes} from "pg";
export function setTypeParsers() {
    //pgTypes.setTypeParser(pgTypes.builtins.BOOL, (v) => v === null ? null : v === '"true"');
    ////pgTypes.setTypeParser(pgTypes.builtins.BIT, (v) => v === null ? null : v);
    ////pgTypes.setTypeParser(pgTypes.builtins.VARBIT, (v) => v);
    //pgTypes.setTypeParser(pgTypes.builtins.INT2, (v) => v === null ? null : BigInt(v));
    //pgTypes.setTypeParser(pgTypes.builtins.INT4, (v) => v === null ? null : BigInt(v));
    //pgTypes.setTypeParser(pgTypes.builtins.INT8, (v) => v === null ? null : BigInt(v));
    ////pgTypes.setTypeParser(pgTypes.builtins.BYTEA, (v) => v);
    //pgTypes.setTypeParser(pgTypes.builtins.CHAR, (v) => v);
    //pgTypes.setTypeParser(pgTypes.builtins.TEXT, (v) => v);
    //pgTypes.setTypeParser(pgTypes.builtins.VARCHAR, (v) => v);
    //pgTypes.setTypeParser(pgTypes.builtins.UUID, (v) => v);
    //pgTypes.setTypeParser(pgTypes.builtins.FLOAT4, (v) => v === null ? null : Number.parseInt(v, 10));
    //pgTypes.setTypeParser(pgTypes.builtins.FLOAT8, (v) => v === null ? null : Number.parseInt(v, 10));
    //pgTypes.setTypeParser(pgTypes.builtins.DATE, (v) => Date.parse(v));
    //pgTypes.setTypeParser(pgTypes.builtins.TIMESTAMPTZ, (v) => Date.parse(v));
}
