# 2023-12-09-ooni-javascript

This repository implements an experimental JavaScript console for OONI Probe.

This repository requires exactly Go 1.20.11. Using a different version of Go may work
as intended but is not recommended: we depend on packages forked from the standard library; so, it
is more robust to use the same version of Go from which we forked those packages from.

## Debian developer setup

The following commands show how to setup a development environment using Debian 12 ("bookworm"). The
same instructions should also work for Debian-based distribution (e.g., Ubuntu).

```bash
# install the compilers, git, and the root CA
sudo apt install golang build-essential ca-certificates git

# [optional] install mingw-w64 if you're targeting windows
sudo apt install mingw-w64

# install the required go version binary
go install -v golang.org/dl/go1.20.11@latest

# fetch the whole go distribution
$HOME/go/bin/go1.20.11 download
```

## Fedora developer setup

The following commands show how to setup a development environment using Fedora.

```bash
# install the compilers and git
sudo dnf install golang make gcc gcc-c++ git

# [optional] install mingw-w64 if you're targeting windows
sudo dnf install mingw64-gcc mingw64-gcc-c++

# install the required go version binary
go install -v golang.org/dl/go1.20.11@latest

# fetch the whole go distribution
$HOME/go/bin/go1.20.11 download
```

## macOS developer setup

The following commands show how to setup a development environment using macOS. We assume you
have already installed Homebrew, which should also install the Xcode command line tools.

Then, you need to follow these instructions:

```bash
# install the compiler
brew install go

# install the required go version binary
go install -v golang.org/dl/go1.20.11@latest

# fetch the whole go distribution
$HOME/go/bin/go1.20.11 download
```

## Build instructions

Once you have installed the correct Go version and a C compiler, you can compile using:

```bash
$HOME/go/bin/go1.20.11 build -v -ldflags '-s -w' ./cmd/jsconsole
```

This command will generate a stripped binary called `jsconsole` in the toplevel directory.

## Usage

Create a script that runs the `signal` experiment as follows:

```JavaScript
"use strict"

const signal = require("ooni/experiment/signal")

console.log(signal.experimentName())
console.log(signal.experimentVersion())
console.log(signal.run())
```

save it as `main.js` and run it using:

```bash
./jsconsole main.js
```

## Repository structure

We use [ooni/probe-engine](https://github.com/ooni/probe-engine) to import
internal OONI Probe packages. We implement these [internal](internal) packages:

* [dslvm](internal/dslvm/): low-level DSL implementation;
* [dslengine](internal/dslengine/): engine for running the low-level DSL;
* [dsljson](internal/dsljson/): JSON representation for the DSL;
* [dsljavascript](internal/dsljavascript/): JavaScript DSL implementation.

We use [dop251/goja](https://github.com/dop251/goja) as the JavaScript engine.

The [javascript](javascript) directory contains JavaScript code:

* [javascript/golang](javascript/golang/) contains wrappers to invoke
Go functions from JavaScript;

* [javascript/ooni/experiment](javascript/ooni/experiment/) contains
the JavaScript implementation of OONI experiments;

* [javascript/ooni/analysis.js](javascript/ooni/analysis.js) implements
analyzing OONI measurements;

* [javascript/ooni/dsl.js](javascript/ooni/dsl.js) allows to create
and run a JSON-encoded DSL using JavaScript code.
