import * as models from "./Models"
import * as engine from "./Engine"
import * as providers from "./Providers"

async function main(): Promise<void> {
    let downloader = new engine.FetchEngine();

    let downloaderOptions = new engine.FetchEngineOptions();
    downloaderOptions.downloadFileTimeoutInMinutes = 5;
    downloaderOptions.downloadPattern = "**";
    downloaderOptions.parallelDownloadLimit = 4;
    downloaderOptions.retryIntervalInSeconds = 3;
    downloaderOptions.retryLimit = 2;

    var itemsUrl = "http://redvstt-lab43:8080/job/AngoyaJob/8/api/json?tree=artifacts[*]"
    var variables = {
        "endpoint": {
            "url": "http://redvstt-lab43:8080"
        },
        "definition": "AngoyaJob",
        "version": "5"
    };

    var webProvider = new providers.WebProvider(itemsUrl, "jenkins.handlebars", "admin", "jenkins123", variables);


    itemsUrl = "https://panditaomesh.visualstudio.com/_apis/resources/Containers/573756?itemPath=sources&isShallow=true"
    var vstsVariables = {};
    var webProvider = new providers.WebProvider(itemsUrl, "vsts.handlebars", "", "", vstsVariables);

    itemsUrl = "https://teamcity.jetbrains.com/httpAuth/app/rest/builds/id:1111970/artifacts/children/"
    var teamcityVariables = {
        "endpoint": {
            "url": "https://teamcity.jetbrains.com"
        },
        "version": "12345"
    };
    var webProvider = new providers.WebProvider(itemsUrl, "teamcity.handlebars", "panditaomesh", "12345", teamcityVariables);

    var localFileProvider = new providers.LocalFilesystemProvider("C:\\work\\VMSS\\ild")
    var localFileProvider2 = new providers.LocalFilesystemProvider("C:\\work\\VMSS\\ild4")
    var blobProvider = new providers.AzureBlobProvider("bishalpackerimages", "parallel", "oxCuLt64HbrEH7XYol6ho/noLhsiVPPB1UrrXaQ+Ytah7sVYOMAdK96QgiAuN3nK4KfFJavAtqr1EvqYjfvgFA==")

    await downloader.processItems(localFileProvider, blobProvider, downloaderOptions);
}

main();
