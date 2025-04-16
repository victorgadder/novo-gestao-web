export interface Signin {
    email: string,
    senha: string,
    usuario: UserInfo
}

export interface UserInfo {
    usuarioId: string,
    email: string,
    nome: string,
    avatar: string
}

export interface RefreshToken {
    accessToken: string,
    refreshToken: string
}