export interface Article {
    pagina: number,
    tamanho: number,
    totalRegistros: number,
    totalPaginas: number,
    itens: ArticleItem[]
}

export interface ArticleItem {
    id: string,
    titulo: string,
    resumo: string,
    imagemCapa: string,
    imagem: string,
    data: string,
    autorId: string,
    autor: string,
    ativo: boolean,
    itens: ArticleItemType[]
}

export interface ArticleItemType {
    tipo: number,
    texto: string,
    imagem: string
}

export interface AutorItem {
    id: string,
    nome: string,
    avatar: string
}

export interface Autor {
    data: AutorItem[],
    notifications: [],
    valid: boolean,
    invalid: boolean,
    message: string
}