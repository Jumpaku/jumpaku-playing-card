import {Injectable} from "@nestjs/common";
import {PgClient} from "../../../../../global/postgres.provider";
import {AuthenticationTemporaryRepository} from "./authentication_temporary.repository";

@Injectable()
export class AuthenticationTemporaryProvider {
    constructor(private readonly temporaryRepository: AuthenticationTemporaryRepository) {
    }

    create(tx: PgClient, authenticationId: string, createTime: Date): Promise<void> {
        return this.temporaryRepository.create(tx, authenticationId, createTime);
    }
}