package main

import (
	"fmt"
	"github.com/Jumpaku/jumpaku-playing-card/tree/main/frontend/unity/Tools/protobuf/name"
	"github.com/samber/lo"
	"google.golang.org/protobuf/reflect/protoreflect"
	"strings"
)

func EnumClassNamespace(e protoreflect.EnumDescriptor) Namespace {
	return lo.Map(strings.Split(string(e.FullName().Parent()), "."), func(n string, _ int) string {
		return name.New(n).UpperCamel() + "_PB"
	})
}
func EnumClassName(e protoreflect.EnumDescriptor) string {
	return name.New(string(e.FullName().Name())).UpperCamel()
}
func EnumClassValueName(e protoreflect.EnumValueDescriptor) string {
	return name.New(string(e.FullName().Name())).UpperCamel()
}
func EnumClassValueString(e protoreflect.EnumValueDescriptor) string {
	return fmt.Sprintf(`"%s"`, e.FullName().Name())
}
func EnumClassValueNumber(e protoreflect.EnumValueDescriptor) int64 {
	return int64(e.Number())
}

type EnumClassData struct {
	SourceFile     string
	SourceFullName string
	Namespace      Namespace
	ClassName      string
	Values         []EnumValue
}
type EnumValue struct {
	ValueName   string
	ValueString string
	ValueNumber int64
}
