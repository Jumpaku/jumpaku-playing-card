package main

import (
	"fmt"
	"github.com/Jumpaku/jumpaku-playing-card/tree/main/frontend/unity/Tools/protobuf/name"
	"github.com/samber/lo"
	"google.golang.org/protobuf/reflect/protoreflect"
	"strings"
)

func MessageClassFieldName(f protoreflect.FieldDescriptor) string {
	return f.JSONName()
}
func MessageClassFieldType(f protoreflect.FieldDescriptor) CsharpType {
	var (
		isList       = f.Cardinality() == protoreflect.Repeated
		typeName     string
		using        []Namespace
		isBase64     bool
		isTimestamp  bool
		enumTypeName string
	)
	switch f.Kind() {
	case protoreflect.BoolKind:
		typeName = "bool"
	case protoreflect.Int32Kind,
		protoreflect.Int64Kind,
		protoreflect.Sint32Kind,
		protoreflect.Sint64Kind,
		protoreflect.Fixed32Kind,
		protoreflect.Fixed64Kind,
		protoreflect.Sfixed32Kind,
		protoreflect.Sfixed64Kind:
		typeName = "long"
	case protoreflect.Uint32Kind, protoreflect.Uint64Kind:
		typeName = "ulong"
	case protoreflect.FloatKind, protoreflect.DoubleKind:
		typeName = "double"
	case protoreflect.StringKind:
		typeName = "string"
	case protoreflect.BytesKind:
		typeName = "string"
	case protoreflect.EnumKind:
		typeName = "string"
		if !isList {
			using = append(using, EnumClassNamespace(f.Enum()))
			enumTypeName = "global::" + EnumClassNamespace(f.Enum()).Join() + "." + EnumClassName(f.Enum())
		}
	case protoreflect.MessageKind:
		switch f.Message().FullName() {
		case "google.protobuf.Int32Value", "google.protobuf.Int64Value":
			typeName = "long"
		case "google.protobuf.UInt32Value", "google.protobuf.UInt64Value":
			typeName = "long"
		case "google.protobuf.DoubleValue", "google.protobuf.FloatValue":
			typeName = "double"
		case "google.protobuf.StringValue":
			typeName = "string"
		case "google.protobuf.Timestamp":
			typeName = "string"
			using = append(using, Namespace{"System"})
			isTimestamp = true
		case "google.protobuf.BytesValue":
			typeName = "string"
			using = append(using, Namespace{"System"})
			isBase64 = true
		default:
			typeName = "global::" + MessageClassNamespace(f.Message()).Join() + "." + MessageClassName(f.Message())
			using = append(using, MessageClassNamespace(f.Message()))
		}
	default:
		panic(fmt.Sprintf("unexpected kind %v in %v", f.Kind(), f.FullName()))
	}
	if isList {
		using = append(using, Namespace{"System", "Collections", "Generic"})
		typeName = fmt.Sprintf("global::System.Collections.Generic.List<%s>", typeName)
	}
	return CsharpType{
		Type:         typeName,
		IsBase64:     isBase64,
		IsTimestamp:  isTimestamp,
		EnumTypeName: enumTypeName,
	}
}
func MessageClassName(m protoreflect.MessageDescriptor) string {
	return name.New(string(m.FullName().Name())).UpperCamel()
}
func MessageClassNamespace(m protoreflect.MessageDescriptor) Namespace {
	return lo.Map(strings.Split(string(m.FullName().Parent()), "."), func(n string, _ int) string {
		return name.New(n).UpperCamel() + "_PB"
	})
}

type MessageClassData struct {
	SourceFile     string
	SourceFullName string
	Namespace      Namespace
	ClassName      string
	Fields         []ClassField
}
type ClassField struct {
	FieldName string
	FieldType CsharpType
}
type CsharpType struct {
	Using        []Namespace
	Type         string
	IsBase64     bool
	IsTimestamp  bool
	EnumTypeName string
}
