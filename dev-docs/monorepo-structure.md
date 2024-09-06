# Monorepo structure

The following is an attempt as providing a maintainable structure for monorepos.

## Components types

A monorepo is composed of two types of components:
- Applications, deployable units that provide a complete set of business functionalities.
- Libraries, providing a specific set of functionalities and are composed into applications.

## Folder structure

Here is an example folder structure:

```
.
├── apps
│   ├── server
│   ├── server-e2e
│   ├── web
│   ├── web-e2e
├── libs
│   ├── server
│   │   ├── auth
│   │   ├── threads
│   ├── web
│   │   ├── shared
│   │   │   ├── ui
│   │   │   ├── utils
│   │   ├── auth
│   │   ├── chat
├── package.json
├── README.md
```

Applications live in the `apps` folder.
Libraries follow the following naming convention:
`libs/<platform>/<scope>`, where:

- `platform` designates the platform on which the library is intended to run, e.g `server`, `web`, `mobile`, `cross-platform`, etc.
- `scope` designates the bounded context of the library, segregating the business responsibilities of the library.
