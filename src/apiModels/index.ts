import type { Values } from '@/utils';

export enum KnownPlatforms {
    Local = 'Local',
    Other = 'Other',
    YouTube = 'YouTube',
}

export type Platform = `${KnownPlatforms}` | (string & {});

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
    lastSuccessfulFetch?: string;
    lastUnsuccessfulFetch?: string;
}

export interface AuthorSearchRequestDtoV1 extends PaginationQuery {
    name?: string | null;
    authorIds?: string[] | null;
    excludeAuthorIds?: string[] | null;
}

export interface AuthorSearchResponseDtoV1 extends PaginationResult {
    authors: AuthorSimpleDtoV1[];
}

export interface AuthorSimpleDtoV1 {
    id: string;
    userName: string | null;
    displayName: string | null;
    platform: Platform;
    profileImages: ImageDtoV1[];
    idOnPlatform: string;
    urlOnPlatform?: string;
}

export interface ImageDtoV1 {
    id: string;
    platform: Platform;
    idOnPlatform: string | null;

    key: string | null;
    quality: string | null;
    ext: string | null;

    originalUrl: string | null;
    localUrl: string | null;
    localFilePath: string | null;
    url: string | undefined;

    width: number | null;
    height: number | null;
}

export interface TextTranslationDtoV1 {
    id: string;
    content: string;
    culture: string | null;

    validSince: string | null;
    validUntil: string | null;
}

export const VideoSortingOptions = {
    CreatedAt: 'CreatedAt',
    Duration: 'Duration',
} as const;

export interface VideoSearchDtoV1 extends PaginationQuery {
    nameQuery: string | null;
    authorQuery: string | null;
    authorIds: string[] | null;

    sortingOptions: Values<typeof VideoSortingOptions>;
    descending: boolean;
}

export interface VideoSearchResponseDtoV1 {
    paginationResult: PaginationResult;
    videos: VideoSimpleDtoV1[];
}

export interface VideoSimpleDtoV1 {
    id: string;
    title: TextTranslationDtoV1[];
    description: TextTranslationDtoV1[];

    thumbnail: ImageDtoV1 | null;

    durationSeconds: number;

    platform: Platform;
    idOnPlatform: string;

    authors: AuthorSimpleDtoV1[];

    createdAt: string | null;
    publishedAt: string | null;
    addedToArchiveAt: string | null;

    externalUrl: string | null;
    embedUrl: string | null;

    lastCommentsFetch: string | null;
}

export interface PaginationBase {
    page: number;
    limit: number;
}

export type PaginationQuery = PaginationBase;

export interface PaginationResult {
    page: number;
    limit: number;
    amountOnPage: number;
    totalResults: number | null;
}

export interface LinkSubmissionRequestDtoV1 {
    url: string;
}

export interface LinkSubmissionResponseDtoV1 {
    submissionId: string;
    type: EntityType;
    platform: Platform;
    idOnPlatform: string;
}

export interface AccessTokenDtoV1 {
    token: string;
    expiresAt: string;
}

export interface CommentDtoV1 extends Fetchable {
    id: string;
    platform: Platform;
    idOnPlatform: string;

    privacyStatusOnPlatform?: PrivacyStatus;
    isAvailable: boolean;
    privacyStatus: PrivacyStatus;

    addedToArchiveAt: string;

    author: AuthorSimpleDtoV1;

    conversationReplies?: CommentDtoV1[];
    directReplies?: CommentDtoV1[];

    content?: string;

    createdAt?: string;
    updatedAt?: string;
    authorIsCreator?: boolean;

    createdAtVideoTimeSeconds: number;

    orderIndex: number;

    statistics?: CommentStatisticSnapshotDtoV1;

    videoId: string;
}

export interface CommentStatisticSnapshotDtoV1 {
    likeCount?: number;
    dislikeCount?: number;
    replyCount?: number;
    isFavorited?: number;

    validAt?: string;
}

export interface CommentRootsResponseDtoV1 {
    comments: CommentDtoV1[];
    paginationResult: PaginationResult;
}

export interface VideoDownloadStatisticsByPlatformResponseDtoV1 {
    videoDownloadStatistics: VideoDownloadStatisticByPlatformDtoV1[];
}

export interface VideoDownloadStatisticByPlatformDtoV1 {
    platform: Platform;
    hasVideoFile: boolean;
    count: number;
}

export interface AuthorArchivalSettingsDtoV1 {
    id: string;
    authorId: string;
    isEnabledForArchival: boolean;
    archiveVideos: boolean;
    archiveClips: boolean;
    archivePlaylists: boolean;
}

export interface AuthorArchivalSettingsUpsertDtoV1 {
    isEnabledForArchival: boolean;
    archiveVideos: boolean;
    archiveClips: boolean;
    archivePlaylists: boolean;
}

export interface VideoArchivalSettingsDtoV1 {
    shouldRegularlyFetchVideoData: boolean;
}

export const SettingTypes = {
    Long: 'Long',
    String: 'String',
    Bool: 'Bool',
    DataSizeBytes: 'DataSizeBytes',
} as const;

export type SettingType = typeof SettingTypes[keyof typeof SettingTypes];

interface SettingDefinitionDtoV1<T> {
    key: string;
    defaultValue: T | null;
}

interface SettingValueDtoV1Base<T, TDiscriminator extends SettingType> {
    ['$type']: TDiscriminator;
    definition: SettingDefinitionDtoV1<T>;
    value: T | null;
}

export type SettingValueDtoV1_Long = SettingValueDtoV1Base<number, typeof SettingTypes.Long>;
export type SettingValueDtoV1_String = SettingValueDtoV1Base<string, typeof SettingTypes.String>;
export type SettingValueDtoV1_Boolean = SettingValueDtoV1Base<boolean, typeof SettingTypes.Bool>;
export type SettingValueDtoV1_DataSizeBytes = SettingValueDtoV1Base<number, typeof SettingTypes.DataSizeBytes>;

export type SettingValueDtoV1 =
    SettingValueDtoV1_Long |
    SettingValueDtoV1_String |
    SettingValueDtoV1_Boolean |
    SettingValueDtoV1_DataSizeBytes;

export interface DataFetchDtoV1 {
    id: string;
    occurredAt: string;
    success: boolean;
    type: string;
    shouldAffectValidity: boolean;
    source: string;

    videoId: string | null;
    authorId: string | null;
}

export interface DataFetchesResponseDtoV1 extends PaginationResult {
    dataFetches: DataFetchDtoV1[];
}

export interface DataFetchesQueryDtoV1 extends PaginationQuery{
    type?: string;
    source?: string;
    occurredAtFrom?: string;
    occurredAtTo?: string;
    success?: boolean;
    orderByDescending: boolean;
}