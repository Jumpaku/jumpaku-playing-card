import {DescMethod, getExtension, hasExtension} from "@bufbuild/protobuf";
import {access_control, AccessControl} from "./gen/pb/api/v1/access_control_pb";

export function findAccessControl(method: DescMethod): AccessControl | null {
    const options = method.proto.options;
    if (options == null || !hasExtension(options, access_control)) {
        return null;
    }
    return getExtension(options, access_control);
}
