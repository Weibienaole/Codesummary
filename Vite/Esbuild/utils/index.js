const createScript = src => `<script type="module" src="${src}"></script>`
const createLink = src => `<link rel="stylesheet" href="${src}"></link>`
const generateHTML = (scripts, links) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0,user-scalable=no">
  <title>ESBuild app</title>
  ${links.join('\n')}
</head>
<style>

</style>

<body>
  <div id="root">
  </div>
</body>

${scripts.join("\n")}

</html>
`

module.exports =  { createScript, createLink, generateHTML}