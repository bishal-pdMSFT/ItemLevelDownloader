import * as path from 'path';
import * as fs from 'fs';

var minimatch = require('minimatch');

import * as models from '../Models';
import { ArtifactItemStore } from '../Store/artifactItemStore';
import { FetchEngineOptions } from "./fetchEngineOptions"

export class FetchEngine {
    async processItems(sourceProvider: models.ISourceArtifactProvider, destProvider: models.IDestinationArtifactProvider, fetchEngineOptions: FetchEngineOptions): Promise<void> {
        const processors: Promise<{}>[] = [];
        const itemsToPull: models.ArtifactItem[] = await sourceProvider.getRootItems();
        this.artifactStore.addItems(itemsToPull);

        for (let i = 0; i < fetchEngineOptions.parallelDownloadLimit; ++i) {
            processors.push(new Promise(async (resolve, reject) => {
                try {
                    while (true) {
                        const item = this.artifactStore.getNextItemToProcess();
                        if (!item) {
                            break;
                        }

                        console.log("Dequeued item " + item.path + " for processing.");
                        await this.processArtifactItem(sourceProvider, item, destProvider, fetchEngineOptions.downloadPattern, fetchEngineOptions.retryLimit);
                    }

                    console.log("Exiting worker nothing more to process");

                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            }));
        }

        await Promise.all(processors);
    }

    processArtifactItem(sourceProvider: models.ISourceArtifactProvider,
        item: models.ArtifactItem,
        destProvider: models.IDestinationArtifactProvider,
        filePattern: string,
        retryLimit: number,
        retryCount?: number): Promise<{}> {
        return new Promise(async (resolve, reject) => {
            try {
                retryCount = retryCount ? retryCount : 0;
                if (item.itemType === models.ItemType.File) {
                    if (minimatch(item.path, filePattern)) {
                        console.log("Processing '%s' (file %d of %d)", item.path);
                        const contentStream = await sourceProvider.getArtifactItem(item);
                        console.log("got read stream for item: " + item.path);
                        var movedItem = await destProvider.putArtifactItem(item, contentStream);
                        console.log("moved item to uri: " + movedItem.metadata["downloadUrl"]);
                        resolve();
                    }
                    else {
                        console.log("Skipping processing of item " + item.path);
                        resolve();
                    }
                }
                else {
                    var items = await sourceProvider.getArtifactItems(item);
                    items = items.map((value, index) => {
                        if(!value.path.startsWith(item.path)){
                            value.path = path.join(item.path, value.path);
                        }

                        return value;
                    });

                    this.artifactStore.addItems(items);

                    console.log("Enqueued " + items.length + " for processing.");
                    resolve();
                }
            } catch (err) {
                console.log("Error processing file %s: %s", item.path, err);
                if (retryCount === retryLimit - 1) {
                    reject(err);
                } else {
                    process.nextTick(() => this
                        .processArtifactItem(sourceProvider, item, destProvider, filePattern, retryLimit, retryCount + 1));
                }
            }
        });
    }
    private artifactStore: ArtifactItemStore = new ArtifactItemStore();
}