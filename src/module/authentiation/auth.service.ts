import { IPayload } from "../../@types/default";
import bcrypt from 'bcryptjs'
import { UserModel } from "../../schema/user/user.schema";
import { EnumUser } from "../../Common/shared/enum/user.enum";
import ServerError from "../../utils/server.error.utils";
import { pendingToken } from "../../utils/JWT/pending.token.jwt";
import { accessToken } from "../../utils/JWT/access.toke.jwt";
import { refreshToken } from "../../utils/JWT/refrsh.token.jwt";
import querystring from 'querystring'
import axios from "axios";

export class authService {

    private FACEBOOK_CLIENT_ID: string
    private FACEBOOK_CLIENT_SECRET: string
    private GOOGLE_CLIENT_ID: string
    private GOOGLE_CLIENT_SECRET: string
    private BACKEND_API: string
    private REDIRECT_URL_FACEBOOK: string
    private REDIRECT_URL_GOOGLE: string

    constructor(){
        this.FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID as string
        this.FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET as string
        this.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
        this.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string
        this.BACKEND_API = process.env.BACKEND_API as string
        this.REDIRECT_URL_FACEBOOK = 'api/auth/facebook/callback' as string
        this.REDIRECT_URL_GOOGLE = 'api/auth/google/callback' as string
    }

    public async registerService (payload: IPayload) {
        const cUser = await UserModel.findOne({status: EnumUser.live, email: payload.email.toLowerCase()}, {_id: 1})

        if(cUser){
            throw new ServerError("Email is already exists, try another email.", 409)
        }
        payload.password = await this.hashPassword(payload.password)
        payload.phone = this.normalizePhone(payload.phone)
        payload.email = payload.email.toLowerCase()
        const username = `${payload.fName.toLowerCase()}_${payload.lName.toLowerCase()}${Math.floor(Math.random() * 1000)}`

        const user = await UserModel.create({
            username: username,
            ...payload
        })

        const token = pendingToken(String(user._id))
        return{success: true, token}
    }

    public async loginService (payload: IPayload) {
        const cUser = await UserModel.findOne({status: EnumUser.live, email:payload.email.toLowerCase() }, {password: 1, tokenVersion: 1})

        if(!cUser){
            throw new ServerError("This Email is not exist, try agin please", 400)
        }

        const cPassword = await bcrypt.compare(payload.password, cUser.password)
        if(!cPassword){
            throw new ServerError("This password not same", 400)
        }

        const token = accessToken(String(cUser._id))
        const refresh_Token = refreshToken(String(cUser._id))
        return{success: true, token, refresh_Token}
    }

    public googleAuthLinkService() {
          return this.getGoogle_URL()
    }
    
