import jwt from 'jsonwebtoken'

const refreshToken_KEY = process.env.REFRESH_TOKEN_KEY as string

export const refreshToken = (id: string) => {
     jwt.sign({ _id: id }, refreshToken_KEY, { expiresIn: "30D" })
     return
}
