import * as models from "./Models"
import * as engine from "./Engine"
import * as providers from "./Providers"

async function main(): Promise<void> {
    let processor = new engine.ArtifactEngine();

    let options = new engine.ArtifactEngineOptions();
    options.FileProcessingTimeoutInMinutes = 5;
    options.filePattern = "**";
    options.parallelProcessingLimit = 4;
    options.retryIntervalInSeconds = 3;
    options.retryLimit = 2;

    var itemsUrl = "http://redvstt-lab43:8080/job/ArtifactJob/5/api/json?tree=artifacts[*]"
    var variables = {
        "endpoint": {
            "url": "http://redvstt-lab43:8080"
        },
        "definition": "ArtifactJob",
        "version": "5"
    };

    var jenkinsProvider = new providers.WebProvider(itemsUrl, "jenkins.handlebars", process.env["JENKINS_USER"], process.env["JENKINS_PASSWORD"], variables);


    itemsUrl = "https://panditaomesh.visualstudio.com/_apis/resources/Containers/573756?itemPath=sources&isShallow=true"
    var vstsVariables = {};
    var vstsProvider = new providers.WebProvider(itemsUrl, "vsts.handlebars", "", "", vstsVariables);

    itemsUrl = "https://teamcity.jetbrains.com/httpAuth/app/rest/builds/id:1111970/artifacts/children/"
    var teamcityVariables = {
        "endpoint": {
            "url": "https://teamcity.jetbrains.com"
        },
        "version": "12345"
    };
    var teamcityProvider = new providers.WebProvider(itemsUrl, "teamcity.handlebars", process.env["TEAMCITY_USER"], process.env["TEAMCITY_PASSWORD"], teamcityVariables);

    var localFileProvider = new providers.LocalFilesystemProvider("C:\\drop")

    var blobProvider = new providers.AzureBlobProvider("bishalpackerimages", "parallel", process.env["AZURE_STORAGE_KEY"])

    await processor.processItems(jenkinsProvider, localFileProvider, options);
    await processor.processItems(vstsProvider, localFileProvider, options);
    await processor.processItems(teamcityProvider, localFileProvider, options);
    await processor.processItems(localFileProvider, blobProvider, options);
}

main();
