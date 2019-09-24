const github = require('@actions/github');
const core = require('@actions/core');

// const exec = require('@actions/exec');
const cmd = require('node-cmd');


try {
    // const greet = core.getInput('who-to-greet');
    // console.log(`greeting: ${greet}`);

    console.log('env token:' + process.env.GITHUB_TOKEN);
    console.log('env secret:' + process.env.YOS_SEC);

    const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

    // async function f1() {
    //   try {
    //     const newIssue = await octokit.issues.create({
    //       owner: 'whitesource-yossi',
    //       repo : 'GitHubActionTesting2',
    //       title: 'New issue!',
    //       body: 'Hello Universe!'
    //     });
    //
    //     console.log('issue : ' + JSON.stringify(newIssue));
    //   } catch (e) {
    //     console.error("error" + e);
    //   }
    // }
    //
    // let promise = f1();

    // exec.exec('docker -v');
    // exec.exec('docker login docker.pkg.github.com -u whitesource-yossi -p ' + process.env.YOS_SEC);
    // exec.exec('docker pull docker.pkg.github.com/whitesource-yossi/githubactiontesting2/localdjango:1.0');


    // exec.exec('docker images');
    //
    // exec.exec('docker logout');
    // exec.exec('docker login docker.pkg.github.com -u whitesource-yossi -p ' + process.env.GITHUB_TOKEN);


    cmd.get(
        'docker -v',
        function (err, data, stderr) {
            console.log('docker version is : ', data)
        }
    );

    cmd.get(
        'docker login docker.pkg.github.com -u whitesource-yossi -p ' + process.env.YOS_SEC,
        function (err, data, stderr) {
            if (data) {
                console.log('docker login response ', data);

                cmd.get(
                    'docker pull docker.pkg.github.com/whitesource-yossi/githubactiontesting2/localdjango:1.0',
                    function (err, data, stderr) {
                        if (data) {
                            console.log('docker pull result ', data);
                            let uaCommand = 'java -jar .\\wss-unified-agent-19.9.1.jar -d . -apiKey ' + process.env.YOS_API_KEY + ' -projectToken ' + process.env.YOS_PROJ + ' -noConfig true -generateScanReport true -userKey ' + process.env.YOS_USER_KEY;
                            console.log('ua run command is: ', uaCommand);

                            cmd.get(
                                'docker images',
                                function (err, data, stderr) {
                                    if (data) {
                                        console.log('docker images: ', data);

                                        cmd.get(uaCommand,
                                            function (err, data, stderr) {
                                                if (data) {
                                                    console.log('ua run result: ', data);
                                                } else {
                                                    console.log('ua error: ', stderr);
                                                }
                                            }
                                        );
                                        // cmd.get(
                                        //     'docker logout',
                                        //     function(err, data, stderr){
                                        //         if (data) {
                                        //             console.log('docker logout : ', data);
                                        //
                                        //             cmd.get(
                                        //                 'docker login docker.pkg.github.com -u whitesource-yossi -p ' + process.env.GITHUB_TOKEN,
                                        //                 function(err, data, stderr){
                                        //                     if (data) {
                                        //                         console.log('docker login with GitHub token is : ',data);
                                        //                     }
                                        //
                                        //                     if (stderr){
                                        //                         console.log('docker login with GitHub token error is : ',stderr);
                                        //                     }
                                        //                 }
                                        //             );
                                        //         } else {
                                        //             console.log('docker logout error: ', stderr);
                                        //         }
                                        //     }
                                        // );
                                    } else {
                                        console.log('docker images error: ', stderr);
                                    }
                                }
                            );
                        } else {
                            console.log('docker pull error ', stderr)
                        }
                    }
                );
            } else {
                console.log('docker login error ', stderr)
            }
        }
    );


    // cmd.get(
    //     'docker -v',
    //     function(err, data, stderr){
    //       console.log('the current working dir is : ',data)
    //     }
    // );


    // // `who-to-greet` input defined in action metadata file
    // const nameToGreet = core.getInput('who-to-greet');
    // console.log(`Hello ${nameToGreet}!`);
    // const time = (new Date()).toTimeString();
    // core.setOutput("time", time);
    // // Get the JSON webhook payload for the event that triggered the workflow
    // const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}