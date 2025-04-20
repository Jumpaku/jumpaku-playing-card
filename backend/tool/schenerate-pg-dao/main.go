package main

import (
	"context"
	_ "embed"
	"fmt"
	"github.com/Jumpaku/schenerate/files"
	"github.com/Jumpaku/schenerate/postgres"
	"github.com/samber/lo"
	"os"
	"path/filepath"
	"strings"
	"text/template"
)

func main() {
	if len(os.Args) != 3 {
		panic("usage: schenerate <postgres-connection-string> <output-dir>")
	}
	postgresConnectionString := os.Args[1]
	outputDir := os.Args[2]
	ctx := context.Background()
	q, err := postgres.Open(postgresConnectionString)
	if err != nil {
		panic(fmt.Sprintf("%+v", err))
	}
	defer q.Close()

	tables, err := postgres.ListTables(ctx, q)
	if err != nil {
		panic(fmt.Sprintf("%+v", err))
	}

	err = postgres.GenerateWithSchema(ctx, q,
		lo.Map(tables, func(t postgres.Table, _ int) string { return t.Name }),
		func(out *files.Writer, schemas postgres.Schemas) error {
			return generateDAOs(out, schemas, outputDir)
		},
	)
	if err != nil {
		panic(err)
	}
}

//go:embed dao.ts.tpl
var daoTsTpl string
var executorDaoTs = template.Must(template.New("dao.ts").Parse(daoTsTpl))

type TsColumn struct {
	Name     string
	TsType   string
	Nullable bool
}
type Index struct {
	Name string
	Keys []TsColumn
}
type Unique struct {
    Name string
    Keys []TsColumn
}
type DAOData struct {
	Name       string
	Columns    []TsColumn
	PrimaryKey []TsColumn
	Unique  []Unique
	Index      []Index
}

func (d DAOData) NonKeyColumns() []TsColumn {
	return lo.Filter(d.Columns, func(c TsColumn, _ int) bool {
		return !lo.ContainsBy(d.PrimaryKey, func(k TsColumn) bool {
			return k.Name == c.Name
		})
	})
}

func tsType(c postgres.Column) string {
	orNull := ""
	if c.Nullable {
		orNull = " | null"
	}
	dbType := strings.ToLower(c.Type)
	switch {
	case dbType == "boolean":
		return "boolean" + orNull
	case lo.Contains([]string{"smallint", "integer", "bigint", "smallserial", "serial", "bigserial", "int", "int2", "int4", "int8", "serial2", "serial4", "serial8"}, dbType):
		return "bigint" + orNull
	case lo.ContainsBy([]string{"real", "double precision", "float", "float4", "float8"}, func(t string) bool {
		return strings.Contains(dbType, t)
	}):
		return "number" + orNull
	case lo.ContainsBy([]string{"varchar", "character", "char", "bpchar", "text"}, func(t string) bool {
		return strings.Contains(dbType, t)
	}):
		return "string" + orNull
	case lo.ContainsBy([]string{"timestamp", "date"}, func(t string) bool {
		return strings.Contains(dbType, t)
	}):
		return "Date" + orNull
	default:
		return "unknown"
	}
}
func generateDAOs(w *files.Writer, schemas postgres.Schemas, outputDir string) error {
	{
		w.Add(filepath.Join(outputDir, "pg_type_parsers.ts"))
		_, err := fmt.Fprintf(w, `
import {types as pgTypes} from "pg";
export function setTypeParsers() {
    pgTypes.setTypeParser(pgTypes.builtins.BOOL, (v) => v === null ? null : v === '"true"');
    //pgTypes.setTypeParser(pgTypes.builtins.BIT, (v) => v === null ? null : v);
    //pgTypes.setTypeParser(pgTypes.builtins.VARBIT, (v) => v);
    pgTypes.setTypeParser(pgTypes.builtins.INT2, (v) => v === null ? null : BigInt(v));
    pgTypes.setTypeParser(pgTypes.builtins.INT4, (v) => v === null ? null : BigInt(v));
    pgTypes.setTypeParser(pgTypes.builtins.INT8, (v) => v === null ? null : BigInt(v));
    //pgTypes.setTypeParser(pgTypes.builtins.BYTEA, (v) => v);
    pgTypes.setTypeParser(pgTypes.builtins.CHAR, (v) => v);
    pgTypes.setTypeParser(pgTypes.builtins.TEXT, (v) => v);
    pgTypes.setTypeParser(pgTypes.builtins.VARCHAR, (v) => v);
    pgTypes.setTypeParser(pgTypes.builtins.UUID, (v) => v);
    pgTypes.setTypeParser(pgTypes.builtins.FLOAT4, (v) => v === null ? null : Number.parseInt(v, 10));
    pgTypes.setTypeParser(pgTypes.builtins.FLOAT8, (v) => v === null ? null : Number.parseInt(v, 10));
    pgTypes.setTypeParser(pgTypes.builtins.DATE, (v) => Date.parse(v));
    pgTypes.setTypeParser(pgTypes.builtins.TIMESTAMPTZ, (v) => Date.parse(v));
}
`)
		if err != nil {
			panic(fmt.Sprintf("%+v", err))
		}
	}
	for _, schema := range schemas {
		w.Add(filepath.Join(outputDir, "dao_" + schema.Name + ".ts"))
		colMap := lo.SliceToMap(schema.Columns, func(c postgres.Column) (string, postgres.Column) {
			return c.Name, c
		})
		data := DAOData{
			Name: schema.Name,
			Columns: lo.Map(schema.Columns, func(c postgres.Column, _ int) TsColumn {
				return TsColumn{
					Name:     c.Name,
					TsType:   tsType(colMap[c.Name]),
					Nullable: c.Nullable,
				}
			}),
			PrimaryKey: lo.Map(schema.PrimaryKey, func(k string, _ int) TsColumn {
				return TsColumn{
					Name:     k,
					TsType:   tsType(colMap[k]),
					Nullable: colMap[k].Nullable,
				}
			}),
            Unique: lo.Map(schema.UniqueKeys, func(u postgres.UniqueKey, _ int) Unique {
                return Unique{
                    Name: u.Name,
                    Keys: lo.Map(u.Key, func(k string, _ int) TsColumn {
                        return TsColumn{
                            Name:     k,
                            TsType:   tsType(colMap[k]),
                            Nullable: colMap[k].Nullable,
                        }
                    }),
                }
            }),
			Index: lo.Map(schema.Indexes, func(i postgres.Index, _ int) Index {
				return Index{
					Name: i.Name,
					Keys: lo.Map(i.Key, func(k string, _ int) TsColumn {
						return TsColumn{
							Name:     k,
							TsType:   tsType(colMap[k]),
							Nullable: colMap[k].Nullable,
						}
					}),
				}
			}),
		}

		err := executorDaoTs.Execute(w, data)
		if err != nil {
			panic(fmt.Sprintf("%+v", err))
		}
	}
	return nil
}
