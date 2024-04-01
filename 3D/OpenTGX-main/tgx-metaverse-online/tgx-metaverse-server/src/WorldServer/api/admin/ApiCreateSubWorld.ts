import { ApiCall } from "tsrpc";
import { ReqCreateSubWorld, ResCreateSubWorld } from "../../../shared/protocols/worldServer/admin/PtlCreateSubWorld";
import { worldServer } from "../../../WorldServerMain";

export async function ApiCreateSubWorld(call: ApiCall<ReqCreateSubWorld, ResCreateSubWorld>) {
    let subWorld = worldServer.createSubWorld(call.req.subWorldId, call.req.subWorldName, call.req.subWorldConfigId);

    if(!subWorld){
        return call.error('INVALID_CONFIG_ID');
    }

    call.succ({
        subWorldId: subWorld.data.id
    });
}