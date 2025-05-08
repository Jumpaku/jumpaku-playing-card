package main

import (
	"fmt"
	"github.com/Jumpaku/jumpaku-playing-card/tree/main/frontend/unity/Tools/protobuf/name"
	protocplugin "github.com/Jumpaku/protoc-plugin-lib"
	"github.com/samber/lo"
	"google.golang.org/protobuf/reflect/protoreflect"
	"slices"
	"strings"
)

func RpcClassNamespace(m protoreflect.MethodDescriptor) Namespace {
	return lo.Map(strings.Split(string(m.FullName().Parent()), "."), func(n string, _ int) string {
		return name.New(n).UpperCamel() + "_PB"
	})
}
func RpcClassName(m protoreflect.MethodDescriptor) string {
	return name.New(string(m.Parent().FullName().Name())).UpperCamel()
}
func RpcClassMethodName(m protoreflect.MethodDescriptor) string {
	return name.New(string(m.FullName().Name())).UpperCamel()
}

func RpcClassHttpInfo(in protoreflect.MessageDescriptor, httpRule *protocplugin.HttpRule) HttpInfo {
	return HttpInfo{
		Input:    in,
		Method:   httpRule.Method(),
		HttpRule: httpRule.PathTemplate(),
	}
}

type RpcClassData struct {
	SourceFile     string
	SourceFullName string
	Namespace      Namespace
	ClassName      string
	MethodName     string
	Input          ClassRef
	Output         ClassRef
	HttpInfo       HttpInfo
}

type HttpInfo struct {
	Input    protoreflect.MessageDescriptor
	Method   string
	HttpRule *protocplugin.HttpRulePathTemplate
}

func (p HttpInfo) UrlPathTemplate(inputVariable string) string {
	segments := lo.Map(p.HttpRule.Segments, func(s *protocplugin.HttpRulePathTemplateSegment, _ int) string {
		if s.Variable == nil {
			return s.Value
		}
		variableFieldPath := lo.Map(s.Variable.FieldPath, func(f string, _ int) string {
			return name.New(f).LowerCamel()
		})
		return `{(global::UnityEngine.Networking.UnityWebRequest.EscapeURL(` + inputVariable + `?.` + strings.Join(variableFieldPath, "?.") + `))}`
	})
	return `$"/` + strings.Join(segments, "/") + `"`
}

func (p HttpInfo) UrlQueryTemplate(inputVariable string) string {
	if p.Method != "GET" {
		return `""`
	}
	fieldPaths := [][]string{}
	walkMessage([]string{}, p.Input, func(fp []string, m protoreflect.MessageDescriptor) {
		fs := m.Fields()
		for i := 0; i < fs.Len(); i++ {
			f := fs.Get(i)
			if isScalarField(f) {
				fieldPaths = append(fieldPaths, append(append([]string{}, fp...), f.JSONName()))
			}
		}
	})
	pathParamFieldPaths := lo.Map(p.HttpRule.Segments, func(s *protocplugin.HttpRulePathTemplateSegment, _ int) []string {
		if s.Variable == nil {
			return nil
		}
		return s.Variable.FieldPath
	})
	queryParamFieldPaths := lo.Filter(fieldPaths, func(queryParam []string, _ int) bool {
		return !lo.ContainsBy(pathParamFieldPaths, func(v []string) bool {
			pathParam := lo.Map(v, func(s string, _ int) string {
				return name.New(s).LowerCamel()
			})
			return slices.Equal(queryParam, pathParam)
		})
	})
	queries := lo.Map(queryParamFieldPaths, func(fp []string, _ int) string {
		key := strings.Join(fp, ".")
		value := inputVariable + `?.` + strings.Join(fp, "?.")
		return fmt.Sprintf(`{(%s == null ? "" : global::UnityEngine.Networking.UnityWebRequest.EscapeURL($"%s={%s}"))}`, value, key, value)
	})
	return `$"?` + strings.Join(queries, "&") + `"`
}
func walkMessage(fieldPath []string, m protoreflect.MessageDescriptor, fn func([]string, protoreflect.MessageDescriptor)) {
	fn(fieldPath, m)

	fs := m.Fields()
	for i := 0; i < fs.Len(); i++ {
		f := fs.Get(i)
		if !isScalarField(f) {
			fp := append(append([]string{}, fieldPath...), f.JSONName())
			walkMessage(fp, f.Message(), fn)
		}
	}
}

func isScalarField(f protoreflect.FieldDescriptor) bool {
	if f.Cardinality() == protoreflect.Repeated {
		return false
	}
	if f.Kind() == protoreflect.GroupKind {
		return false
	}
	if f.Kind() != protoreflect.MessageKind {
		return true
	}
	switch f.Message().FullName() {
	case "google.protobuf.Int32Value",
		"google.protobuf.Int64Value",
		"google.protobuf.UInt32Value",
		"google.protobuf.UInt64Value",
		"google.protobuf.DoubleValue",
		"google.protobuf.FloatValue",
		"google.protobuf.StringValue",
		"google.protobuf.Timestamp",
		"google.protobuf.BytesValue":
		return true
	default:
		return false
	}
}
