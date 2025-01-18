#!/bin/sh

set -eux

(
  set -eux
  cd protobuf
  buf build --output bufimage.txtpb
  buf generate -v bufimage.txtpb
)
