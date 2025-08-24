package main

import (
	"bytes"
	_ "embed"
	"fmt"
	protocplugin "github.com/Jumpaku/protoc-plugin-lib"
	"google.golang.org/protobuf/types/pluginpb"
	"os"
	"text/template"
)

// go build -o bin/protoc-gen-cs-json ./cmd/protoc-gen-cs-json && buf build -o bufimage.txtpb && buf generate --include-imports --include-wkt bufimage.txtpb

func main() {
	err := protocplugin.Run(os.Stdin, os.Stdout, handle)
	if err != nil {
		panic(fmt.Sprintf("%+v", err))
	}
}

func handle(
	req *pluginpb.CodeGeneratorRequest,
	files map[string]*protocplugin.File,
) ([]*protocplugin.GeneratedFile, error) {
	out := []*protocplugin.GeneratedFile{}
	for _, f := range req.FileToGenerate {
		in := files[f]
		for _, message := range in.Messages {
			// Generate a file for each message
			out = append(out, handleMessage(message)...)
		}
		for _, enum := range in.Enums {
			// Generate a file for each enum
			out = append(out, handleEnum(enum)...)
		}
		for _, service := range in.Services {
			// Generate a file for each service
			out = append(out, handleService(service)...)
		}
	}

	return out, nil
}

//go:embed message_class.cs.tpl
var messageClassCsTpl string
var messageClassCsTplExecutor = template.Must(template.New("message_class.cs.tpl").Parse(messageClassCsTpl))

func handleMessage(v *protocplugin.Message) (out []*protocplugin.GeneratedFile) {
	messageClassData := MessageClassData{
		SourceFile:     v.Desc.ParentFile().Path(),
		SourceFullName: string(v.Desc.FullName()),
		Namespace:      MessageClassNamespace(v.Desc),
		ClassName:      MessageClassName(v.Desc),
	}
	for _, f := range v.Fields {
		messageClassData.Fields = append(messageClassData.Fields, ClassField{
			FieldName: MessageClassFieldName(f.Desc),
			FieldType: MessageClassFieldType(f.Desc),
		})
	}
	{
		content := bytes.NewBuffer(nil)
		if err := messageClassCsTplExecutor.Execute(content, messageClassData); err != nil {
			panic(fmt.Sprintf("failed to execute template: %+v", err))
		}
		out = append(out, &protocplugin.GeneratedFile{
			Name:    messageClassData.Namespace.FilePath(messageClassData.ClassName + "_message.cs"),
			Content: content.String(),
		})
	}
	for _, message := range v.Messages {
		out = append(out, handleMessage(message)...)
	}
	for _, enum := range v.Enums {
		out = append(out, handleEnum(enum)...)
	}
	return out
}

//go:embed enum_class.cs.tpl
var enumCsTpl string
var enumCsTplExecutor = template.Must(template.New("enum_class.cs.tpl").Parse(enumCsTpl))

func handleEnum(v *protocplugin.Enum) (out []*protocplugin.GeneratedFile) {
	enumData := EnumClassData{
		SourceFile:     v.Desc.ParentFile().Path(),
		SourceFullName: string(v.Desc.FullName()),
		Namespace:      EnumClassNamespace(v.Desc),
		ClassName:      EnumClassName(v.Desc),
	}
	for _, v := range v.Values {
		enumData.Values = append(enumData.Values, EnumValue{
			ValueName:   EnumClassValueName(v.Desc),
			ValueString: EnumClassValueString(v.Desc),
			ValueNumber: EnumClassValueNumber(v.Desc),
		})
	}
	{
		content := bytes.NewBuffer(nil)
		if err := enumCsTplExecutor.Execute(content, enumData); err != nil {
			panic(fmt.Sprintf("failed to execute template: %+v", err))
		}
		out = append(out, &protocplugin.GeneratedFile{
			Name:    enumData.Namespace.FilePath(enumData.ClassName + "_enum.cs"),
			Content: content.String(),
		})
	}
	return out
}

func handleService(v *protocplugin.Service) (out []*protocplugin.GeneratedFile) {
	for _, method := range v.Methods {
		out = append(out, handleMethod(method)...)
	}
	return out

}

//go:embed rpc_class.cs.tpl
var rpcClassCsTpl string
var rpcClassCsTplExecutor = template.Must(template.New("rpc_class.cs.tpl").Parse(rpcClassCsTpl))

func handleMethod(v *protocplugin.Method) (out []*protocplugin.GeneratedFile) {
	rpcClassData := RpcClassData{
		SourceFile:     v.Desc.ParentFile().Path(),
		SourceFullName: string(v.Desc.FullName()),
		Namespace:      RpcClassNamespace(v.Desc),
		ClassName:      RpcClassName(v.Desc),
		MethodName:     RpcClassMethodName(v.Desc),
		Input:          MessageClassRef(v.Desc.Input()),
		Output:         MessageClassRef(v.Desc.Output()),
		HttpInfo:       RpcClassHttpInfo(v.Desc.Input(), v.Options.Http),
	}
	{
		content := bytes.NewBuffer(nil)
		if err := rpcClassCsTplExecutor.Execute(content, rpcClassData); err != nil {
			panic(fmt.Sprintf("failed to execute template: %+v", err))
		}
		out = append(out, &protocplugin.GeneratedFile{
			Name:    rpcClassData.Namespace.FilePath(rpcClassData.ClassName + "_" + rpcClassData.MethodName + "_rpc.cs"),
			Content: content.String(),
		})
	}
	return out
}
