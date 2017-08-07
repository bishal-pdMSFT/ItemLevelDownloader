export class ProcessEngineOptions {
    retryLimit: number = 5;
    retryIntervalInSeconds: number = 5;
    ProcessFileTimeoutInMinutes: number = 5;
    parallelProcessingLimit: number = 10;
    filePattern: string = '**';
}