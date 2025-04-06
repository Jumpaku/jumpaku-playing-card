import {Injectable} from "@nestjs/common";
import {pbkdf2Sync} from "node:crypto";
import {PgClient} from "../../../../../global/postgres.provider";
import {AuthenticationPassword$} from "../../../../../../gen/pg/dao/dao_AuthenticationPassword";
import {AuthenticationPasswordRepository} from "./authentication_password.repository";

@Injectable()
export class AuthenticationPasswordProvider {
    constructor(private readonly authenticationRepository: AuthenticationPasswordRepository) {
    }

    async exists(tx: PgClient, loginId: string): Promise<boolean> {
        const found = this.authenticationRepository.findByLoginId(tx, loginId);
        return found != null;
    }

    async register(tx: PgClient, timestamp: Date, authenticationId: string, loginId: string, salt: string, password: string): Promise<void> {
        const hash = this.hash(password, salt);
        await this.authenticationRepository.create(tx, timestamp, authenticationId, loginId, salt, hash);
    }

    async verify(tx: PgClient, loginId: string, password: string): Promise<AuthenticationPassword$ | null> {
        const ap = await this.authenticationRepository.findByLoginId(tx, loginId);
        if (ap == null) {
            return null;
        }
        if (ap.password_hash !== this.hash(password, ap.password_salt)) {
            return null;
        }

        return ap;
    }

    private hash(password: string, salt: string): string {
        const h = pbkdf2Sync(password, salt, 10000, 64, 'sha512');
        return h.toString('hex');
    }

}