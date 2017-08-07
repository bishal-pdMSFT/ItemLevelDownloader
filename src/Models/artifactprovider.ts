import {ArtifactItem} from "./artifactItem"
import {Readable} from "stream";

export interface ISourceArtifactProvider {

    getRootItems(): Promise<ArtifactItem[]>;
    getArtifactItems(artifactItem: ArtifactItem): Promise<ArtifactItem[]>;
    getArtifactItem(artifactItem: ArtifactItem): Promise<Readable>;
}

export interface IDestinationArtifactProvider {

    putArtifactItem(artifactItem: ArtifactItem, stream: Readable): Promise<ArtifactItem>;
}