package csv_data

import (
	"encoding/csv"
	"fmt"
	"github.com/samber/lo"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var placeholderNamePattern = regexp.MustCompile(`^\[.*](\.(csv|tsv))?$`)
var extPattern = regexp.MustCompile(`\.(csv|tsv)?$`)

// FindFiles finds CSV files that match to the tableName.
func FindFiles(tableNames []string, dir string) (map[string][]string, error) {
	out := lo.SliceToMap(tableNames, func(tableName string) (string, []string) {
		return tableName, []string{}
	})

	lowerTableNames := lo.SliceToMap(tableNames, func(t string) (string, string) {
		return strings.ToLower(t), t
	})

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		absDir, err := filepath.Abs(dir)
		if err != nil {
			return fmt.Errorf("failed to extract absolute path: %s: %w", dir, err)
		}
		absPath, err := filepath.Abs(path)
		if err != nil {
			return fmt.Errorf("failed to extract absolute path: %s: %w", path, err)
		}

		pathComponents := strings.Split(strings.TrimPrefix(filepath.Clean(absPath), filepath.Clean(absDir)), "/")[1:]

		words := []string{}
		for i, c := range pathComponents {
			if p := placeholderNamePattern; p.MatchString(c) || (i > 0 && p.MatchString(pathComponents[i-1])) {
				continue
			}
			words = append(words, c)
		}

		join := extPattern.ReplaceAllString(strings.ToLower(strings.Join(words, "")), "")
		if tableName, ok := lowerTableNames[join]; ok {
			out[tableName] = append(out[tableName], path)
		}

		return nil
	})
	if err != nil {
		return nil, fmt.Errorf("failed to walk directory: %s: %w", dir, err)
	}

	return out, nil
}

// ReadRecords reads CSV records from the file and returns the headers and records.
func ReadRecords(file string) (headers []string, records [][]string, err error) {
	pathComponents := filepath.SplitList(file)
	pathFields := []string{}
	for i, c := range pathComponents {
		if p := placeholderNamePattern; i > 0 && p.MatchString(pathComponents[i-1]) {
			headers = append(headers, pathComponents[i-1])
			pathFields = append(pathFields, extPattern.ReplaceAllString(c, ""))
		}
	}

	f, err := os.Open(file)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to open file: %s: %w", file, err)
	}
	defer f.Close()

	reader := csv.NewReader(f)
	if strings.HasSuffix(file, ".tsv") {
		reader.Comma = '\t'
	}

	hs, err := reader.Read()
	if err != nil {
		return nil, nil, fmt.Errorf("failed to read header line: %s: %w", file, err)
	}
	headers = append(headers, hs...)

	records, err = reader.ReadAll()
	if err != nil {
		return nil, nil, fmt.Errorf("failed to read records: %s: %w", file, err)
	}
	for i, record := range records {
		records[i] = append(pathFields, record...)
	}

	return headers, records, nil
}
