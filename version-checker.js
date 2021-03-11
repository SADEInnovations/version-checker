const path = require("path");
const cp = require("child_process");
const semverCompare = require("semver/functions/gt");

// Input parameters. See action.yaml
const { INPUT_PATH, INPUT_TOKEN } = process.env;
const event = require(process.env.GITHUB_EVENT_PATH);
const file = path.join(INPUT_PATH, "package.json");

// Fetch the base package.json file
// https://developer.github.com/v3/repos/contents/#get-contents
const res = cp.spawnSync("curl", [
  "--header",
  "Accept: application/vnd.github.v3.raw",
  "--header",
  `Authorization: token ${INPUT_TOKEN}`,
  `${event.repository.url}/contents/${file}?ref=${event.pull_request.base.ref}`,
]);

if (res.status != 0) {
  console.log(`::error ::${res.stderr.toString()}`);
  process.exit(res.status);
}

const base = JSON.parse(res.stdout.toString());
const head = require(path.resolve(process.cwd(), file));

console.log(`${base.name} v${base.version} => ${head.name} v${head.version}`);

if (base.name == head.name) {
  const isGreater = semverCompare(head.version, base.version)
  if (!isGreater) {
    console.log(
        `::error file=${file},line=3::semVer comparison: Version number not updated!`
    );
    process.exit(1);
  }
} else {
  console.log(`::error file=${file},line=2::Package has a different name.`);
  process.exit(1);
}

// Output version
console.log(`::set-output name=version::${head.version}`);
