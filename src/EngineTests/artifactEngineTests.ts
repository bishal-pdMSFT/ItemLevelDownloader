﻿import * as mocha from "mocha";
import * as assert from "assert"

import * as engine from "../Engine"
import * as models from "../Models"
import * as providers from "../Providers"

describe('artifactEngine.fetchItems', () => {
    it('should call getRootItemsCalledCount for the given artifact provider', async () => {
        var testProvider = new providers.StubProvider();
        var localFileProvider = new providers.LocalFilesystemProvider("c:\\drop");
        await new engine.ArtifactEngine().processItems(testProvider, localFileProvider, new engine.ArtifactEngineOptions());

        assert.equal(testProvider.getRootItemsCalledCount, 1);
    });
});

describe('artifactEngine.fetchItems', () => {
    it('should call getArtifactItem for all artifact items', async () => {
        var testProvider = new providers.StubProvider();

        var localFileProvider = new providers.LocalFilesystemProvider("c:\\drop");
        await new engine.ArtifactEngine().processItems(testProvider, localFileProvider, new engine.ArtifactEngineOptions());

        assert.equal(testProvider.getArtifactItemCalledCount, 4);
    });
});

describe('artifactEngine.fetchItems', () => {
    it('should call getArtifactItems for all artifact items of type folder', async () => {
        var testProvider = new providers.StubProvider();

        var localFileProvider = new providers.LocalFilesystemProvider("c:\\drop");
        await new engine.ArtifactEngine().processItems(testProvider, localFileProvider, new engine.ArtifactEngineOptions());

        assert.equal(testProvider.getArtifactItemsCalledCount, 2);
    });
});

describe('artifactEngine.fetchItems', () => {
    it('should call getArtifactItem only for artifact that match the download pattern', async () => {
        var testProvider = new providers.StubProvider();
        var downloadOptions = new engine.ArtifactEngineOptions();
        downloadOptions.filePattern = '*path{4,5}\\**';

        var localFileProvider = new providers.LocalFilesystemProvider("c:\\drop");
        await new engine.ArtifactEngine().processItems(testProvider, localFileProvider, downloadOptions);

        assert.equal(testProvider.getArtifactItemCalledCount, 2);
    });
});
