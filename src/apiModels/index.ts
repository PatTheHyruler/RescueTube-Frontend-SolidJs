export enum KnownPlatforms {
    Local = 'Local',
    Other = 'Other',
    YouTube = 'YouTube',
}

export type Platform = `${KnownPlatforms}` | string;

export enum EntityTypes {
    Video = 'Video',
    Author = 'Author',
    Playlist = 'Playlist',
}

export type EntityType = `${EntityTypes}`;

export enum PrivacyStatuses {
    Public = 'Public',
    Unlisted = 'Unlisted',
    Private = 'Private',
    NeedsAuth = 'NeedsAuth',
    PremiumOnly = 'PremiumOnly',
    SubscriberOnly = 'SubscriberOnly',
}

export type PrivacyStatus = `${PrivacyStatuses}`;

export interface Fetchable {
    lastFetchUnofficial?: string,
    lastSuccessfulFetchUnofficial?: string,
    lastFetchOfficial?: string,
    lastSuccessfulFetchOfficial?: string,
}

export interface AuthorSimpleDtoV1 {
    id: string,
    userName: string | null,
    displayName: string | null,
    platform: Platform,
    profileImages: ImageDtoV1[],
    idOnPlatform: string,
    urlOnPlatform?: string,
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
    url: string | undefined,

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
    paginationResult: PaginationResult,
    videos: VideoSimpleDtoV1[],
}

export interface VideoSimpleDtoV1 {
    id: string,
    title: TextTranslationDtoV1[],
    description: TextTranslationDtoV1[],

    thumbnail: ImageDtoV1 | null,

    durationSeconds: number,

    platform: Platform,
    idOnPlatform: string,

    authors: AuthorSimpleDtoV1[],

    createdAt: string | null,
    publishedAt: string | null,
    addedToArchiveAt: string | null,

    externalUrl: string | null,
    embedUrl: string | null,

    lastCommentsFetch: string | null,
}

export interface PaginationBase {
    page: number,
    limit: number,
}

export interface PaginationQuery extends PaginationBase {
}

export interface PaginationResult {
    page: number,
    limit: number,
    amountOnPage: number,
    totalResults: number | null,
}

export interface LinkSubmissionRequestDtoV1 {
    url: string,
}

export interface LinkSubmissionResponseDtoV1 {
    submissionId: string,
    type: EntityType,
    platform: Platform,
    idOnPlatform: string,
}

export interface AccessTokenDtoV1 {
    token: string,
    expiresAt: string,
}

export interface CommentDtoV1 extends Fetchable {
    id: string,
    platform: Platform,
    idOnPlatform: string,

    privacyStatusOnPlatform?: PrivacyStatus,
    isAvailable: boolean,
    privacyStatus: PrivacyStatus,

    addedToArchiveAt: string,

    author: AuthorSimpleDtoV1,

    conversationReplies?: CommentDtoV1[],
    directReplies?: CommentDtoV1[],

    content?: string,

    createdAt?: string,
    updatedAt?: string,
    authorIsCreator?: boolean,

    createdAtVideoTimeSeconds: number,

    orderIndex: number,

    statistics?: CommentStatisticSnapshotDtoV1,

    videoId: string,
}

export interface CommentStatisticSnapshotDtoV1 {
    likeCount?: number,
    dislikeCount?: number,
    replyCount?: number,
    isFavorited?: number,

    validAt?: string,
}

export interface CommentRootsResponseDtoV1 {
    comments: CommentDtoV1[],
    paginationResult: PaginationResult,
}