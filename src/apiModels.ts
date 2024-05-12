export enum KnownPlatforms {
    Local = 'Local',
    Other = 'Other',
    YouTube = 'YouTube',
}

type Platform = `${KnownPlatforms}` | string;

export interface AuthorSimpleDtoV1 {
    id: string,
    userName: string | null,
    displayName: string | null,
    platform: Platform,
    profileImages: ImageDtoV1[],
    idOnPlatform: string,
}

export interface ImageDtoV1 {
    id: string,
    platform: Platform,
    idOnPlatform: string | null,

    key: string | null,
    quality: string | null,
    ext: string | null,

    originalUrl: string | null,
    localUrl: string | null,
    localFilePath: string | null,
    url: string,

    width: number | null,
    height: number | null,
}

export interface TextTranslationDtoV1 {
    id: string,
    content: string,
    culture: string | null,

    validSince: string | null,
    validUntil: string | null,
}

export enum VideoSortingOptions {
    CreatedAt = 'CreatedAt',
    Duration = 'Duration',
}

export interface VideoSearchDtoV1 extends PaginationQuery {
    nameQuery: string | null,
    authorQuery: string | null,

    sortingOptions: VideoSortingOptions,
    descending: boolean,
}

export interface VideoSearchResponseDtoV1 {
    paginationResult: PaginationResultDtoV1,
    videos: VideoSimpleDtoV1[],
}

export interface VideoSimpleDtoV1 {
    id: string,
    title: TextTranslationDtoV1[],
    description: TextTranslationDtoV1[],

    thumbnail: ImageDtoV1[] | null,

    durationSeconds: number,

    platform: Platform,
    idOnPlatform: string,

    authors: AuthorSimpleDtoV1[],

    createdAt: string | null,
    publishedAt: string | null,
    addedToArchiveAt: string | null,

    externalUrl: string | null,
    embedUrl: string | null,
}

export interface PaginationQuery {
    page: number,
    limit: number,
}

export interface PaginationResultDtoV1 {
    page: number,
    limit: number,
    amountOnPage: number,
    totalResults: number | null,
}