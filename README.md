<p>
  <a href="https://root.conedevelopment.com/">
    <br>
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="./.github/root-logo-dark.svg">
      <source media="(prefers-color-scheme: dark)" srcset="./.github/root-logo-light.svg">
      <img alt="Root" width="87" src="./.github/root-logo-dark.svg">
    </picture>
    <br>
  </a>
</p>

**Root uses [11ty](https://www.11ty.dev/) for its documentation (v2).**

[![Netlify Status](https://api.netlify.com/api/v1/badges/ebbca775-ad23-4ae1-8079-73af81b31fe0/deploy-status)](https://app.netlify.com/sites/conedevelopment-root/deploys)

## Get Up and Running

We use `eleventy --serve` and compile Sass with sass-cli with npm scripts.

1. **Clone the repository**

2. **Install the dependencies**

    In the `package.json` file, you will find all of the dependencies (and scripts) to install them using the following command:

    ```shell
    npm install
    ```

3. **Run the development mode**

    To run the development mode, use the `npm run start`. This script will also watch for changes.

    ```shell
    npm run start
    ```

4. **Run the production mode**

    Before you go live, you should use the production script to compress the Sass files.

    ```shell
    npm run build
    ```

## SCSS

The project compiles the SCSS files from the `./src/scss` folder into the `./src/css` folder. The project includes [Spruce CSS](https://sprucecss.com/), which gives the styling with some [Spruce UI](https://sprucecss.com/ui/getting-started/introduction/) components.

## Other Scripts

- **sass:lint/sass:lint:fix** You can lint your SCSS files with [Stylelint](https://stylelint.io/) and [stylelint-config-sass-guidelines](https://github.com/bjankord/stylelint-config-sass-guidelines) preset with the `npm run sass:lint` command. Use the `npm run sass:lint:fix` command if you want automatic fixes.