    public async googleCallBackService(payload: any) {
          const code = payload.code;

          const { id_token, access_token } = await this.googleToken(
               code,
               this.GOOGLE_CLIENT_ID,
               this.GOOGLE_CLIENT_SECRET,
               `${this.BACKEND_API}/api/v1/auth/google/callback`
          );

          const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
               headers: {
                    Authorization: `Bearer ${id_token}`,
               },
          }).then((res) => res.data).catch((error) => {
               console.error("Failed to fetch user");
               throw new Error(error.message);
          });
          const cUser = await UserModel.findOne({ status: EnumUser.live, email: googleUser.email.toLowerCase() }, { _id: 1, tokenVersion: 1 })
          if (cUser) {
               const token = accessToken(cUser.id);
               const refresh = refreshToken(cUser.id);
               return { token, refresh }
          }

          const outputString = googleUser.name.replace(/\s/g, "-");
          const finalName = outputString + Math.floor(Math.random() * 10000001);

          const password = googleUser.name + googleUser.id + googleUser.email + googleUser.given_name + googleUser.family_name;

          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);


          const nameArray = googleUser.name.split(' ')
          const firstName = nameArray[0]
          const lastName = nameArray[nameArray.length - 1]

          const newUser = new UserModel({
               fName: firstName,
               lName: lastName,
               status: EnumUser.live,
               email: googleUser.email,
               password: hash,
               username: finalName,
               googleId: googleUser.id,
               avatar: googleUser.picture,
               Verified: true,
          });
          const token = accessToken(newUser.id);
          const refresh = refreshToken(newUser.id);
          return { token, refresh }
     }

    public facebookAuthLinkService() {
         return this.getFacebookAuthURL()
    }

     public async facebookCallBackService(payload: any) {
          const code = payload.code;

          const { id_token, access_token } = await this.googleToken(
               code,
               this.GOOGLE_CLIENT_ID,
               this.GOOGLE_CLIENT_SECRET,
               `${this.BACKEND_API}/api/v1/auth/google/callback`
          );

          const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
               headers: {
                    Authorization: `Bearer ${id_token}`,
               },
          }).then((res) => res.data).catch((error) => {
               console.error("Failed to fetch user");
               throw new Error(error.message);
          });
          const cUser = await UserModel.findOne({ status: EnumUser.live, email: googleUser.email.toLowerCase() }, { _id: 1, tokenVersion: 1 })
          if (cUser) {
               const token = accessToken(cUser.id);
               const refresh = refreshToken(cUser.id);
               return { token, refresh }
          }
          const outputString = googleUser.name.replace(/\s/g, "-");
          const finalName = outputString + Math.floor(Math.random() * 10000001);

          const password = googleUser.name + googleUser.id + googleUser.email + googleUser.given_name + googleUser.family_name;

          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);


          const nameArray = googleUser.name.split(' ')
          const firstName = nameArray[0]
          const lastName = nameArray[nameArray.length - 1]

          const newUser = new UserModel({
               fName: firstName,
               lName: lastName,
               status: EnumUser.live,
               email: googleUser.email,
               password: hash,
               username: finalName,
               googleId: googleUser.id,
               avatar: googleUser.picture,
               Verified: true,
          });
          const token = accessToken(newUser.id);
          const refresh = refreshToken(newUser.id);
          return { token, refresh }
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

     private getGoogle_URL () {
            const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
            const options = {
                redirect_uri: this.REDIRECT_URL_GOOGLE,
                client_id: this.GOOGLE_CLIENT_ID,
                access_type: "offline",
                response_type: "code",
                prompt: "consent",
                scope: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email',
               ].join(' '),
            }

            return `${rootUrl}?${querystring.stringify(options)}`
        }

        private getFacebookAuthURL() {
            const rootUrl = "https://www.facebook.com/v13.0/dialog/oauth";
            const options = {
              client_id: this.FACEBOOK_CLIENT_ID,
              redirect_uri: `${this.BACKEND_API}/${this.REDIRECT_URL_FACEBOOK}`,
              state: "{st=state123abc,ds=123456789}",
              scope: ["email", "public_profile"].join(","),
              response_type: "code",
            };

            return `${rootUrl}?${querystring.stringify(options)}`;
        }

        private async getFacebookTokens(code: any, clientId: any, clientSecret: any, redirectUri: any) {
            const url = "https://graph.facebook.com/v13.0/oauth/access_token";
            const values = {
              code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri,
            };

            try {
              const res = await axios.get(url, { params: values });
              return res.data;
            } catch (error: any) {
              console.error("Failed to fetch auth tokens");
              throw new Error(error.message);
            }
        }

        private async googleToken (code: any, clientID: any, clientSecret: any, redirect_uri:any){
            const url = 'https://oauth2.googleapis.com/token'
            const value = {
                code,
                client_id: clientID,
                client_secret: clientSecret,
                redirect_uri,
                grant_type: 'authorization_code',
            }
            return axios.post(url, querystring.stringify(value), {
               headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
               },
            }).then((res) => res.data).catch((error) => {
               console.error('Failed to fetch auth tokens')
               throw new Error(error.message)
            })
        }
}