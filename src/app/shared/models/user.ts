export interface User {
    id: string,
    nome: string,
    email: string,
    avatar: string,
    avatarBase64: string,
    ativo: boolean,
    bloqueado: boolean,
    tentativas: number,
    ultimaTentativa: string,
    ultimoLogin: string
}