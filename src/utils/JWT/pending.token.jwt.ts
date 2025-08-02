import jwt from 'jsonwebtoken'

const pendingToken_KEY = process.env.PENGING_TOKEN_KEY as string

export const pendingToken = (id: string) => {
     jwt.sign({ _id: id }, pendingToken_KEY, { expiresIn: "2H" })
     return
}
