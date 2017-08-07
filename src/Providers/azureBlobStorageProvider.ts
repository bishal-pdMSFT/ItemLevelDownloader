import * as path from 'path';
import * as fs from 'fs';
import * as azureStorage from 'azure-storage';
import * as models from "../Models"
import * as Stream from "stream";

export class AzureBlobProvider implements models.IDestinationArtifactProvider {
    constructor(storageAccount: string, container: string, accessKey: string) {
        this._storageAccount = storageAccount;
        this._accessKey = accessKey;
        this._container = container;
        this._blobSvc = azureStorage.createBlobService(this._storageAccount, this._accessKey);
    }

    public putArtifactItem(item: models.ArtifactItem, readStream: Stream.Readable): Promise<models.ArtifactItem> {
        return new Promise(async (resolve, reject) => {
            // ensure container is already created
            await this._ensureContainerExistence();

            var self = this;
            console.log("Uploading '%s' (file %d of %d)", item.path);
            var writeStream = this._blobSvc.createWriteStreamToBlockBlob(this._container, item.path, null, function(error, result, response){
                if(error) {
                    console.log("Failed to create blob " + item.path + ". Error: " + error.message);
                    reject(error);
                } else {
                    console.log("Created blob for item " + item.path);
                    var blobUrl = self._blobSvc.getUrl(self._container, item.path);
                    item.metadata["downloadUrl"] = blobUrl;
                    resolve(item);
                }
            });

            readStream.pipe(writeStream);
            writeStream.on("error",
                (error) => {
                    reject(error);
                });
            readStream.on("error",
                (error) => {
                    reject(error);
                });
        });
    }

    private _ensureContainerExistence(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if(!this._isContainerExists) {
                var self = this;
                this._blobSvc.createContainerIfNotExists(this._container, function(error, result, response){
                    if(!!error){
                        console.log("Failed to create container " + self._container + ". Error: " + error.message);
                        reject(error);
                    } else {

                    self._isContainerExists = true;
                    console.log("Created container " + self._container);
                    resolve();
                    }
                });
            } else {

            resolve();
            }
        });
    }

    private _storageAccount: string;
    private _accessKey: string;
    private _container: string;
    private _isContainerExists: boolean = false;
    private _blobSvc: azureStorage.BlobService;
}