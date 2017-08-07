﻿export class FetchEngineOptions {
    retryLimit: number = 5;
    retryIntervalInSeconds: number = 5;
    downloadFileTimeoutInMinutes: number = 5;
    parallelDownloadLimit: number = 10;
    downloadPattern: string = '**';
}