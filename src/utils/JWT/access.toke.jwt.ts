import jwt from 'jsonwebtoken'

const accessToken_KEY = process.env.ACCESS_TOKEN_KEY as string

export const accessToken = (id: string) => {
     jwt.sign({ _id: id }, accessToken_KEY, { expiresIn: "1D" })
     return
}
