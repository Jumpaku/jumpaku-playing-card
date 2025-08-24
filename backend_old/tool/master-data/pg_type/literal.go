package pg_type

import (
	"github.com/Jumpaku/schenerate/postgres"
	"github.com/samber/lo"
	"strings"
)

func ToLiteral(c postgres.Column, value string) string {
	dbType := strings.ToLower(c.Type)
	switch {
	default:
		panic("unknown column type")
	case dbType == "boolean":
		if c.Nullable && value == "" {
			return "NULL"
		}
		return lo.Ternary(value != "0", "TRUE", "FALSE")
	case lo.Contains([]string{"smallint", "integer", "bigint", "smallserial", "serial", "bigserial", "int", "int2", "int4", "int8", "serial2", "serial4", "serial8"}, dbType):
		if c.Nullable && value == "" {
			return "NULL"
		}
		return value
	case lo.ContainsBy([]string{"real", "double precision", "float", "float4", "float8"}, func(t string) bool { return strings.Contains(dbType, t) }):
		if c.Nullable && value == "" {
			return "NULL"
		}
		return value
	case lo.ContainsBy([]string{"varchar", "character", "char", "bpchar", "text"}, func(t string) bool { return strings.Contains(dbType, t) }):
		return "'" + strings.ReplaceAll(value, "'", "''") + "'"
	case lo.ContainsBy([]string{"timestamp", "date"}, func(t string) bool { return strings.Contains(dbType, t) }):
		if c.Nullable && value == "" {
			return "NULL"
		}
		return "'" + value + "'"
	}
}
