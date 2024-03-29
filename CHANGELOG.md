# [4.0.0](https://github.com/temarusanov/logardian/compare/v3.2.0...v4.0.0) (2022-10-21)


### Bug Fixes

* otel to devDeps for npm ci ([d18594f](https://github.com/temarusanov/logardian/commit/d18594fcafc8d66393e408dfc7921bfdf1df89d7))
* remove console.logs ([1744734](https://github.com/temarusanov/logardian/commit/1744734afdcc7fe54131f0482802404e37d168fb))


* Merge pull request #33 from temarusanov/fix/trace-id ([b24970a](https://github.com/temarusanov/logardian/commit/b24970ab522bbcba60ae65267d71d9802c9be2ba)), closes [#33](https://github.com/temarusanov/logardian/issues/33)


### Features

* otel trace ids ([b5f4bb2](https://github.com/temarusanov/logardian/commit/b5f4bb20ad9c9c4da431d6b7509933f290a433bc))


### BREAKING CHANGES

* now with OTEL support

# [3.2.0](https://github.com/temarusanov/logardian/compare/v3.1.0...v3.2.0) (2022-10-13)


### Features

* add getTraceId function ([b05d541](https://github.com/temarusanov/logardian/commit/b05d541c74a9557f9d8c5c15273c10915ceed4f3))

# [3.1.0](https://github.com/temarusanov/logardian/compare/v3.0.0...v3.1.0) (2022-10-06)


### Features

* add color config, redesign logs ([a7ddf62](https://github.com/temarusanov/logardian/commit/a7ddf626f59fe1510751db1d2ce55d0dec41d719))
* add glob pattern for labels ([bd5ba00](https://github.com/temarusanov/logardian/commit/bd5ba00b05b51ed7891c72de2c54caca353f844e))

# [3.0.0](https://github.com/temarusanov/logardian/compare/v2.1.0...v3.0.0) (2022-10-05)


### Features

* add async hooks and trace id ([b0be1ca](https://github.com/temarusanov/logardian/commit/b0be1ca4c6d2a51fd4273776e4d68db5cb226810))
* remove json log space indentation ([eb8e5e8](https://github.com/temarusanov/logardian/commit/eb8e5e82daeb9181c6aea99cc2721cf4bbe3c990))
* update deps ([a2cd79f](https://github.com/temarusanov/logardian/commit/a2cd79fa6b8bab17fefd1d80140550f485309a2b))


### BREAKING CHANGES

* move to nodejs 16.17.1

# [2.1.0](https://github.com/temarusanov/logardian/compare/v2.0.2...v2.1.0) (2022-09-27)


### Features

* add timer feature ([0b70818](https://github.com/temarusanov/logardian/commit/0b7081884fcb43b79184d27018ff7ef0cc14a87e))

## [2.0.2](https://github.com/temarusanov/logardian/compare/v2.0.1...v2.0.2) (2021-12-17)


### Bug Fixes

* add stacktrace regex ([6a28df1](https://github.com/temarusanov/logardian/commit/6a28df110556415bee5fca62cdd091b32ac68f05))

## [2.0.1](https://github.com/temarusanov/logardian/compare/v2.0.0...v2.0.1) (2021-11-05)


### Bug Fixes

* function trace off priority ([cb93fee](https://github.com/temarusanov/logardian/commit/cb93feea897a6c4f6e13cb03a2bd7cc17a03a30c))

# [2.0.0](https://github.com/temarusanov/logardian/compare/v1.4.0...v2.0.0) (2021-11-05)


* Merge pull request #27 from temarusanov/feat/improvements ([ad409e7](https://github.com/temarusanov/logardian/commit/ad409e7674fccf17ff47c4450e4e71d99c0cf6b3)), closes [#27](https://github.com/temarusanov/logardian/issues/27)


### Features

* **refactor:** migrate from .env settings to incode config ([8930e4f](https://github.com/temarusanov/logardian/commit/8930e4f3844987e9cd6a183a47b70f04f09bf6fc))


### BREAKING CHANGES

* .env config will not work in this version

# [1.4.0](https://github.com/temarusanov/logardian/compare/v1.3.2...v1.4.0) (2021-11-05)


### Features

* prod mode dont show json logs, new env setting now ([a87797f](https://github.com/temarusanov/logardian/commit/a87797facf5c67b14c3b222ee5c2ec0793b3a04b))

## [1.3.2](https://github.com/temarusanov/logardian/compare/v1.3.1...v1.3.2) (2021-11-04)


### Bug Fixes

* options undefined in error log ([ab1a06e](https://github.com/temarusanov/logardian/commit/ab1a06ee4a43911f817a937f0636fe5474ee0e09))

## [1.3.1](https://github.com/temarusanov/logardian/compare/v1.3.0...v1.3.1) (2021-11-04)


### Bug Fixes

* stack undefined check ([a0a72f5](https://github.com/temarusanov/logardian/commit/a0a72f5c1d9a2f43550b2ebdab741eda7e8bd4c7))

# [1.3.0](https://github.com/temarusanov/logardian/compare/v1.2.0...v1.3.0) (2021-11-04)


### Features

* **refactor:** fully abandon the winston to stdout, using nestjs logger as a base ([2940b2e](https://github.com/temarusanov/logardian/commit/2940b2e280e902cd689908b72257f51ac2991eb9))

# [1.2.0](https://github.com/i-link-pro-team/logardian/compare/v1.1.1...v1.2.0) (2021-09-30)


### Bug Fixes

* caller and trace shows in prod mode ([49159ef](https://github.com/i-link-pro-team/logardian/commit/49159ef97766157ba0c20969401e1ee6210cbf58))
* function caller error ([5f4fa6b](https://github.com/i-link-pro-team/logardian/commit/5f4fa6b36f691b541f706ae286d63a9fa0d0e0f5))


### Features

* add docs to prod mode ([aec726b](https://github.com/i-link-pro-team/logardian/commit/aec726bc2b6491f37d74de9d744579aef26212a8))
* add docs, rebase ([af76aaa](https://github.com/i-link-pro-team/logardian/commit/af76aaa9db47840f95b4a24f3c6581786ee3f640))

## [1.1.1](https://github.com/i-link-pro-team/logardian/compare/v1.1.0...v1.1.1) (2021-09-24)


### Bug Fixes

* add milliseconds to date log ([dae933d](https://github.com/i-link-pro-team/logardian/commit/dae933dbf44e42927fc24a6a9c2706e67fa1dc2a))
* production log didnt show metadata ([9d70071](https://github.com/i-link-pro-team/logardian/commit/9d70071497ad0bbb262885f14a50a9c86172fc55))

# [1.1.0](https://github.com/i-link-pro-team/logardian/compare/v1.0.2...v1.1.0) (2021-09-23)


### Features

* templates for issue ([8816803](https://github.com/i-link-pro-team/logardian/commit/881680303c920324938d5a9bda14aa3ea34e4091))

## [1.0.2](https://github.com/i-link-pro-team/logardian/compare/v1.0.1...v1.0.2) (2021-09-23)


### Bug Fixes

* remove dateformat, use common date ([a3f2381](https://github.com/i-link-pro-team/logardian/commit/a3f2381f9567faba847a7cc2ee34fad8836fad01))

## [1.0.1](https://github.com/i-link-pro-team/logardian/compare/v1.0.0...v1.0.1) (2021-09-23)


### Bug Fixes

* remove pull_request from github workflow ([719a88f](https://github.com/i-link-pro-team/logardian/commit/719a88f90bd3b7091415f0781f7cdbee73a099ba))

# 1.0.0 (2021-09-23)


### Bug Fixes

* github workflow yaml ([fd4bae8](https://github.com/i-link-pro-team/logardian/commit/fd4bae8358ca5e6cc20fe4172a4c8a237bb6d951))
* github workflow yaml ([af00233](https://github.com/i-link-pro-team/logardian/commit/af00233800b0a2ef483269c2e61fb68603f7facb))
* github workflow yaml ([8c0a45f](https://github.com/i-link-pro-team/logardian/commit/8c0a45f78b5190f81284a7cd61210120f1cb1b62))
* github workflow yaml ([78e9970](https://github.com/i-link-pro-team/logardian/commit/78e997035e36bc6e19f735d62e07b04e6642138d))
* github workflow yaml ([2f6fd9d](https://github.com/i-link-pro-team/logardian/commit/2f6fd9db56aa0476b5197ca5afedde25278a736d))


### Features

* initial commit ([8cd2d40](https://github.com/i-link-pro-team/logardian/commit/8cd2d40d58df4ace04bd00af7af468313c3a6250))
