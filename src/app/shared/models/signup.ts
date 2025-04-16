export interface Signup {
    nome: string,
    email: string,
    avatar: string,
    ativo: boolean,
    bloqueado: boolean,
    tentativas: number,
    ultimaTentativa: string,
    ultimoLogin: string
}