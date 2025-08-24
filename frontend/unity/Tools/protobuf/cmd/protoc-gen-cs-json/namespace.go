package main

import (
	"path/filepath"
	"strings"
)

type Namespace []string

func (n Namespace) FilePath(fileName string) string {
	return filepath.Join(append(append([]string{}, n...), fileName)...)
}

func (n Namespace) DirPath() string {
	return filepath.Join(n...)
}

func (n Namespace) Join() string {
	return strings.Join(n, ".")
}
