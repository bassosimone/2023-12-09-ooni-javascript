# 2023-12-09-ooni-javascript

This repository implements an experimental JavaScript console for OONI Probe.

This repository requires exactly Go 1.20.11. Using a different version of Go may work
as intended but is not recommended: we depend on packages forked from the standard library; so, it
is more robust to use the same version of Go from which we forked those packages from.

The following commands show how to setup a development environment using Debian 12 ("bookworm"). The
same instructions should also work for Debian-based distribution (e.g., Ubuntu).

## Debian developer setup

```console
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

```console
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

```console
# install the compiler
brew install go

# install the required go version binary
go install -v golang.org/dl/go1.20.11@latest

# fetch the whole go distribution
$HOME/go/bin/go1.20.11 download
```

## Build instructions

Once you have installed the correct Go version and a C compiler, you can compile using:

```console
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

```console
./jsconsole main.js
```
