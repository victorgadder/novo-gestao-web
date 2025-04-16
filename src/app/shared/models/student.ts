export interface Student {
    pagina: number,
    tamanho: number,
    totalRegistros: number,
    totalPaginas: number,
    itens: StudentItem[]
}
export interface StudentItem{
    id: string,
    nome: string,
    cpf: string,
    dataNascimento: string,
    avatar: string,
    avatarBase64: string,
    linkedIn: string,
    telefone: string,
    email: string,
    conclusao: string,
    turmaId: string,
    cidadeId: string,
    cidade: string,
    estado: string,
    ativo: boolean,
}