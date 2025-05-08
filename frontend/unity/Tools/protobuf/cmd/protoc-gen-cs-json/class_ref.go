package main

import "google.golang.org/protobuf/reflect/protoreflect"

func MessageClassRef(m protoreflect.MessageDescriptor) ClassRef {
	return ClassRef{
		Namespace: MessageClassNamespace(m),
		ClassName: MessageClassName(m),
	}
}

type ClassRef struct {
	Namespace Namespace
	ClassName string
}
