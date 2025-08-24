import { IPayload } from "../../@types/default";
import bcrypt from 'bcryptjs'
import { UserModel } from "../../schema/user/user.schema";
import { EnumUser } from "../../Common/shared/enum/user.enum";
import ServerError from "../../utils/server.error.utils";
import { pendingToken } from "../../utils/JWT/pending.token.jwt";

export class authService {

    public async registerService (payload: IPayload) {
        const cUser = await UserModel.findOne({status: EnumUser.live, email: payload.email.toLowerCase()}, {_id: 1})

        if(cUser){
            throw new ServerError("Email is already exists, try another email.", 409)
        }
        payload.password = await this.hashPassword(payload.password)
        payload.phone = this.normalizePhone(payload.phone)
        const username = `${payload.fName.toLowerCase()}_${payload.lName.toLowerCase()}${Math.floor(Math.random() * 1000)}`

        const user = await UserModel.create({
            username: username,
            ...payload
        })

        const token = pendingToken(String(user._id))
        return{success: true, token}
    }

    public async loginService () {

    }

    private async hashPassword (payload: string) {
        const salt = await bcrypt.genSalt(10)
        const newPassword = await bcrypt.hash(payload, salt)

        return newPassword
    }
     private normalizePhone(phone: string): string {
          let normalized = phone.replace(/\D/g, '');

          if (normalized.startsWith('0')) {
               normalized = normalized.slice(1);
          }

          if (!normalized.startsWith('0')) {
               normalized = '0' + normalized;
          }

          return normalized;
     }
}