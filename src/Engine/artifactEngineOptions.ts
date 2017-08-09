export class ArtifactEngineOptions {
    retryLimit: number = 5;
    retryIntervalInSeconds: number = 5;
    FileProcessingTimeoutInMinutes: number = 5;
    parallelProcessingLimit: number = 10;
    filePattern: string = '**';
}