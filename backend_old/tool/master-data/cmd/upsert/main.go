package main

import (
	"context"
	_ "embed"
	"fmt"
	"github.com/Jumpaku/jumpaku-playing-card/backend/tool/master-data/csv_data"
	"github.com/Jumpaku/jumpaku-playing-card/backend/tool/master-data/pg_type"
	"github.com/Jumpaku/schenerate/files"
	"github.com/Jumpaku/schenerate/postgres"
	"github.com/samber/lo"
	"os"
	"path/filepath"
	"strings"
	"text/template"
)

func main() {
	if len(os.Args) != 4 {
		panic("usage: schenerate <postgres-connection-string> <master-data-dir> <output-dir>")
	}
	postgresConnectionString := os.Args[1]
	masterDataDir := os.Args[2]
	outputDir := os.Args[3]

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

	masterTableNames := lo.Map(tables, func(t postgres.Table, _ int) string { return t.Name })
	masterTableNames = lo.Filter(masterTableNames, func(t string, _ int) bool {
		return strings.HasPrefix(t, "Master")
	})

	csvFiles, err := csv_data.FindFiles(masterTableNames, masterDataDir)
	if err != nil {
		panic(fmt.Sprintf("%+v", err))
	}

	masterData := map[string]*csv_data.MasterDataTable{}
	for tableName, csvFile := range csvFiles {
		for _, f := range csvFile {
			h, r, err := csv_data.ReadRecords(f)
			if err != nil {
				panic(fmt.Sprintf("%+v", err))
			}

			m, ok := masterData[tableName]
			if !ok {
				m = &csv_data.MasterDataTable{Name: tableName, Headers: h}
			}
			m.Records = append(m.Records, r...)
			masterData[tableName] = m
		}
	}

	err = postgres.GenerateWithSchema(ctx, q,
		masterTableNames,
		func(out *files.Writer, schemas postgres.Schemas) error {
			return generateSQL(out, schemas, masterData, outputDir)
		},
	)
	if err != nil {
		panic(err)
	}
}

func generateSQL(w *files.Writer, schemas postgres.Schemas, masterData map[string]*csv_data.MasterDataTable, outputDir string) error {
	for _, schema := range schemas {
		w.Add(filepath.Join(outputDir, "upsert_"+schema.Name+".sql"))
		data := UpsertData{
			TableName:  schema.Name,
			Columns:    schema.Columns,
			PrimaryKey: schema.PrimaryKey,
			NonPrimaryKey: lo.FilterMap(schema.Columns, func(c postgres.Column, _ int) (string, bool) {
				return c.Name, !lo.Contains(schema.PrimaryKey, c.Name)
			}),
			MasterData: masterData[schema.Name],
		}

		if err := executorMasterDataUpsertSql.Execute(w, data); err != nil {
			panic(fmt.Sprintf("%+v", err))
		}
	}
	return nil
}

//go:embed master-data-upsert.sql.tpl
var masterDataUpsertSqlTpl string
var executorMasterDataUpsertSql = template.Must(template.New("master-data-upsert.sql").Parse(masterDataUpsertSqlTpl))

type UpsertData struct {
	TableName     string
	Columns       []postgres.Column
	PrimaryKey    []string
	NonPrimaryKey []string
	MasterData    *csv_data.MasterDataTable
}

func (d UpsertData) DataExists() bool {
	return d.MasterData != nil && len(d.MasterData.Records) > 0
}
func (d UpsertData) FieldLiterals() (literals [][]string) {
	headerIndex := map[string]int{}
	for i, h := range d.MasterData.Headers {
		headerIndex[h] = i
	}
	for _, record := range d.MasterData.Records {
		ls := []string{}
		for _, column := range d.Columns {
			idx, ok := headerIndex[column.Name]
			if !ok {
				panic(fmt.Sprintf("column %s not found: table %s", column.Name, d.MasterData.Name))
			}
			ls = append(ls, pg_type.ToLiteral(column, record[idx]))
		}
		literals = append(literals, ls)
	}
	return literals
}
